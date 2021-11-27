import express, {Request, Response} from 'express';
import { BaseController } from '@src/controllers/api';
import { IOptions } from '@src/interfaces/IResponse';
import service from '@src/services/employee';
import model from '@src/models/postgresql/index'

class EmployeeController extends BaseController {


    requestHandler = async (req: Request, res: Response) => {
        try {

            const data = await service.getEmployees();
            this.responseOption = {
                ...this.responseOption, 
                data:data, 
                status: 201,
                message: "Success!"
            }
            console.log(this.responseOption)

            
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

export default new EmployeeController();