import express, {Request, Response} from 'express';
import moment from 'moment';
import Joi from 'joi';
import services from '@src/services';
import { BaseController } from "@src/controllers/api";
import {IBaseDivision} from '@src/interfaces/db/IDivision'
import { IOptions } from '@src/interfaces/IResponse';
import ApplicationError from '@src/errors/application-error';

class Attendance extends BaseController {

    requestValidationSchema = {
        body: Joi.object({
            month: Joi.number(),
            year: Joi.number()
        }).required(),
        query: Joi.object({}).required(),
        params: Joi.object({
            employeeId: Joi.number().required()
        }).required(), 
        header: Joi.object({}).required()
    }

    requestHandler = async (req: Request, res: Response) => { 
        try { 
            
            const _reqValidate = await this.validateRequest(req)
            let {body, params} = _reqValidate;
           console.log(body)
            const filter = {
                month: body.month,
                year: body.year
            }
            
            const data = await services.attendance.getAttendanceFilter(parseInt(params.employeeId), filter);
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

export default new Attendance();