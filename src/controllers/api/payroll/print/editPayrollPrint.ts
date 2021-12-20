import express, {Request, Response} from 'express';
import moment from 'moment';
import Joi from 'joi';
import services from '@src/services';
import { BaseController } from "@src/controllers/api";
import {IBasePayroll} from '@src/interfaces/db/IPayroll'
import {PayrollInstance} from '@src/models/postgresql/tb_payroll';
import { IOptions } from '@src/interfaces/IResponse';
import ApplicationError from '@src/errors/application-error';
import ErrorCol from '@src/errors';
import uniqid from 'uniqid';

interface IReqBody extends PayrollInstance {}

class Payroll extends BaseController {
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
        params: Joi.object({
            employeeId: Joi.number().required(),
            year: Joi.number().required(),
            month: Joi.number().required()
        }).required()
    }

    requestHandler = async (req: Request, res: Response) => {
        try { 
            const validateRequest = await this.validateRequest(req)
            const {employeeId, year, month} = validateRequest.params;
            const _body: IReqBody = validateRequest.body;
            const _payroll = await services.payroll.getPayrollByEmployeeIdMonthYear(
                parseInt(employeeId), 
                parseInt(year), 
                parseInt(month)
            );
            console.log(_payroll)
            if (!_payroll) { 

                throw new ApplicationError({ 
                    message: ErrorCol.errMessages.FIND_NULL_ON_DB, 
                    flag: ErrorCol.errFlags.REF_NOT_FOUND 
                })

            } else {
                
                for (const key in _body) {

                    _payroll[key] = _body[key];
                }
                _payroll.updatedAt = moment().toDate();
                const result = await _payroll.save();

                this.responseOption = {
                    ...this.responseOption, 
                    data:result, 
                    status: 201,
                    message: "Success!"
                }
            }

        } catch (err:any) {

            this.responseOption = {
                ...this.responseOption, 
                message:err, 
                status: 500
            }
        }

        this.sendResponse(req, res, this.responseOption);
    }
}

export default new Payroll();