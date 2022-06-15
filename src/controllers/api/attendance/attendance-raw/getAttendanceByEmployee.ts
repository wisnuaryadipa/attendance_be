import { BaseController } from "../../baseController";
import { Request, Response } from "express";
import Joi from 'joi';

interface IRequests {

    employeeId: string;
    limit?: number;
    dateStart: string;
    dateEnd: string;

}

class Controller extends BaseController {

    requestValidationSchema = {
        body: Joi.object({}).required(),
        query: Joi.object({
            limit: Joi.number(),
            dateStart: Joi.string(),
            dateEnd: Joi.string(),
        }).required(),
        params: Joi.object({
            employeeId: Joi.number().required()
        }).required(), 
        header: Joi.object({}).required()
    }

    requestHandler = async (req: Request, res: Response) => {

        let _reqVal = await this.validateRequest(req);
        let {params, query} = _reqVal;

        let _req: IRequests = {
            dateEnd: query.dateEnd,
            dateStart: query.dateStart,
            employeeId: params.employeeId,
            limit: (query.limit) ? parseInt(query.limit.toString()) : 10
        }

        let _result;


        return _result;
    }
}

export default new Controller();