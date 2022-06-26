import { BaseController } from "../../baseController";
import { Request, Response } from "express";
import Joi from 'joi';
import services from "src/services";
import { FindOptions } from "sequelize";
import moment from "moment";

interface IRequests {

    limit?: number;
    dateStart: string;
    dateEnd: string;
    page: number;

}

class Controller extends BaseController {

    requestValidationSchema = {
        body: Joi.object({}).required(),
        query: Joi.object({
            limit: Joi.number(),
            dateStart: Joi.string(),
            dateEnd: Joi.string(),
            page: Joi.number(),
        }).required(),
        params: Joi.object({
            employeeId: Joi.string().required()
        }).required(), 
        header: Joi.object({}).required()
    }

    requestHandler = async (req: Request, res: Response) => {

        let _reqVal = await this.validateRequest(req);
        let {params, query, headers} = _reqVal;

        let _req: IRequests = {
            dateEnd: query.dateEnd ? query.dateEnd.toString() : moment().toString(),
            dateStart: query.dateStart ? query.dateStart!.toString() : moment().startOf("week").toString(),
            limit: (query.limit) ? parseInt(query.limit.toString()) : 10,
            page: (query.page) ? parseInt(query.page.toString()) : 1
        }

        this.filterOpt = {
            limit: _req.limit,
            offsetPage: _req.page
        }

        let _result = await services.attendanceRecord.getAllByDate(_req.dateStart, _req.dateEnd, option);

        this.responseOption = {
            ...this.responseOption, 
            data: _result, 
            status: 201,
            message: "Success!"
        }
        
        this.sendResponse(req, res, this.responseOption);
    }

}

export default new Controller();