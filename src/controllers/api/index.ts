
import {BaseController} from '@src/controllers/api/baseController';
import importAttendanceController from '@src/controllers/api/attendance/import/attendanceController'

const ImportAttendanceController = importAttendanceController;

export {
    ImportAttendanceController,
    BaseController
};

export default {
    BaseController,
    importAttendanceController
}