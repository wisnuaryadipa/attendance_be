
import Joi from 'joi';
import express, {Request, Response} from 'express';
import moment from 'moment';
import {EmployeeInstance} from '@src/models/postgresql/tm_employee';
import ErrorCol from '@src/errors';
import services from '@src/services';
import ApplicationError from '@src/errors/application-error';
import {BaseController} from '@src/controllers/api/baseController';

interface IReqBody extends EmployeeInstance {}

class Employee extends BaseController {

    requestValidationSchema = {
        header: Joi.object({}).required(),
        body: Joi.object({}).required(),
        query: Joi.object({}).required(),
        params: Joi.object({
            id: Joi.number().required(),
        }).required(),
    }

    requestHandler = async (req: Request, res: Response) => {

        try {
            const validateRequest = await this.validateRequest(req);
            const {id} = validateRequest.params;
            const _employee = await services.employee.getEmployeeById(parseInt(id));
            
            if (!_employee) { 

                throw new ApplicationError({ 
                    message: ErrorCol.errMessages.FIND_NULL_ON_DB, 
                    flag: ErrorCol.errFlags.REF_NOT_FOUND 
                })

            } else {
                
                _employee.visible = 0;
                _employee.updatedAt = moment().toDate();
                const result = await _employee.save();

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

export default new Employee();