import express, {Request, Response} from 'express';
import { BaseController } from '@src/controllers/api';
import {IOptions} from '@src/interfaces/IResponse'
import employeeServices from '@src/services/employee';

class EmployeeController extends BaseController {


    requestHandler = async (req: Request, res: Response) => {
        let option: IOptions = {};
        let employeeId = parseInt(req.params.id);
        try {

            const data = await employeeServices.getEmployeeById(employeeId);
            option.data = data;
            option.status= 500;

            
        } catch (err) {
            console.log(err);
            option.status = 500;
            option.message = "Could not upload the file";
        }

    }
}

export default new EmployeeController();