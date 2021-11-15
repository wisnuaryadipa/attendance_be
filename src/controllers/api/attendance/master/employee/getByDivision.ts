import express, {Request, Response} from 'express';
import { BaseController } from '@src/controllers/api';
import { IOptions } from '@src/interfaces/IResponse';
import service from '@src/services/employee';
import Joi from 'joi';

class EmployeeController extends BaseController {

    requestValidationSchema = {
        body: Joi.object({
            name: Joi.string().required(),
        }).required(),
        query: Joi.object({}).required(),
        header: Joi.object({}).required().unknown(),
        params: Joi.object({}).required()
    }

    requestHandler = async (req: Request, res: Response) => {
        const option: IOptions = {};
        const validateRequest = await this.validateRequest(req);
        const {id} = await validateRequest.body;
        try {

            const data = await service.getEmployeeByDivision(id);
            option.data = data;
            option.status= 500;

            
        } catch (err) {
            console.log(err);
            option.status = 500;
            option.message = "Could not upload the file";
        }

        this.sendResponse(req, res, option);
    }
}

export default new EmployeeController();