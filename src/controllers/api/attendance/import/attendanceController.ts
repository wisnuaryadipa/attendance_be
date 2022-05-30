import { Nullable } from '@src/types/common';
import { IBaseAttendance } from './../../../../interfaces/db/IAttendance';
import { IBaseAttendanceRaw } from 'src/interfaces/db/IAttendanceRaw';
import express, {Request, Response} from "express";
import {attendanceControllers, BaseController} from "@src/controllers/api/index";
import {IOptions} from "@src/interfaces/IResponse"
import xlsx from 'xlsx';
import moment from 'moment';
import { time } from "console";
import _ from "lodash";
import services from "src/services";

interface ISessionAttend {
    sessionNumber: 1|2|3|99,
    hour: number,
    minute: number,
    statusAttend: "CHECKIN"|"CHECKOUT"|"ABNORMAL",
}

class Controller extends BaseController {

    pushToType = (attendance: any) : IBaseAttendanceRaw => {
        // Input : Attendance data from request parameter
        // Output : Attendance with datatype IBaseAttendance

        let _attendance: IBaseAttendanceRaw = {
            attendanceStatus: attendance,
            attendanceTime: attendance.Time ? attendance.Time : null,
            date: attendance.Date,
            employeeId: attendance['AC-No'],
            createdAt: moment().toDate(),
            updatedAt: moment().toDate(),
            visible: 1,
        }
        
        return _attendance;
    }

    requestHandler = async (req: Request, res: Response) => {
        // this.sendResponse(req, res, {data: req.file});
        let option: IOptions = {};
        try {
            if (req.file == undefined) {
                option.status = 400;
                option.message = "Please upload an excel file!";
                this.sendResponse(req, res, option);
            } else {
                let attendanceJson = this.parseExcelToJson(req.file);
                let attendJson = this.initiateAttendJson(attendanceJson);
                attendJson = this.addWorkDurationPropertiy(attendJson);
                await this.storeToDBNew(attendJson)

                option.status = 200;
                option.message = "success";
                option.data = attendJson;
                this.sendResponse(req, res, option);
            }
        }
        catch (err) {
            console.log(err);
            option.status = 500;
            option.message = "Could not upload the file";
            this.sendResponse(req, res, option);
        }
    }

    storeToDb = async (attendances: any) => {
        let number = 0;

        const passAttendanceToType = (attendance: any) : IBaseAttendance => {
            let _attendance: any = {};
            _attendance.attendanceStatus = 1;
            _attendance.employeeId = attendance['AC-No'];
            _attendance.attendanceTime = attendance.Time ? attendance.Time : null;
            _attendance.checkIn = attendance.checkIn 
            ? moment(attendance.checkIn, 'DD/MM/YYYY HH:mm').toDate() 
            : null;
            _attendance.checkOut = attendance.checkOut 
            ? moment(attendance.checkOut, 'DD/MM/YYYY HH:mm').toDate() 
            : null;
            _attendance.date = attendance.Date;
            _attendance.visible = 1;
            _attendance.createdAt = moment().toDate();
            _attendance.updatedAt = moment().toDate();
            _attendance.workDuration = attendance.workDuration;

            return _attendance
        }

        for await (const attendance of attendances) {
            number = number + 1;
            let _attendance: IBaseAttendance = passAttendanceToType(attendance);

            const prevDate: string = moment(attendance.Date, 'DD/MM/YYYY')
            .subtract('1', 'days')
            .format('DD/MM/YYYY');
            

            const currentDateCheck = await services.attendance.getAttendanceByDateEmployeeId(attendance['AC-No'], attendance.Date)

            if(!currentDateCheck) {
                const storing = await services.attendance.addAttendance(_attendance);
                const earlyDayCheckout = this.findCheckOutYesterday(attendance.listTimeAttend) 

                if(earlyDayCheckout){
                    const prevAttendance = await services.attendance
                    .getAttendanceByDateEmployeeId(attendance['AC-No'], prevDate);
                    if(prevAttendance){
                        prevAttendance.checkOut = this.convertDateStringToISO(
                            _attendance.date, 
                            earlyDayCheckout.hour, 
                            earlyDayCheckout.minute)
                        prevAttendance.workDuration = this.countWorkDuration(
                            prevAttendance.checkIn,
                            prevAttendance.checkOut);
                        prevAttendance.save();
                        console.log(prevAttendance.workDuration = this.countWorkDuration(
                            prevAttendance.checkIn,
                            prevAttendance.checkOut))
                    }
                }
            }
            
        }
        return number;
    }

