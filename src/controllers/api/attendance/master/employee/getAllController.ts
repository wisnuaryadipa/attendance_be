import express, {Request, Response} from 'express';
import { BaseController } from '@src/controllers/api';
import { IOptions } from '@src/interfaces/IResponse';
import service from '@src/services/employee';
import model from '@src/models/postgresql/index'

class EmployeeController extends BaseController {


    requestHandler = async (req: Request, res: Response) => {
        try {

            const data = await service.getEmployees();
            this.responseOption.data = data;
            this.responseOption.status= 200;

            
        } catch (err) {
            console.log(err);
            this.responseOption.status = 500;
            this.responseOption.message = "Could not upload the file";
        }

        this.sendResponse(req, res, this.responseOption);
    }
}

export default new EmployeeController();