import { addZero } from '@src/helper/AddZero';
import express, {Request, Response} from 'express';
import moment from 'moment';
import Joi from 'joi';
import services from '@src/services';
import { BaseController } from "@src/controllers/api";
import {IBaseDivision} from '@src/interfaces/db/IDivision'
import { IOptions } from '@src/interfaces/IResponse';
import ApplicationError from '@src/errors/application-error';
import { AttendanceInstance } from '@src/models/postgresql/tb_attendance';
import { AttendanceRecordInstance } from 'src/models/postgresql/tb_attendance_record';

interface IFilter {
    startDate: Date,
    endDate: Date
}

class GetEmployeeById extends BaseController {



    requestValidationSchema = {
        body: Joi.object({
        }).required(),
        query: Joi.object({
            startDate: Joi.string(),
            endDate: Joi.string()
        }).required(),
        params: Joi.object({
            employeeId: Joi.number().required()
        }).required(), 
        header: Joi.object({}).required()
    }
    
    requestHandler = async (req: Request, res: Response) => { 
        
        try { 
            let data: AttendanceRecordInstance[] = [];
            const _reqValidate = await this.validateRequest(req)
            let {body, params, query} = _reqValidate;
            
            const _employeeId = params.employeeId;
            let {startDate, endDate} = query;

            startDate = startDate ? startDate.toString() : moment().startOf('days').format('DD/MM/YYYY');
            endDate = endDate ? endDate.toString() : moment().endOf('day').format('DD/MM/YYYY');
            
            data = await services.attendanceRecord.getAllByEmployee(_employeeId, startDate, endDate);


            
            this.responseOption = {
                ...this.responseOption, 
                data:data, 
                status: 201,
                message: "Success!"
            }

            
        } catch(err: any) {

            console.log(err);
            this.responseOption = {
                ...this.responseOption, 
                message:err,
                status: 500
            }

        }
        
        this.sendResponse(req, res, this.responseOption);
    }


}

export default new GetEmployeeById();