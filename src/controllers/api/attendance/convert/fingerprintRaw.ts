

import {BaseController} from "@src/controllers/api/index";
import express, {Request, Response} from "express";
import { IOptions } from "src/interfaces/IResponse";
import xlsx, { WritingOptions } from 'xlsx';
import moment from 'moment';
import { parse } from "path";
import fs from 'fs';


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
                let attendJson = this.processJson(attendanceJson);
                
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

    processJson = (parsedJson:any ) => {
        let _result = this.removeDuplicateTime(parsedJson);
        _result = this.spreadTimesToProperty(_result);

        return _result;
    }

    removeDuplicateTime = (attendanced:any) => {
        for (const key in attendanced) {
            let arrFilteredTimeAttends: [moment.Moment]|[] = [];
            if (attendanced[key].Time) {
                let arrTimeAttends = attendanced[key].Time.split(' ');
                let _timeAttend: moment.Moment;
                arrTimeAttends.forEach((timeAttend: moment.MomentInput, index: number) => {
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
            attendanced[key].Time = arrFilteredTimeAttends
        }
        
        return attendanced;
    }
    
    spreadTimesToProperty = (attendanced: any) => {
        
        for (const key1 in attendanced) {
            if (attendanced[key1].Time) {
                let arrTimeAttends = attendanced[key1].Time;
                for (const key in arrTimeAttends) {
                    attendanced[key1][`time${key}`] = arrTimeAttends[key]
                }
            }
        }
        
        return attendanced;
    }

    convertObjToExcel = async (obj: any) => {

        const attendanceWS = xlsx.utils.json_to_sheet(obj);
        var wb = xlsx.utils.book_new();

        xlsx.utils.book_append_sheet(wb, attendanceWS, 'kehadiran');

        return wb
    }


}


export default new Controller();