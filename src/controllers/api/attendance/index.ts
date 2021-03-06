import masterControllers from './master'
import attendancesController from './attendance'
import importAttendanceRecordController from './attendance-raw';
import importAttendancesController from './import-attendances/importFileController'
import importAttendanceRawController from './import/attendanceRawController'

export default {
    master: masterControllers,
    attendance: attendancesController,
    importAttendance: importAttendancesController,
    attendanceRaw: importAttendanceRawController,
    attendanceRecord: importAttendanceRecordController
}