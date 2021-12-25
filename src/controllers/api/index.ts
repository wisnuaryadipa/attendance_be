
import {BaseController} from '@src/controllers/api/baseController';
import importAttendanceController from '@src/controllers/api/attendance/import/attendanceController'
import attendanceControllers from '@src/controllers/api/attendance/'
import PayrollController from './payroll'

const ImportAttendanceController = importAttendanceController;

export {
    BaseController,
    ImportAttendanceController,
    attendanceControllers,
    PayrollController
};

export default {
    BaseController,
    importAttendanceController,
    attendanceControllers,
    PayrollController
}