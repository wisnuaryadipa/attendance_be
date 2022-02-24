
import {BaseController, IRequestValidationSchemaJOI} from '@src/controllers/api/baseController';
import { Request, Response } from 'express';
import {IOptions} from "@src/interfaces/IResponse"
import Joi from 'joi';
import xlsx from 'xlsx';
import moment from 'moment';


class ImportAttendances extends BaseController {

    constructor(){ 
        super();
        super.requestValidationSchema = {
            body: Joi.object({
                file: Joi.any().meta({swaggerType: 'file'}),
            }).required(),
            query: Joi.object({
            }).required(),
            header: Joi.object({}).required().unknown(true),
            params: Joi.object({}).required(),
        }
    }

    public index = async (req: Request, res: Response) => {
        const validRequest = await this.validateRequest(req);
        const file = req.file;

        let option: IOptions = {};
        try {
            let data: any = "";
            let jsonAttendances: any = "";

            if ( file ) {
                jsonAttendances = this.parseExcelToJson(file);
                
                data = this.initiateAttendJson(jsonAttendances)
                
            } else {
                // Check if file is empty
                this.responseOption = {
                    ...this.responseOption, 
                    data:data, 
                    status: 400,
                    message: "Please upload an excel file!"
                }
            }
            
            this.responseOption = {
                ...this.responseOption, 
                data:data, 
                status: 201,
                message: "Success!"
            }
        } catch (err: any) {
            this.responseOption = {
                ...this.responseOption, 
                message: err, 
                status: 500
            }
        }
        this.sendResponse(req, res, this.responseOption)
    }

    initiateAttendJson = (jsonAttendances: []) => {
        jsonAttendances.map((attendanced: any, index) => {
            let removedDuplicAttend = this.removeDuplicateAttendant(attendanced);
            attendanced.Time = removedDuplicAttend
            return attendanced;
        })

        return jsonAttendances;
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

}

export default new ImportAttendances();