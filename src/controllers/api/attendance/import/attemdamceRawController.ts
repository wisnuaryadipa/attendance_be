import { BaseController } from "../../baseController";
import express, {Request, Response} from "express";
import moment from 'moment';
import { IBaseAttendanceRaw } from "src/interfaces/db/IAttendanceRaw";
import { IOptions } from "src/interfaces/IResponse";
import xlsx from 'xlsx';
import { x } from "joi";



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
        let option: IOptions = {};
        try {
            if (req.file == undefined) {
                option.status = 400;
                option.message = "Please upload an excel file!";
                this.sendResponse(req, res, option);
            } else {
                let attendanceJson = this.parseExcelToJson(req.file);
                let attendJson = this.initiateAttendJson(attendanceJson);
                // attendJson = this.addWorkDurationPropertiy(attendJson);
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

    parseExcelToJson = (excelFile: Express.Multer.File) => {
        let wb = xlsx.read(excelFile?.buffer, {type: 'buffer'});
        let worksheet = wb.Sheets[wb.SheetNames[0]];
        let jsonXlsx = xlsx.utils.sheet_to_json(worksheet);
        return jsonXlsx;
    }
    
    initiateAttendJson = (attendancesJson) => {
        /**
         * This function is initiate process. All process that run on this function will explain below
         * 1st Process : Remove object if there is no attendance record in a day AND Remove duplicate registered attendance time.
         * 2nd Process : After there are no duplicate registered time, 
         *               in this 2nd process will identify which one is CheckIn or CheckOut every each day
         * 3rd Process : Find if there is checkOut that identified on 00:00 until 03:00 then place it on day -1
         * 
         */

        attendancesJson = attendancesJson.filter( x => {
            /**
             * Desc = Removing all object that doesn't have value in 'Time' property. 
             */
            let isTimeAvailable: Boolean = x.Time ? true : false;
            return isTimeAvailable;
        })

        attendancesJson.map((attendanced:any, index) => {
            let removedDuplicAttend:[] = [];
            removedDuplicAttend = this.removeDuplicateAttendant(attendanced);

            return removedDuplicAttend;
        });

        return attendancesJson;
    }

    removeEmptyAttendant = (attendances: any) => {

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

    storeToDBNew = async (attendances: any) => {
        let number = 0;

        for await (const attendance of attendances) {
            number = number + 1;
            let _attendance = this.pushToType(attendance);

            const prevDate: string = moment(attendance.Date, 'DD/MM/YYYY')
            .subtract('1', 'days')
            .format('DD/MM/YYYY');

            console.log(_attendance)
            // for await (const timeAttend of attendance.listTimeAttend){

            //     // console.log(timeAttend)
            // }

            
        }
        return number;
    }


}

export default new Controller();