

import {BaseController, IRequestValidationSchemaJOI} from '@src/controllers/api/baseController';
import { Request, Response } from 'express';
import {IOptions} from "@src/interfaces/IResponse"
import Joi from 'joi';
import xlsx from 'xlsx';
import moment from 'moment';
import services from "src/services";
import { IBaseAttendanceRecord } from 'src/interfaces/db/IAttendanceRecord';


class importEditEmployees extends BaseController {

    constructor(){ 
        super();
        super.requestValidationSchema = {
            body: Joi.object({
                file: Joi.any().meta({swaggerType: 'file'}),
            }).required(),
            query: Joi.object({
            }).required(),
            header: Joi.object({}).required().unknown(true),
            params: Joi.object({}).required(),
        }
    }

    public index = async (req: Request, res: Response) => {
        const validRequest = await this.validateRequest(req);
        const file = req.file;

        let option: IOptions = {};
        try {
            let data: any = "";
            let jsonEmployees: any = "";

            if ( file ) {
                jsonEmployees = this.parseExcelToJson(file);
                data = await this.editMasterEmployees(jsonEmployees);
            } else {
                // Check if file is empty
                this.responseOption = {
                    ...this.responseOption, 
                    data:data, 
                    status: 400,
                    message: "Please upload an excel file!"
                }
            }
            
            this.responseOption = {
                ...this.responseOption, 
                data:data, 
                status: 201,
                message: "Success!"
            }
        } catch (err: any) {
            this.responseOption = {
                ...this.responseOption, 
                message: err, 
                status: 500
            }
        }
        this.sendResponse(req, res, this.responseOption)
    }

    private editMasterEmployees = async (employees) => {
        for await (const employee of employees) {
            const _employee = await services.employee.getEmployeeByMachineId(employee.machine_id);
            if (_employee) {
                const gender = employee.gender == "L" ? 1 : 2;
                _employee.gender = gender;
                _employee.positionId = employee.pos;
                if (employee.hire_date) {
                    _employee.hireDate = moment.unix((employee.hire_date-25569)*86400).format('DD-MM-YYYY');
                }
                await _employee.save();
            }
        }
    }
    
    private parseExcelToJson = (excelFile: Express.Multer.File) => {
        let wb = xlsx.read(excelFile?.buffer, {type: 'buffer'});
        let worksheet = wb.Sheets[wb.SheetNames[0]];
        let jsonXlsx = xlsx.utils.sheet_to_json(worksheet);
        return jsonXlsx;
    }

}

export default new importEditEmployees();