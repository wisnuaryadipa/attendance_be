import express, {Request, Response} from 'express';
import { BaseController } from '@src/controllers/api';
import { IOptions } from '@src/interfaces/IResponse';
import service from '@src/services/employee';
import model from '@src/models/postgresql/index'

class EmployeeController extends BaseController {


    requestHandler = async (req: Request, res: Response) => {
        const option: IOptions = {};
        try {

            const data = await service.getEmployees();
            option.data = data;
            option.status= 200;

            
        } catch (err) {
            console.log(err);
            option.status = 500;
            option.message = "Could not upload the file";
        }

        this.sendResponse(req, res, option);
    }
}

export default new EmployeeController();