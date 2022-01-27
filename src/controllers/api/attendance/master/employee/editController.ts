
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
        body: Joi.object({
            name: Joi.string().required(),
            role: Joi.string().allow(""),
            division: Joi.string().allow(""),
            status: Joi.string().allow(""),
            machineId: Joi.string().allow("").required(),
            positionId: Joi.string().allow(""),
            gender:Joi.string().allow(""),
            employeeStatus:Joi.string().allow(""),
            hireDate: Joi.string().allow(""),
            dateOfBirth: Joi.string().allow(""),
            address:Joi.string().allow(""),
            contactNumber:Joi.string().allow(""),
            email:Joi.string().allow(""),
            employeeCode:Joi.string().allow(""),
            description:Joi.string().allow(""),
            flatSalary:Joi.number().empty("").default(null),
            activeFlatSalary:Joi.boolean(),
            rekeningNumber:Joi.string(),
        }).or('name', 'role', 'division', 'status', 'machineId').required(),
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
            const _employee = await services.employee.getEmployeeById(parseInt(id));
            
            if (!_employee) { 

                throw new ApplicationError({ 
                    message: ErrorCol.errMessages.FIND_NULL_ON_DB, 
                    flag: ErrorCol.errFlags.REF_NOT_FOUND 
                })

            } else {
                
                for (const key in _body) {

                    _employee[key] = _body[key];
                }
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