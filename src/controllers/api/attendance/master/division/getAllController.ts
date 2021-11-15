import express, {Request, Response} from 'express';
import moment from 'moment';
import Joi from 'joi';
import services from '@src/services';
import { BaseController } from "@src/controllers/api";
import {IBaseDivision} from '@src/interfaces/db/IDivision'
import { IOptions } from '@src/interfaces/IResponse';
import ApplicationError from '@src/errors/application-error';

class Division extends BaseController {

    requestHandler = async (req: Request, res: Response) => {
        const option: IOptions = {};
        try { 
            
            const data = await services.division.getDivisions();
            option.data = data;
            option.status = 201;
            
        } catch(err: any) {
            console.log(err);
            option.status = 500;
            option.message = err;
        }
        
        this.sendResponse(req, res, option);
    }
}

export default new Division();