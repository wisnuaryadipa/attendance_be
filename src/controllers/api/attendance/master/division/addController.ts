import express, {Request, Response} from 'express';
import moment from 'moment';
import Joi from 'joi';
import services from '@src/services';
import { BaseController } from "@src/controllers/api";
import {IBaseDivision} from '@src/interfaces/db/IDivision'
import { IOptions } from '@src/interfaces/IResponse';
import ApplicationError from '@src/errors/application-error';

class Division extends BaseController {
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
        try { 
            const _reqValidate = await this.validateRequest(req)
            const { name } = _reqValidate.body;
            const newDivision: IBaseDivision = {
                name: name!.toString(),
                createdAt: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
                updatedAt: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
                status: 1
            };

            const result = await services.division.addDivision(newDivision)
            option.data = result;
            option.status = 201;
            
        } catch(err: any) {
            console.log(err);
            option.status = 500;
            option.message = err;
        }
        
        this.sendResponse(req, res, option);
    }
}

export default new Division();