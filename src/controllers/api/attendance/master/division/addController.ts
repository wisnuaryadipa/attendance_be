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
        try { 
            const _reqValidate = await this.validateRequest(req)
            const { name } = _reqValidate.body;
            const checkDivisionName = await services.division.getDivisionByName(name);
            if(checkDivisionName){throw {message:"Division Name Already Stored on Database !"}}

            const newDivision: IBaseDivision = {
                name: name!.toString(),
                createdAt: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
                updatedAt: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
                status: 1
            };

            const result = await services.division.addDivision(newDivision)
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
                ...err
            }
        }
        
        this.sendResponse(req, res, this.responseOption);
    }
}

export default new Division();