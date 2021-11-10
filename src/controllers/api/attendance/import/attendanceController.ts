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
                attendJson = this.identifyCheckInOutToday(attendJson)
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
        
        attendancesJson.map((attendanced:any, index) => {

            let removedDuplicAttend:[] = [];
            let listAttend:ISessionAttend[] = [];
            if (attendanced.Time) {
                // check if there any attend recorded
                // then removing all duplicate attendance record
                let arrRegisAttendanced = attendanced.Time.split(' ');
                removedDuplicAttend = this.removeDuplicateAttendant(arrRegisAttendanced);
            }
            removedDuplicAttend.forEach((timeAttend, index) => {
                // create sessionAttend object from attendance record
                let sessionAttend = this.identifySession(timeAttend, removedDuplicAttend[index-1]);
                listAttend.push(sessionAttend);
            })

            attendanced.checkIn = null;
            attendanced.checkOut = null;
            attendanced.checkInStatus = null;
            attendanced.checkOutStatus = null;
            attendanced.workDuration = null;
            attendanced.listTimeAttend = listAttend;

            return attendanced;
        });

        return attendancesJson
    }
    
    identifyCheckInOutToday = (attendancesJson) => {
        attendancesJson.map((attendanced:any, index) => {
            
            let checkInToday = this.getCheckInToday(attendanced);
            let checkOutToday = this.getCheckOutToday(attendanced, attendancesJson[index+1], checkInToday);
            attendanced.checkIn = checkInToday ? moment(checkInToday.hour + ":" + checkInToday.minute, "HH:mm") : null;
            attendanced.checkOut = checkOutToday ? moment(checkOutToday.hour + ":" + checkOutToday.minute, "HH:mm") : null;
            attendanced.checkInStatus = (checkInToday) ? "CHECK IN" : "NOT CHECK IN";
            attendanced.checkOutStatus = (checkOutToday) ? "CHECK OUT" : "NOT CHECK OUT";

            return attendanced;
        })
        return attendancesJson;
    }

    addWorkDurationPropertiy = (attendancesJson) => {
        // count employees work duration everyday
        // and add checkOut information when employee checkout by next day.
        attendancesJson.map((attendanceJson, index) => {
            const checkIn = moment(attendanceJson.checkIn);
            const checkOut = moment(attendanceJson.checkOut);

            if (checkIn.isBefore(checkOut)) {
                const diffTime = checkOut.diff(checkIn, 'minutes');
                attendanceJson.workDuration = diffTime;
            } else {
                const diffTime = checkOut.add(1, "day").diff(checkIn, 'minutes');
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

    removeDuplicateAttendant = (arrTimeAttends: [string]) => {
        let arrFilteredTimeAttends: [moment.Moment]|[] = [];
        let _timeAttend;
        arrTimeAttends.forEach((timeAttend, index) => {
            let timeAttendFormated = moment(timeAttend, "HH.mm");
            let tommorowTimeAttendFormated = moment(arrTimeAttends[index+1], "HH.mm");
            let diffAttend = tommorowTimeAttendFormated.diff(timeAttendFormated, "minute");

            if(index == 0) {_timeAttend = timeAttendFormated}
            if (diffAttend > 60 ){
                // push array if minute gap between currentAttend and afterThisAttend
                arrFilteredTimeAttends.push(_timeAttend.format("HH:mm") as never)
                _timeAttend = tommorowTimeAttendFormated;
            }
            if(arrTimeAttends.length == index+1) {arrFilteredTimeAttends.push(_timeAttend.format("HH:mm") as never)}

        })
        return arrFilteredTimeAttends;
    }

    identifySession = (timeAttend: string, prefAttend: string) => {
        const _time = moment(timeAttend, "HH.mm");
        const _prefAttend = moment(prefAttend, "HH:mm");
        let attendSession = {} as ISessionAttend;
        attendSession.hour = parseInt(_time.format("HH"));
        attendSession.minute = parseInt(_time.format("mm"));
        
        if (_time >= moment("06:00", "HH:mm") && _time <= moment("12:00", "HH:mm")){
            // Attend status is CHECKIN
            attendSession.sessionNumber = 1;
            attendSession.statusAttend = "CHECKIN";

        } else if (_time >= moment("14:00", "HH:mm") && _time <= moment("21:59", "HH:mm")) {
            if (_prefAttend >= moment("06:00", "HH:mm") && _prefAttend <= moment("12:00", "HH:mm")) {
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

    getCheckInToday = (attendanceJson: any) => {
        const result = _.filter(attendanceJson.listTimeAttend, {statusAttend: "CHECKIN"})[0];
        return result;
    }

    getCheckOutToday = (attendanceJson: any, attendanceJsonNextDay: any, checkInSession?: ISessionAttend) => {
        let result: ISessionAttend;
        if (checkInSession) {
            // Condition when employees make checkedIn attendance
            result = _.filter(attendanceJson.listTimeAttend, (sessionAttend) => {
                const _sessionTime = (sessionAttend.hour).toString() + ":" + (sessionAttend.minute).toString();
                const _checkInSessionTime = (checkInSession.hour).toString() + ":" + (checkInSession.minute).toString();
                return sessionAttend.statusAttend == "CHECKOUT" 
                && moment(_sessionTime, "HH:mm") > moment(_checkInSessionTime, "HH:mm");
            })[0];

            if (!result) {
                // Condition to handle is employee checkout tomorrow 
                if (attendanceJsonNextDay) {
                    result = _.filter(attendanceJsonNextDay.listTimeAttend, (sessionAttend) => {
                        const _sessionTime = (sessionAttend.hour).toString() + ":" + (sessionAttend.minute).toString();
                        return sessionAttend.statusAttend == "CHECKOUT" 
                        && moment(_sessionTime, "HH:mm") <= moment("03:00", "HH:mm")
                        && attendanceJsonNextDay["AC-No"] == attendanceJson["AC-No"];
    
                    })[0];
                }
            }
        } else {
            // Condition when the employees does not make a checkIn attendance,
            // Prevent if employee forget to make checkIn
            result = _.filter(attendanceJson.listTimeAttend, (sessionAttend) => {
                const _sessionTime = (sessionAttend.hour).toString() + ":" + (sessionAttend.minute).toString();
                return sessionAttend.statusAttend == "CHECKOUT"
                && moment(_sessionTime, "HH:mm") > moment("12:01", "HH:mm");
            })[0];

            if (!result) {
                // Condition to handle is employee checkout tomorrow 
                if (attendanceJsonNextDay) {
                    result = _.filter(attendanceJsonNextDay.listTimeAttend, (sessionAttend) => {
                        const _sessionTime = (sessionAttend.hour).toString() + ":" + (sessionAttend.minute).toString();
                        return sessionAttend.statusAttend == "CHECKOUT" 
                        && moment(_sessionTime, "HH:mm") <= moment("03:00", "HH:mm")
                        && attendanceJsonNextDay["AC-No"] == attendanceJson["AC-No"];
    
                    })[0];
                }
            }
        }
        return result;
    }

}

export default new Controller();