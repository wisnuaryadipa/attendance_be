import masterControllers from './master'
import attendancesController from './attendance'
import importAttendancesController from './import-attendances/importFileController'
import importAttendanceRawController from './import/attendanceController'

export default {
    master: masterControllers,
    attendance: attendancesController,
    importAttendance: importAttendancesController,
    attendanceRaw: importAttendanceRawController,
}