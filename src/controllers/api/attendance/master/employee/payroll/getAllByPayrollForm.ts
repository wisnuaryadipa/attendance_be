import { EmployeeInstance } from '@src/models/postgresql/tm_employee';
import {BaseController} from '@src/controllers/api/baseController';
import express, {Request, Response} from 'express';
import employeeService from '@src/services/employee'
import { ParsedQs } from 'qs';
import Joi from 'joi';
import moment from 'moment';
import { PayrollInstance } from '@src/models/postgresql/tb_payroll';

interface ApiIn extends EmployeeInstance {
    lastPayroll : PayrollInstance
}

class Employee extends BaseController {

    requestValidationSchema = {
        body: Joi.object({}).required(),
        query: Joi.object({
            month: Joi.string(),
            year: Joi.string(),
            inputedPayroll: Joi.string()
        }).required(),
        header: Joi.object({}).required().unknown(true),
        params: Joi.object({}).required()
    }

    requestHandler = async (req: Request, res: Response) => {
        try {
            const validateRequest = await this.validateRequest(req);
            const {month, year, inputedPayroll} = await validateRequest.query;
            const filter = {
                month: month ? parseInt(month.toString()) : moment().format("M"),
                year: year ? parseInt(year.toString()) : moment().format("YYYY"),
                inputedPayroll: inputedPayroll ?? undefined
            }
            

            const data = await employeeService.getEmployeesPayroll({filter: filter});
            this.responseOption = {
                ...this.responseOption, 
                data:data, 
                status: 201,
                message: "Success!"
            }

            
        } catch (err: any) {
            console.log(err);
            this.responseOption = {
                ...this.responseOption, 
                message: err, 
                status: 500
            }
        }

        this.sendResponse(req, res, this.responseOption);
    }

}


export default new Employee();