import express, {Request, Response} from 'express';
import moment from 'moment';
import Joi from 'joi';
import services from '@src/services';
import { BaseController } from "@src/controllers/api";
import {IBasePayroll} from '@src/interfaces/db/IPayroll'
import { IOptions } from '@src/interfaces/IResponse';
import ApplicationError from '@src/errors/application-error';
import uniqid from 'uniqid';

class Employee extends BaseController {
    requestValidationSchema = {
        body: Joi.object({
            month: Joi.string(),
            year: Joi.string(),
            monthlySalaryFlat: Joi.string(),
            totalDayAttended: Joi.string().allow(""),
            dailySalary: Joi.string().allow(""),
            totalOvertimeHour: Joi.string().allow(""),
            hourlyOvertimeSalary: Joi.string().allow("").required(),
            tunjangan: Joi.string().allow(""),
            fasilitasBpjs:Joi.string().allow(""),
            incomeLainLain:Joi.string().allow(""),
            outcomeBpjstk: Joi.string().allow(""),
            outcomeDebt: Joi.string().allow(""),
            outcomeLainLain:Joi.string().allow(""),
            isUseMonthlySalaryFlat:Joi.string().allow(""),
        }).required(),
        query: Joi.object({}).required(),
        header: Joi.object({}).required().unknown(),
        params: Joi.object({}).required()
    }

    requestHandler = async (req: Request, res: Response) => {
        try { 
            const _reqValidate = await this.validateRequest(req)
            const _body = _reqValidate.body;
            const newPayroll: Partial<IBasePayroll> = {};
            
            for (const key in _body) {
                _body[key] !== null && (newPayroll[key] = _body[key]);
            }
            newPayroll.id = uniqid();
            newPayroll.updatedAt = moment().toDate();
            
            const result = await services.payroll.addPayroll(newPayroll as IBasePayroll)
            this.responseOption = {
                ...this.responseOption, 
                data:result, 
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

export default new Employee();