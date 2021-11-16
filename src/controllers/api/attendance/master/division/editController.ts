import express, {Request, Response} from 'express'
import Joi from 'joi';
import {BaseController} from '@src/controllers/api/baseController';
import {IOptions} from '@src/interfaces/IResponse';
import {IBaseDivision, IDivision} from '@src/interfaces/db/IDivision';
import services from '@src/services';
import ApplicationError from '@src/errors/application-error';
import ErrorMessage from '@src/errors/error_message';
import errorCode from '@src/errors/flags';
import moment from 'moment';


class Division extends BaseController {

    requestValidationSchema = {
        body: Joi.object({
            name: Joi.string(),
            status: Joi.number()
        }).or('name','status').required(),
        query: Joi.object({}).required(),
        params: Joi.object({
            id: Joi.number().required()
        }).required(), 
        header: Joi.object({}).required()
    }

    requestHandler = async (req: Request, res: Response) => {
        const option: IOptions = {};
        try {
            const _validatedData = await this.validateRequest(req);
            const { name, status } = _validatedData.body;
            const { id } = _validatedData.params;
            const _data = await services.division.getDivisionById(parseInt(id))

            if (!_data) { 

                throw new ApplicationError({ message: ErrorMessage.FIND_NULL_ON_DB, flag: errorCode.REF_NOT_FOUND })

            } else {
                
                _data.name = name ? name : _data.name;
                _data.status = status ? status : _data.status;
                _data.updatedAt = moment().toDate();
                const result = await _data.save();
                
                option.data = result;
                option.status = 201;

            }
        } catch (err: any) {
            
            console.log(err);
            option.status = 500;
            option.message = err;

        }
        this.sendResponse(req, res, option);

    }
}

export default new Division();