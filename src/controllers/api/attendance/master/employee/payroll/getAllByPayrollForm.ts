import {BaseController} from '@src/controllers/api/baseController';
import express, {Request, Response} from 'express';
import employeeService from '@src/services/employee'
import { ParsedQs } from 'qs';

class Employee extends BaseController {

    requestHandler = async (req: Request, res: Response) => {
        try {

            const data = await employeeService.getEmployees();
            this.responseOption = {
                ...this.responseOption, 
                data:data, 
                status: 201,
                message: "Success!"
            }

            
        } catch (err: any) {
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


export default new Employee();