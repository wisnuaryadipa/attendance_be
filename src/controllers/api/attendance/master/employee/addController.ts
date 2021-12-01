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
            name: Joi.string().required(),
            role: Joi.number(),
            division: Joi.number(),
            machineId: Joi.number().required(),
        }).required(),
        query: Joi.object({}).required(),
        header: Joi.object({}).required().unknown(),
        params: Joi.object({}).required()
    }

    requestHandler = async (req: Request, res: Response) => {
        try { 
            const _reqValidate = await this.validateRequest(req)
            const { name, role, division, machineId } = _reqValidate.body;
            const newEmployee: IBaseEmployee = {
                name: name,
                role: role ? role : 0,
                division: division ? division : 0,
                machineId: machineId,
                createdAt: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
                updatedAt: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
                status: 1
            };

            const result = await services.employee.addEmployee(newEmployee)
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