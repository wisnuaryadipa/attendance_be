import { BaseController } from '@src/controllers/api';
import { Request, Response } from 'express';
import services from 'src/services';




class Controller extends BaseController {

    requestHandler = (req: Request, res: Response) => {


        const datePayment = req.body.datepayment;


    }

    getPaymentFromDB = (date: string) => {

        const result = services.salaryEmployee.getSalaries();

        return result

    }

}

export default new Controller();