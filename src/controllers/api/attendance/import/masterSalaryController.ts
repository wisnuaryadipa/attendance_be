import { IBaseSalaryEmployee, ISalaryEmployee } from '@src/interfaces/db/ISalaryEmployee';
import { BaseController } from '@src/controllers/api/baseController';
import {Request, Response} from 'express';
import xlsx from 'xlsx';
import { IOptions } from '@src/interfaces/IResponse';
import services from "src/services";
import moment from 'moment';
import { EmployeeInstance } from 'src/models/postgresql/tm_employee';


class Controller extends BaseController {
    requestHandler = async (req: Request, res: Response) => {

        let option: IOptions = {};
        try {
            if (req.file == undefined) {
                option.status = 400;
                option.message = "Please upload an excel file!";
                this.sendResponse(req, res, option);
            } else {
                let _fileJson = this.parseExcelToJson(req.file);
                let result = this.updateDBSalary(_fileJson);

                option.status = 200;
                option.message = "success";
                option.data = result;
                this.sendResponse(req, res, option);
            }
        }
        catch (err) {
            console.log(err);
            option.status = 500;
            option.message = "Could not upload the file";
            this.sendResponse(req, res, option);
        }
    }

    parseExcelToJson = (excelFile: any) => {
        let wb = xlsx.read(excelFile?.buffer, {type: 'buffer'});
        let worksheet = wb.Sheets[wb.SheetNames[0]];
        let jsonXlsx = xlsx.utils.sheet_to_json(worksheet) as ISalaryEmployee[];
        return jsonXlsx;
    }

    updateDBSalary = async (salariesData: ISalaryEmployee[]) => {
        const arrRes = [] as any[];
        for (const key in salariesData) {
            const _employee = await services.employee.getEmployeeByMachineId(salariesData[key].machineId);

            const salaryEmployee = {   
                employeeId: _employee?.id,
                machineId: salariesData[key].machineId,
                bankAccountId: salariesData[key].bankAccountId,
                dailySalary: salariesData[key].dailySalary,
                holidaySalary: salariesData[key].holidaySalary,
                overtimeSalary: salariesData[key].overtimeSalary,
                createdAt: moment().toDate(),
                updatedAt: moment().toDate(),

            } as IBaseSalaryEmployee
            
            (_employee) ? this.updateToMasterEmployee(_employee, salariesData[key]) : "";
            const _saveToLogSalaryEmployee = await services.salaryEmployee.addSalary(salaryEmployee)
            arrRes.push(_saveToLogSalaryEmployee)
        }
        return arrRes;
    }

    updateToMasterEmployee: (employee: EmployeeInstance, _updatedValue: ISalaryEmployee) => void = async (employee, _updatedValue) => {
        employee.rekeningNumber = _updatedValue.bankAccountId;
        employee.dailySalary = _updatedValue.dailySalary;
        employee.holidaySalary = _updatedValue.holidaySalary;
        employee.overtimeSalary = _updatedValue.overtimeSalary;

        await employee.save();
    }

}

export default new Controller(); 