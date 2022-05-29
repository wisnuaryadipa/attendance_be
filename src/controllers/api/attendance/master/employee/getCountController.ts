import express, {Request, Response} from 'express';
import { BaseController } from '@src/controllers/api';
import {IOptions} from '@src/interfaces/IResponse'
import employeeServices from '@src/services/employee';
import Joi from 'joi';

class EmployeeController extends BaseController {

    requestValidationSchema = {
        body: Joi.object({}).required(),
        query: Joi.object({}).required(),
        header: Joi.object({}).required().unknown(),
        params: Joi.object({}).required()
    }

    requestHandler = async (req: Request, res: Response) => {
        const validateRequest = await this.validateRequest(req);
        try {

            const _data = await employeeServices.getTest(['position', 'position', 'employee.positions'])
            const data = await employeeServices.getCountEmployees();
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

export default new EmployeeController();