import { IFilterOption } from './../../../../interfaces/IFilterOption';
import { BaseController } from "../../baseController";
import Joi, { string } from 'joi';
import express, {Response, Request} from 'express';
import services from '@src/services';
import moment from 'moment';
import { AttendanceRecordInstance } from 'src/models/postgresql/tb_attendance_record';


interface IReqOptions {
    dateStart: string,
    dateEnd: string,
    employeeId?: string
}


class regenerateStatusAttend extends BaseController {
    
    requestValidationSchema = {
        body: Joi.object({
        }).required(),
        query: Joi.object({
            employeeId: Joi.string(),
            dateStart: Joi.string().required(),
            dateEnd: Joi.string().required()
        }).required(),
        params: Joi.object({
        }).required(), 
        header: Joi.object({}).required()
    }

    requestHandler = async( req: Request, res: Response) => {

        try {
            const _reqValidate = await this.validateRequest(req)
            let {body, params, query} = _reqValidate;
            
            let {dateStart, dateEnd, employeeId} = query;
    
            dateStart = dateStart ? dateStart.toString() : moment().startOf('days').format('DD/MM/YYYY');
            dateEnd = dateEnd ? dateEnd.toString() : moment().endOf('day').format('DD/MM/YYYY');
    
            let _attendances = await services.attendanceRecord.getAttendances({
                dateStart, dateEnd, employeeId: employeeId?.toString() 
            });
            
            await this.identifyAndEditStatusAttendances(_attendances)
    
            this.responseOption = {
                ...this.responseOption, 
                data: _attendances, 
                status: 201,
                message: "Success!"
            }

        } catch (err) {

            this.responseOption = {
                ...this.responseOption, 
                data: err, 
                status: 500,
                message: "Success!"
            }
        }

        this.sendResponse(req, res, this.responseOption)
    }
    
    
    identifyAndEditStatusAttendances = async (attendanceInstances: AttendanceRecordInstance[]) => {

        for (const attendance of attendanceInstances) {

            const prevCheck = await services.attendanceRecord.getPrevRecordByRecordTime(attendance.employeeId, attendance.recordTime);
            const currCheck = attendance.recordTime;
            attendance.status = prevCheck 
            ? this.identifyStatusChecking(currCheck, prevCheck.recordTime) 
            : this.identifyStatusChecking(currCheck);
            attendance.save();
        }

        return attendanceInstances;

    }

    identifyStatusChecking = (currCheck: string, prevCheck?: string) => {
        /* 
            Desc : Identify status check employee attendance (CHECK IN or CHECK OUT)
            Input : 

        */
            
        const _time = moment(currCheck, "HH.mm");
        let status = "";

        console.log(moment(_time).set({hour: 14, minute: 0}))
        console.log(_time)
        if (_time.isSameOrAfter(moment(_time).set({hour: 5, minute: 0})) && _time.isBefore(moment(_time).set({hour: 12, minute: 0})) ){
            // Attend status is CHECKIN
            // attendSession.sessionNumber = 1;

            
            status = "CHECKIN";

        } else if (_time.isSameOrAfter(moment(_time).set({hour: 14, minute: 0})) && _time.isSameOrBefore( moment(_time).set({hour: 21, minute: 59}))) {
            if (prevCheck) {
                console.log(prevCheck)
                const _prevCheck = moment(prevCheck, "HH:mm");
                if (_prevCheck.isSameOrAfter(moment(_time).set({hour: 5, minute: 0})) && _prevCheck.isSameOrBefore(moment(_time).set({hour: 12, minute: 0})) ) {
                    // Attend status is CHECKOUT
                    // attendSession.sessionNumber = 2;
                    status = "CHECKOUT";
                } else if (_prevCheck.isSameOrBefore(moment(_time).set({hour: 3, minute: 0})) || _prevCheck.isSameOrAfter(moment(_time).set({hour: 21, minute: 0})) ) {
                    // Attend status is CHECKIN
                    // attendSession.sessionNumber = 2;
                    status = "CHECKIN";
                } else {
                    status = "CHECKOUT";   
                }
            } else {
                status = "CHECKOUT";
            }

            
        } else if (_time.isSameOrAfter(moment(_time).set({hour: 22, minute: 0}))  || _time.isSameOrBefore( moment(_time).set({hour: 4, minute: 59}))) {
            
            status = "CHECKOUT"
        } else {
            console.log(_time)
            // attendSession.sessionNumber = 99;
            status = "ABNORMAL";
        }
        
        console.log(status)
        return status;
    }
}


export default new regenerateStatusAttend();