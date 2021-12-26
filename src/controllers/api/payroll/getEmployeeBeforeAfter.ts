import express, {Request, Response} from 'express';
import { BaseController } from '@src/controllers/api';
import { IOptions } from '@src/interfaces/IResponse';
import servicePayroll from '@src/services/payroll';
import serviceEmployee from '@src/services/employee';
import Joi from 'joi';
import moment from 'moment'

class PayrollController extends BaseController {

    requestValidationSchema = {
        body: Joi.object({}).required(),
        query: Joi.object({}).required(),
        header: Joi.object({}).required().unknown(true),
        params: Joi.object({
            employeeId: Joi.number().required()
        }).required()
    }

    requestHandler = async (req: Request, res: Response) => {
        const validateRequest = await this.validateRequest(req);
        const {employeeId} = await validateRequest.params;
        
        try {

            const data = {
                before: await serviceEmployee.getBeforeEmployee(parseInt(employeeId)),
                after: await serviceEmployee.getAfterEmployee(parseInt(employeeId))
            }

            this.responseOption = {
                ...this.responseOption, 
                data:data, 
                status: 201,
                message: "Success!"
            }

            
        } catch (err:any) {
            console.log(err);
            this.responseOption = {
                ...this.responseOption, 
                message: err, 
                status: 500
            }
        }

        this.sendResponse(req, res, this.responseOption);
    }
}

export default new PayrollController();