import positionServices from '@src/services/position';
import express, {Request, Response} from 'express';
import { BaseController } from '@src/controllers/api';
import {IOptions} from '@src/interfaces/IResponse'
import employeeServices from '@src/services/employee';
import Joi from 'joi';

class PositionController extends BaseController {

    requestValidationSchema = {
        body: Joi.object({}).required(),
        query: Joi.object({}).required(),
        header: Joi.object({}).required().unknown(),
        params: Joi.object({
            id: Joi.string().required(),
        }).required()
    }

    requestHandler = async (req: Request, res: Response) => {
        const validateRequest = await this.validateRequest(req);
        const {id} = validateRequest.params;

        try {

            const data = await positionServices.getPositionById(parseInt(id));
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

export default new PositionController();