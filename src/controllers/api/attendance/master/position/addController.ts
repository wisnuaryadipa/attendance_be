import express, {Request, Response} from 'express';
import moment from 'moment';
import Joi from 'joi';
import services from '@src/services';
import { BaseController } from "@src/controllers/api";
import {IBasePosition} from '@src/interfaces/db/IPosition'
import { IOptions } from '@src/interfaces/IResponse';
import ApplicationError from '@src/errors/application-error';

interface IReqBody {
    name: string;
    basicSalary?: number;
    wagePerHour?: number;
    overtimeWagePerHour?: number;
    defaultWorkingHour?: string;
    description?: string;
    divisionId?: number;
}

class Position extends BaseController {

    requestValidationSchema = {
        body: Joi.object({
            name: Joi.string().required(),
            basicSalary: Joi.number(),
            wagePerHour: Joi.number(),
            overtimeWagePerHour: Joi.number(),
            defaultWorkingHour: Joi.string().allow(""),
            description: Joi.string().allow(""),
            divisionId: Joi.number(),
        }).required(),
        query: Joi.object({}).required(),
        header: Joi.object({}).required().unknown(),
        params: Joi.object({}).required()
    }

    requestHandler = async (req: Request, res: Response) => {
        try { 
            const _reqValidate = await this.validateRequest(req)
            const _body: IReqBody = _reqValidate.body;
            const checkPositionName = await services.position.getPositionByName(_body.name);
            if(checkPositionName){throw {message:"Division Name Already Stored on Database !"}}
            
            const newPosition = { ..._body,
                createdAt: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
                updatedAt: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
                status: "1",
            } as IBasePosition;

            const result = await services.position.addPosition(newPosition)
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

export default new Position();