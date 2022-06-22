
import {BaseController, IRequestValidationSchemaJOI} from '@src/controllers/api/baseController';
import { Request, Response } from 'express';
import { IBaseAttendanceRaw } from "src/interfaces/db/IAttendanceRaw";
import {IOptions} from "@src/interfaces/IResponse"
import Joi from 'joi';
import xlsx from 'xlsx';
import moment from 'moment';
import services from "src/services";
import _ from 'lodash';
import { IBaseAttendanceRecord } from 'src/interfaces/db/IAttendanceRecord';


class ImportFile extends BaseController {

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
                data = await this.insertAttendancesToDB(data)
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

    initiateAttendJson = async (jsonAttendances: []) => {
        /*
            Desc :  This function is doing the whole process on importing file excel from finger print attendance machine
                    First process   :   Removing duplicates employee's recorded attendance (array form) on every single day
                    Second process  :   Reform jsonAttendance object from request method (all variable passed from browser)
                                        into IBaseAttendanceRecord that fit into database table.
        */
        jsonAttendances.map((attendanced: any, index) => {
            // Removeing duplicate employee's record attendance in a day
            let removedDuplicAttend = this.removeDuplicateAttendant(attendanced);
            attendanced.Time = removedDuplicAttend
            return attendanced;
        })

        let attendanceRecords = await this.splitArrTime(jsonAttendances);

        // await Promise.all(
        //     attendanceRecords.map(async (att, key) => {
        //         const _localLastTIme = _.filter(attendanceRecords, (_att) => {
        //             const isSameEmployeeId = att.machineId == _att.employeeId;
        //             const isBefore = moment(att.recordTime).isAfter(_att.recordTime)
        //             return isSameEmployeeId && isBefore;
        //         })

        //         const sortFiltered = _.orderBy(_localLastTIme, ['recordTime'], 'desc')[0]

        //         if (sortFiltered) {
        //             console.log
        //         } else {
        //             console.log('not found before')
        //         }
        //         return _
        //     })
        // )

        return attendanceRecords;
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

    findEmployeeByMachineId = async (machineId: number) => {
        return await services.employee.getEmployeeByMachineId(machineId);
    }

    identifyStatusChecking = async (timeAttend: string, prefAttend: string) => {
        /* 
            Desc : Identify status check employee attendance (CHECK IN or CHECK OUT)
            Input : 

        */

        // const _time = moment(timeAttend, "HH.mm");
        // const _prefAttend = moment(prefAttend, "HH:mm");
        // let attendSession = {} as ISessionAttend;
        // attendSession.hour = parseInt(_time.format("HH"));
        // attendSession.minute = parseInt(_time.format("mm"));
        
        // if (_time >= moment("05:00", "HH:mm") && _time <= moment("12:00", "HH:mm")){
        //     // Attend status is CHECKIN
        //     attendSession.sessionNumber = 1;
        //     attendSession.statusAttend = "CHECKIN";

        // } else if (_time >= moment("14:00", "HH:mm") && _time <= moment("21:59", "HH:mm")) {
        //     if (_prefAttend >= moment("05:00", "HH:mm") && _prefAttend <= moment("12:00", "HH:mm")) {
        //         // Attend status is CHECKOUT
        //         attendSession.sessionNumber = 2;
        //         attendSession.statusAttend = "CHECKOUT";
        //     } else {
        //         // Attend status is CHECKIN
        //         attendSession.sessionNumber = 2;
        //         attendSession.statusAttend = "CHECKIN";
        //     }
        // } else if (_time >= moment("21:00", "HH:mm") || _time <= moment("04:59", "HH:mm")) {
        //     // Attend status is CHECKOUT
        //     attendSession.sessionNumber = 3;
        //     attendSession.statusAttend = "CHECKOUT";
        // } else {
        //     attendSession.sessionNumber = 99;
        //     attendSession.statusAttend = "ABNORMAL";
        // }
        // return attendSession;
    }

    splitArrTime = async (attendance: any) => {
        /* 
            Desc : Spliting attendance object based on array of time (total emoloyee's attendances record of the day)
        */
        let _attendances: IBaseAttendanceRecord[] = [];
        const _employee = await this.findEmployeeByMachineId(attendance['AC-No'])

        if (_employee) {
            for await (const time of attendance['Time']) {
                const _attendance: IBaseAttendanceRecord = {
                    employeeId: _employee.id,
                    recordTime: moment(`${attendance['Date']} ${time}`, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm"),
                    status: "EMPTY",
                    machineId: 1,
                }
                _attendances.concat(_attendance);
            }
        }
        return _attendances;
    }
    

    insertAttendancesToDB = async (attendances: IBaseAttendanceRecord[]) => {
        /*
            Desc : Insert attendances object into Database
        */
        let _addedCount = 0;
        let _allCount = 0;
        try {

            for await (const attendance of attendances) {
                await services.attendanceRecord.add(attendance)
            }
            return `${_addedCount}/${_allCount}`;

        } catch (e) {
            return e
        }
    }
    
    insertAttendanceToDB = async (attendance: IBaseAttendanceRecord) => {
        try {
            await services.attendanceRecord.add(attendance)
        } catch (e) {
            return e
        }
    }

}

export default new ImportFile();