    initiateAttendJson = (attendancesJson) => {
        /**
         * This function is initiate process. All process that run on this function will explain below
         * 1st Process : Remove duplicate registered attendance time.
         * 2nd Process : After there are no duplicate registered time, 
         *               in this 2nd process will identify which one is CheckIn or CheckOut every each day
         * 3rd Process : Find if there is checkOut that identified on 00:00 until 03:00 then place it on day -1
         * 
         */

        attendancesJson.map((attendanced:any, index) => {
            let removedDuplicAttend:[] = [];
            let checkOutYesterday: ISessionAttend;
            
            removedDuplicAttend = this.removeDuplicateAttendant(attendanced);
            attendanced.listTimeAttend = this.processAttendList(removedDuplicAttend);
            attendanced = this.identifyCurrenDayCheckInOut(attendanced);
            checkOutYesterday = this.findCheckOutYesterday(attendanced.listTimeAttend);

            if(index>0 && checkOutYesterday){
                /**
                 * Only execute when index more than 0 prevent accessing empty object on index before 0
                 * And did register checkout on 00:01 until 03:00
                 */
                attendancesJson[index-1]['checkOut'] = checkOutYesterday 
                ? this.convertToDateTimeFormat(
                    attendanced.Date, 
                    checkOutYesterday.hour, 
                    checkOutYesterday.minute) 
                : null;

                attendancesJson[index-1].checkOutStatus = (checkOutYesterday) 
                ? "CHECK OUT" 
                : "NOT CHECK OUT";
            }
            return attendanced;
        });
        return attendancesJson
    }

    processAttendList = (removedDuplicateAttendance: any): ISessionAttend[] => {
        let listAttend:ISessionAttend[] = [];
        let sessionAttend:ISessionAttend;
        removedDuplicateAttendance.forEach((timeAttend, index) => {
            // create sessionAttend object from attendance record
            sessionAttend = this.identifySessionINOUT(
                timeAttend, 
                removedDuplicateAttendance[index-1]
            );
            listAttend.push(sessionAttend);
        })
        return listAttend;
    }

    addWorkDurationPropertiy = (attendances) => {
        // count employees work duration everyday
        // and add checkOut information when employee checkout by next day.
        attendances.map((attendance, index) => {
            const checkIn = moment(attendance.checkIn, 'DD/MM/YYYY HH:mm');
            const checkOut = moment(attendance.checkOut, 'DD/MM/YYYY HH:mm');
            return this.countWorkDuration(checkIn, checkOut);
        })
        let _test = 5 as Number;
        
        return attendances;
    }

    countWorkDuration = (dateStart, dateEnd) => {
        let workDuration: Nullable<number> = null;
        let diffTime: Nullable<number> = 0;
        const checkIn = moment(dateStart);
        const checkOut = moment(dateEnd);

        if (checkIn.isBefore(checkOut)) {
            diffTime = checkOut.diff(checkIn, 'minutes');
            workDuration = diffTime;
            
        } else {
            diffTime = checkOut.add(1, "day").diff(checkIn, 'minutes');
            !diffTime && (diffTime = null)
            workDuration = diffTime;
        }
        return workDuration;
    }

    parseExcelToJson = (excelFile: Express.Multer.File) => {
        let wb = xlsx.read(excelFile?.buffer, {type: 'buffer'});
        let worksheet = wb.Sheets[wb.SheetNames[0]];
        let jsonXlsx = xlsx.utils.sheet_to_json(worksheet);
        return jsonXlsx;
    }

    removeDuplicateAttendant = (attendanced:any) => {
        let arrFilteredTimeAttends: [moment.Moment]|[] = [];
        if (attendanced.Time) {
            let arrTimeAttends = attendanced.Time.split(' ');
            let _timeAttend;
            arrTimeAttends.forEach((timeAttend, index) => {
                let timeAttendFormated = moment(timeAttend, "HH.mm");
                let tommorowTimeAttendFormated = moment(arrTimeAttends[index+1], "HH.mm");
                let diffAttend = tommorowTimeAttendFormated.diff(timeAttendFormated, "minute");
    
                if(index == 0) {_timeAttend = timeAttendFormated}
                if (diffAttend > 120 ){
                    // push array if minute gap between currentAttend and afterThisAttend
                    arrFilteredTimeAttends.push(_timeAttend.format("HH:mm") as never)
                    _timeAttend = tommorowTimeAttendFormated;
                }
                if(arrTimeAttends.length == index+1) {
                    arrFilteredTimeAttends.push(_timeAttend.format("HH:mm") as never)
                }
            })
        }
        return arrFilteredTimeAttends;
    }

