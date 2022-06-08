import express, {Request, Response} from 'express';
import { BaseController } from '@src/controllers/api';
import { IOptions } from '@src/interfaces/IResponse';
import service from '@src/services/employee';
import model from '@src/models/postgresql/index';
import Joi from 'joi';

class EmployeeController extends BaseController {

    requestValidationSchema = {
        body: Joi.object({}).required(),
        query: Joi.object({
            search: Joi.string(),
        }).required(),
        header: Joi.object({}).required().unknown(true),
        params: Joi.object({}).required()
    }


    requestHandler = async (req: Request, res: Response) => {
        try {
            const validateRequest = await this.validateRequest(req);
            const {search} = await validateRequest.query;
            const filter = {
                search: search
            }
            const includes = ['position']

            const data = await service.getEmployees({filter, includes});
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