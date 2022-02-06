import { BaseController } from '@src/controllers/api';
import { Request, Response } from 'express';




class Controller extends BaseController {

    requestHandler = (req: Request, res: Response) => {


        const datePayment = req.body.datepayment;


    }

    getPaymentFromDB = (date: string) => {

    }

}

export default new Controller();