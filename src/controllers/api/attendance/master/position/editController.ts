
import Joi from 'joi';
import express, {Request, Response} from 'express';
import moment from 'moment';

import ErrorCol from '@src/errors';
import services from '@src/services';
import ApplicationError from '@src/errors/application-error';
import {BaseController} from '@src/controllers/api/baseController';

interface IReqBody {
    name: string;
    basicSalary?: number;
    wagePerHour?: number;
    overtimeWagePerHour?: number;
    defaultWorkingHour?: string;
    description?: string;
    divisionId?: number;
    positionId?: number;
}

class Position extends BaseController {

    requestValidationSchema = {
        header: Joi.object({}).required(),
        body: Joi.object({
            name: Joi.string().required(),
            basicSalary: Joi.number(),
            wagePerHour: Joi.number(),
            overtimeWagePerHour: Joi.number(),
            defaultWorkingHour: Joi.string(),
            description: Joi.string(),
            divisionId: Joi.number(),
        }).required(),
        query: Joi.object({}).required(),
        params: Joi.object({
            id: Joi.number().required(),
        }).required(),
    }

    requestHandler = async (req: Request, res: Response) => {

        try {
            const validateRequest = await this.validateRequest(req);
            const {id} = validateRequest.params;
            const _body: IReqBody = validateRequest.body;
            const _position = await services.position.getPositionById(parseInt(id));
            
            if (!_position) { 

                throw new ApplicationError({ 
                    message: ErrorCol.errMessages.FIND_NULL_ON_DB, 
                    flag: ErrorCol.errFlags.REF_NOT_FOUND 
                })

            } else {

                for (const key in _body) {
                    _body[key] && (_position[key] = _body[key])
                }
                _position.updatedAt = moment().toDate();
                const result = await _position.save();

                this.responseOption = {
                    ...this.responseOption, 
                    data:result, 
                    status: 201,
                    message: "Success!"
                }
            }


        } catch (err:any) {

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