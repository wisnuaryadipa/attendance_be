
import Joi from 'joi';
import express, {Request, Response} from 'express';
import moment from 'moment';

import ErrorCol from '@src/errors';
import services from '@src/services';
import ApplicationError from '@src/errors/application-error';
import {BaseController} from '@src/controllers/api/baseController';


class Employee extends BaseController {

    requestValidationSchema = {
        header: Joi.object({}).required(),
        body: Joi.object({
            name: Joi.string(),
            role: Joi.number(),
            division: Joi.number(),
            status: Joi.number(),
            machineId: Joi.number(),
        }).or('name', 'role', 'division', 'status', 'machine_id').required(),
        query: Joi.object({}).required(),
        params: Joi.object({
            id: Joi.number().required(),
        }).required(),
    }

    requestHandler = async (req: Request, res: Response) => {

        try {
            const validateRequest = await this.validateRequest(req);
            const {id} = validateRequest.params;
            const {name, role, division, status, machineId} = validateRequest.body;
            const _employee = await services.employee.getEmployeeById(parseInt(id));
            
            if (!_employee) { 

                throw new ApplicationError({ 
                    message: ErrorCol.errMessages.FIND_NULL_ON_DB, 
                    flag: ErrorCol.errFlags.REF_NOT_FOUND 
                })

            } else {

                _employee.name = (name) ? name : _employee.name;
                _employee.role = (role) ? role : _employee.role;
                _employee.division = (division) ? division : _employee.division;
                _employee.status = (status) ? status : _employee.status;
                _employee.machineId = (machineId) ? machineId : _employee.machineId;
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
    }
}

export default new Employee();