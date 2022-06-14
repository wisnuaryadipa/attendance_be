import { BaseController } from "../../baseController";
import { Request, Response } from "express";

interface IRequests {

    employeeId: string;
    limit?: number;
    dateStart: string;
    dateEnd: string;

}

class Controller extends BaseController {

    requestHandler = async (req: Request, res: Response) => {



        let _result;


        return _result;
    }
}

export default new Controller();