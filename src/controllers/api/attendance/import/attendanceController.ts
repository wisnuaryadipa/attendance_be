import express, {Request, Response} from "express";
import {BaseController} from "@src/controllers/api/index";
import {IOptions} from "@src/interfaces/IResponse"
import xlsx from 'xlsx';
import moment from 'moment';
import { time } from "console";

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

                attendanceJson.map((attendanced:any, index) => {
                    let removedDuplicAttend:string|[] = "";
                    if (attendanced.Time) {
                        let arrRegisAttendanced = attendanced.Time.split(' ');
                        removedDuplicAttend = this.removeDuplicateAttendant(arrRegisAttendanced);
                    }
                    attendanced.checkIn = "";
                    attendanced.checkOut = "";
                    attendanced.workDuration = removedDuplicAttend;

                    return attendanced;
                })


                option.status = 200;
                option.message = "success";
                option.data = attendanceJson;
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

    removeDuplicateAttendant = (arrTimeAttends: [string]) => {
        let arrFilteredTimeAttends: [moment.Moment]|[] = [];
        let _timeAttend;
        arrTimeAttends.forEach((timeAttend, index) => {
            let timeAttendFormated = moment(timeAttend, "HH.mm");
            let tommorowTimeAttendFormated = moment(arrTimeAttends[index+1], "HH.mm");
            let diffAttend = tommorowTimeAttendFormated.diff(timeAttendFormated, "minute");

            if(index == 0) {_timeAttend = timeAttendFormated}
            if (diffAttend > 60 ){
                arrFilteredTimeAttends.push(_timeAttend.format("HH:mm") as never)
                _timeAttend = tommorowTimeAttendFormated;
            }
            if(arrTimeAttends.length == index+1) {arrFilteredTimeAttends.push(_timeAttend.format("HH:mm") as never)}

        })
        return arrFilteredTimeAttends;
    }


}

export default new Controller();