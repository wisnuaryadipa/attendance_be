import express, {Request, Response} from 'express';
import { BaseController } from '@src/controllers/api';
import { IOptions } from '@src/interfaces/IResponse';

class EmployeeController extends BaseController {


    requestHandler = async (req: Request, res: Response) => {
        let option: IOptions = {};
        try {

            
            

            
        } catch (err) {
            console.log(err);
            option.status = 500;
            option.message = "Could not upload the file";
        }
            


        this.sendResponse(req, res, option);
    }
}

export default new EmployeeController();