import { IBaseWeeklyPayment } from './../../../../interfaces/db/IWeeklyPayment';
import {Request, Response} from 'express';
import {BaseController} from '@src/controllers/api/baseController'
import { IOptions } from '@src/interfaces/IResponse';
import services from '@src/services'
import xlsx from 'xlsx';
import moment from 'moment';


class Controller extends BaseController {

    requestHandler = (req: Request, res: Response) => {
        let option: IOptions = {};
        try {

            if (req.file == undefined) {
                option.status = 400;
                option.message = "Please upload an excel file!";
                this.sendResponse(req, res, option);
            } else {
                let _fileJson = this.parseExcelToJson(req.file);
                const result = this.storeToDB(_fileJson, req.body['datePayment'])

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

    parseExcelToJson = (excelFile: Express.Multer.File) => {
        let wb = xlsx.read(excelFile?.buffer, {type: 'buffer'});
        let worksheet = wb.Sheets[wb.SheetNames[0]];
        let jsonXlsx = xlsx.utils.sheet_to_json(worksheet);
        return jsonXlsx;
    }

    storeToDB = async (employeesAttendances: any[], dateSubmit: string) => {
        const arrRes = [] as any[];
        for (const attendanceKey in employeesAttendances) {
            const _employee = await services.employee.getEmployeeByMachineId(employeesAttendances[attendanceKey].machineId);
            const lastLotNumber = await services.weeklyPayment.getLastLotNumber();
            const _weeklyPayment = {
                employeeId: _employee?.id,
                machineId: employeesAttendances[attendanceKey].machineId,
                totalOvertime: employeesAttendances[attendanceKey].total_jam_lembur,
                totalWorkingDays: employeesAttendances[attendanceKey].total_hari_kerja,
                totalWorkingHolidays: employeesAttendances[attendanceKey].total_hari_libur,
                description: employeesAttendances[attendanceKey].keterangan,
                status: 1,
                paymentDate: moment(dateSubmit).toDate(),
                lotNumber: lastLotNumber ? lastLotNumber.lotNumber + 1 : 1
            } as IBaseWeeklyPayment

            const resInputPayment = await services.weeklyPayment.addWeeklyPayment(_weeklyPayment);
            arrRes.push(resInputPayment);
        }
        return arrRes;
    }
    
}

export default new Controller();