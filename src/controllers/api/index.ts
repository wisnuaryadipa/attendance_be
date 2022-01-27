
import {BaseController} from '@src/controllers/api/baseController';
import importAttendanceController from '@src/controllers/api/attendance/import/attendanceController'
import convertFingerPrintRaw from '@src/controllers/api/attendance/convert/fingerprintRaw'
import attendanceControllers from '@src/controllers/api/attendance/'
import PayrollController from './payroll'

const ImportAttendanceController = importAttendanceController;

export {
    BaseController,
    ImportAttendanceController,
    convertFingerPrintRaw,
    attendanceControllers,
    PayrollController
};

export default {
    BaseController,
    importAttendanceController,
    convertFingerPrintRaw,
    attendanceControllers,
    PayrollController
}