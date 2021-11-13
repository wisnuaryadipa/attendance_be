import express, {Request, Response} from 'express';
import { BaseController } from "@src/controllers/api";
import services from '@src/services';
import {IBaseDivision} from '@src/interfaces/db/IDivision'
import moment from 'moment';
import { IOptions } from '@src/interfaces/IResponse';

class Division extends BaseController {

    requestHandler = (req: Request, res: Response) => {
        let option: IOptions = {};
        try { 
            let newDivision: IBaseDivision;
            // newDivision.name = req.query.name;
            // newDivision.status = 1;
            // newDivision.updatedAt = moment();
            // newDivision.createdAt = moment();
            
        } catch(err) {
            console.log(err);
            option.status = 500;
            option.message = "Could not upload the file";
        }
        
        this.sendResponse(req, res, option);
    }
}