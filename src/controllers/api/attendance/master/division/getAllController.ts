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
        try { 
            
            const data = await services.division.getDivisions();
            this.responseOption = {
                ...this.responseOption, 
                data:data, 
                status: 201,
                message: "Success!"
            }

            
        } catch(err: any) {

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