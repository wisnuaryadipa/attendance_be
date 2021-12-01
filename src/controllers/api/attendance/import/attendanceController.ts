import express, {Request, Response} from "express";
import {BaseController} from "@src/controllers/api/index";
import {IOptions} from "@src/interfaces/IResponse"
import xlsx from 'xlsx';
import moment from 'moment';
import { time } from "console";
import _ from "lodash";

interface ISessionAttend {
    sessionNumber: 1|2|3|99,
    hour: number,
    minute: number,
    statusAttend: "CHECKIN"|"CHECKOUT"|"ABNORMAL",
}

class Controller extends BaseController {

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
                 * Only execute when index more than 0 prevent access empty object on index before 0
                 * And did register checkout on 00:01 until 03:00
                 */
                attendancesJson[index-1]['checkOut'] = checkOutYesterday ? this.convertToDateTimeFormat(
                    attendanced.Date, 
                    checkOutYesterday.hour, 
                    checkOutYesterday.minute) : null;
                attendancesJson[index-1].checkOutStatus = (checkOutYesterday) ? "CHECK OUT" : "NOT CHECK OUT";
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
            sessionAttend = this.identifySessionINOUT(timeAttend, removedDuplicateAttendance[index-1]);
            listAttend.push(sessionAttend);
        })
        return listAttend;
    }

    addWorkDurationPropertiy = (attendancesJson) => {
        // count employees work duration everyday
        // and add checkOut information when employee checkout by next day.
        attendancesJson.map((attendanceJson, index) => {
            let diffTime = 0;
            const checkIn = moment(attendanceJson.checkIn);
            const checkOut = moment(attendanceJson.checkOut);

            if (checkIn.isBefore(checkOut)) {
                diffTime = checkOut.diff(checkIn, 'minutes');
                attendanceJson.workDuration = diffTime;
            } else {
                diffTime = checkOut.add(1, "day").diff(checkIn, 'minutes');
                attendanceJson.workDuration = diffTime;
            }
            return attendanceJson;
        })
        return attendancesJson;
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
                if(arrTimeAttends.length == index+1) {arrFilteredTimeAttends.push(_timeAttend.format("HH:mm") as never)}
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
        } else if (_time >= moment("22:00", "HH:mm") || _time <= moment("03:00", "HH:mm")) {
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

}

export default new Controller();