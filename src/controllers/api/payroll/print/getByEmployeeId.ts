import express, {Request, Response} from 'express';
import { BaseController } from '@src/controllers/api';
import { IOptions } from '@src/interfaces/IResponse';
import service from '@src/services/payroll';
import Joi from 'joi';
import moment from 'moment'

class PayrollController extends BaseController {

    requestValidationSchema = {
        body: Joi.object({
            name: Joi.string().required(),
        }).required(),
        query: Joi.object({}).required(),
        header: Joi.object({}).required().unknown(true),
        params: Joi.object({}).required()
    }

    requestHandler = async (req: Request, res: Response) => {
        const validateRequest = await this.validateRequest(req);
        const {employeeId} = await validateRequest.body;
        const {month, year} = await validateRequest.query;
        const filter = {
            month: month ? month : moment().format("M"),
            year: year ? year : moment().format("YYYY")
        }
        
        try {

            const data = await service.getPayrollByEmployeeId(employeeId, filter);
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