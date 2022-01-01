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


interface IReqBody {
    name: string;
    status: number;
}
class Division extends BaseController {

    requestValidationSchema = {
        body: Joi.object({}).required(),
        query: Joi.object({}).required(),
        params: Joi.object({
            id: Joi.number().required()
        }).required(), 
        header: Joi.object({}).required()
    }

    requestHandler = async (req: Request, res: Response) => {
        try {
            const _validatedData = await this.validateRequest(req);
            const { id } = _validatedData.params;
            const _division = await services.division.getDivisionById(parseInt(id))

            if (!_division) { 

                throw new ApplicationError({ 
                    message: ErrorMessage.FIND_NULL_ON_DB, 
                    flag: errorCode.REF_NOT_FOUND 
                })

            } else {
                
                _division.visible = 0;
                _division.updatedAt = moment().toDate();
                const result = await _division.save();

                this.responseOption = {
                    ...this.responseOption, 
                    data:result, 
                    status: 201,
                    message: "Success!"
                }

            }
        } catch (err: any) {
            
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

export default new Division();