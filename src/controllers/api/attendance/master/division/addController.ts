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
        body: Joi.object({}).required(),
        query: Joi.object({
            name: Joi.string().required(),
        }).required(),
        header: Joi.object({}).required().unknown(),
        params: Joi.object({}).required()
    }

    requestHandler = async (req: Request, res: Response) => {
        let option: IOptions = {};
        try { 
            let _reqValidate = await this.validateRequest(req)
            const { name } = _reqValidate.query;
            let newDivision: IBaseDivision = {
                name: name!.toString(),
                createdAt: moment().toDate(),
                updatedAt: moment().toDate(),
                status: 1
            };

            option.data = newDivision;
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