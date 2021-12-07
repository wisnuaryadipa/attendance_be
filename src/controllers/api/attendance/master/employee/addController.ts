import express, {Request, Response} from 'express';
import moment from 'moment';
import Joi from 'joi';
import services from '@src/services';
import { BaseController } from "@src/controllers/api";
import {IBaseEmployee} from '@src/interfaces/db/IEmployee'
import { IOptions } from '@src/interfaces/IResponse';
import ApplicationError from '@src/errors/application-error';

class Employee extends BaseController {
    requestValidationSchema = {
        body: Joi.object({
            name: Joi.string(),
            role: Joi.string(),
            division: Joi.string(),
            status: Joi.string(),
            machineId: Joi.string().required(),
            positionId: Joi.string(),
            gender:Joi.string(),
            employeeStatus:Joi.string(),
            hireDate: Joi.string(),
            dateOfBirth: Joi.string(),
            address:Joi.string(),
            contactNumber:Joi.string(),
            email:Joi.string(),
            employeeCode:Joi.string(),
            description:Joi.string(),
            flatSalary:Joi.number(),
            activeFlatSalary:Joi.boolean(),
        }).required(),
        query: Joi.object({}).required(),
        header: Joi.object({}).required().unknown(),
        params: Joi.object({}).required()
    }

    requestHandler = async (req: Request, res: Response) => {
        try { 
            const _reqValidate = await this.validateRequest(req)
            const _body = _reqValidate.body;
            const newEmployee: Partial<IBaseEmployee> = {};
            
            for (const key in _body) {
                _body[key] !== null && (newEmployee[key] = _body[key]);
            }
            newEmployee.updatedAt = moment().toDate();
            
            const result = await services.employee.addEmployee(newEmployee as IBaseEmployee)
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