    identifyCurrenDayCheckInOut = (attendanceCurrentDay: any) => {
        let listAttend = attendanceCurrentDay.listTimeAttend;
        let checkInToday = this.getCheckInToday(listAttend);
        let checkOutToday = this.getCheckOutToday(listAttend, checkInToday);
        attendanceCurrentDay.checkIn = checkInToday ? this.convertToDateTimeFormat(
            attendanceCurrentDay.Date, 
            checkInToday.hour, 
            checkInToday.minute) : null;
        attendanceCurrentDay.checkOut = checkOutToday ? this.convertToDateTimeFormat(
            attendanceCurrentDay.Date, 
            checkOutToday.hour, 
            checkOutToday.minute) : null;
        attendanceCurrentDay.checkInStatus = (checkInToday) ? "CHECK IN" : "NOT CHECK IN";
        attendanceCurrentDay.checkOutStatus = (checkOutToday) ? "CHECK OUT" : "NOT CHECK OUT";
        attendanceCurrentDay.workDuration = null;

        return attendanceCurrentDay;
    }

    convertToDateTimeFormat = (date, hour, minute) => {
        return moment(`${date} ${hour}:${minute}`, "DD/MM/YYYY HH:mm")
        .format("DD/MM/YYYY HH:mm")
    }
    convertDateStringToISO = (date, hour, minute) => {
        return moment(`${date} ${hour}:${minute}`, "DD/MM/YYYY h:m").toDate();
    }

    identifySessionINOUT = (timeAttend: string, prefAttend: string) => {
        const _time = moment(timeAttend, "HH.mm");
        const _prefAttend = moment(prefAttend, "HH:mm");
        let attendSession = {} as ISessionAttend;
        attendSession.hour = parseInt(_time.format("HH"));
        attendSession.minute = parseInt(_time.format("mm"));
        
        if (_time >= moment("05:00", "HH:mm") && _time <= moment("12:00", "HH:mm")){
            // Attend status is CHECKIN
            attendSession.sessionNumber = 1;
            attendSession.statusAttend = "CHECKIN";

        } else if (_time >= moment("14:00", "HH:mm") && _time <= moment("21:59", "HH:mm")) {
            if (_prefAttend >= moment("05:00", "HH:mm") && _prefAttend <= moment("12:00", "HH:mm")) {
                // Attend status is CHECKOUT
                attendSession.sessionNumber = 2;
                attendSession.statusAttend = "CHECKOUT";
            } else {
                // Attend status is CHECKIN
                attendSession.sessionNumber = 2;
                attendSession.statusAttend = "CHECKIN";
            }
        } else if (_time >= moment("21:00", "HH:mm") || _time <= moment("03:00", "HH:mm")) {
            // Attend status is CHECKOUT
            attendSession.sessionNumber = 3;
            attendSession.statusAttend = "CHECKOUT";
        } else {
            attendSession.sessionNumber = 99;
            attendSession.statusAttend = "ABNORMAL";
        }
        return attendSession;
    }

    

    findCheckOutYesterday = (listAttend: any) => {
        let result: ISessionAttend;
        result = _.filter(listAttend, (sessionAttend) => {
            const _sessionTime = `${sessionAttend.hour.toString()}:${sessionAttend.minute.toString()}`;
            return sessionAttend.statusAttend == "CHECKOUT" 
            && moment(_sessionTime, "HH:mm") <= moment("03:00", "HH:mm");
        })[0];

        return result;
    }

    getCheckInToday = (listAttend: any) => {
        const result = _.filter(listAttend, {statusAttend: "CHECKIN"})[0];
        return result;
    }

    getCheckOutToday = (listAttend: any, checkInSession?: ISessionAttend) => {
        let result: ISessionAttend;
        if (checkInSession) {
            // Condition when employees make checkedIn attendance
            result = _.filter(listAttend, (sessionAttend) => {
                const _sessionTime = `${sessionAttend.hour.toString()}:${sessionAttend.minute.toString()}`;
                const _checkInSessionTime = `${checkInSession.hour.toString()}:${checkInSession.minute.toString()}`;
                return sessionAttend.statusAttend == "CHECKOUT" 
                && moment(_sessionTime, "HH:mm") > moment(_checkInSessionTime, "HH:mm");
            })[0];
        } else {
            // Condition when the employees does not make a checkIn attendance,
            // Prevent if employee forget to make checkIn
            result = _.filter(listAttend, (sessionAttend) => {
                const _sessionTime = `${sessionAttend.hour.toString()}:${sessionAttend.minute.toString()}`;
                return sessionAttend.statusAttend == "CHECKOUT"
                && moment(_sessionTime, "HH:mm") > moment("12:01", "HH:mm");
            })[0];
        }
        return result;
    }

    storeToDBNew = async (attendances: any) => {
        let number = 0;

        for await (const attendance of attendances) {
            number = number + 1;
            let _attendance = this.pushToType(attendance);

            const prevDate: string = moment(attendance.Date, 'DD/MM/YYYY')
            .subtract('1', 'days')
            .format('DD/MM/YYYY');

            for await (const timeAttend of attendance.listTimeAttend){

                console.log(timeAttend)
            }

            
        }
        return number;
    }

}

export default new Controller();