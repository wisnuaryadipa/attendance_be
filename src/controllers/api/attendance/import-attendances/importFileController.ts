
import {BaseController, IRequestValidationSchemaJOI} from '@src/controllers/api/baseController';
import { Request, Response } from 'express';
import { IBaseAttendanceRaw } from "src/interfaces/db/IAttendanceRaw";
import {IOptions} from "@src/interfaces/IResponse"
import Joi from 'joi';
import xlsx from 'xlsx';
import moment from 'moment';
import services from "src/services";
import _, { update } from 'lodash';
import { IBaseAttendanceRecord } from 'src/interfaces/db/IAttendanceRecord';
import { AttendanceRecordInstance } from 'src/models/postgresql/tb_attendance_record';
import { AttendanceInstance } from 'src/models/postgresql/tb_attendance';


interface IRequestAttribute {
    'AC-No': number,
    'Name': string,
    'Department': string,
    'Date': string,
    'Time': string[],
    'eDate': string,

}

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


    public requestHandler = async (req: Request, res: Response) => {
        const validRequest = await this.validateRequest(req);
        const file = req.file;

        let option: IOptions = {};
        try {
            let data: any = "";
            let jsonAttendances;

            if ( file ) {
                /*
                    Desc    : Check if file it's already selected
                    First process   : Parse excel data into json (object)
                    Second process  : Do initiate function that output IBaseAttendanceRecord
                    Third process   : Insert all data from DB
                    Fourth process  : Identify and Edit attendance status from DB
                */

                jsonAttendances = this.parseExcelToJson(file);
                data = await this.initiateAttendJson(jsonAttendances)
                const storedData = await this.insertAttendancesToDB(data)
                await this.identifyAndEditStatusAttendances(storedData)
                // modify status 
                


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
            attendanced.Time = removedDuplicAttend;
            return attendanced;
        })
        let attendanceRecords = await this.splitArrTime(jsonAttendances);

        return attendanceRecords;
    }

    identifyAndEditStatusAttendances = async (attendanceInstances: AttendanceRecordInstance[]) => {
        /*
            Desc    : Add or modify attendances status with input variable (currentTime and previousTime)

        */
        attendanceInstances.map(async (attendance) => {
            const prevCheck = await services.attendanceRecord.getPrevRecordByRecordTime(attendance.employeeId, attendance.recordTime);
            const currCheck = attendance.recordTime;
            attendance.status = prevCheck ? this.identifyStatusChecking(currCheck, prevCheck.recordTime) : "CHECKIN";
            attendance.save();
            return attendance;
        })

        return attendanceInstances;
    }

    
    parseExcelToJson = (excelFile: Express.Multer.File) => {
        let wb = xlsx.read(excelFile?.buffer, {type: 'buffer'});
        let worksheet = wb.Sheets[wb.SheetNames[0]];
        let jsonXlsx: IRequestAttribute[] = xlsx.utils.sheet_to_json(worksheet);
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



    identifyStatusChecking = (currCheck: string, prevCheck: string) => {
        /* 
            Desc : Identify status check employee attendance (CHECK IN or CHECK OUT)
            Input : 

        */
            
        const _time = moment(currCheck, "HH.mm");
        const _prevCheck = moment(prevCheck, "HH:mm");
        let status = "";
        
        if (_time.isSameOrAfter(_time.set({hour: 5, minute: 0})) && _time.isBefore(_time.set({hour: 12, minute: 0})) ){
            // Attend status is CHECKIN
            // attendSession.sessionNumber = 1;

            
            status = "CHECKIN";

        } else if (_time.isSameOrAfter(_time.set({hour: 14, minute: 0}))  && _time.isSameOrBefore( _time.set({hour: 21, minute: 59}))) {
            if (_prevCheck.isSameOrAfter(_time.set({hour: 5, minute: 0})) && _prevCheck.isSameOrBefore(_time.set({hour: 12, minute: 0})) ) {
                // Attend status is CHECKOUT
                // attendSession.sessionNumber = 2;
                status = "CHECKOUT";
            } else {
                // Attend status is CHECKIN
                // attendSession.sessionNumber = 2;
                status = "CHECKIN";
            }
        } else {
            // attendSession.sessionNumber = 99;
            status = "ABNORMAL";
        }
        return status;
    }

    splitArrTime = async (attendances: IRequestAttribute[]) => {
        /* 
            Desc : Spliting attendance object based on array of time (total emoloyee's attendances record of the day)
        */

        let _attendances: IBaseAttendanceRecord[] = [];
        for await ( const attendance of attendances) {
            
            const _employee = await this.findEmployeeByMachineId(attendance['AC-No'])

            if (_employee && attendance['Time']) {

                for (const time of attendance.Time) {
                    const _attendance: IBaseAttendanceRecord = {
                        employeeId: _employee.id,
                        recordTime: moment(`${attendance['Date']} ${time}`, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm"),
                        status: "EMPTY",
                        machineId: 1,
                    }
                    _attendances.push(_attendance);
                }
            }
        }

        return _attendances;
    }
    
    insertAttendancesToDB = async (attendances: IBaseAttendanceRecord[]) => {
        /*
            Desc : Insert attendances object into Database
        */
        let _addedCount = 0;
        const storedAttendances: AttendanceRecordInstance[] = []
        for await (const attendance of attendances) {
            const isStored = await services.attendanceRecord.getAttendanceByRecordTime(attendance.employeeId, attendance.recordTime);
            if (!isStored) {
                // Check is employee has been check attend at that time
                const storedAttendance = await services.attendanceRecord.add(attendance)
                storedAttendances.push(storedAttendance);
            }
        }
        return storedAttendances;
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