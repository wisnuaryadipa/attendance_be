import masterControllers from './master'
import attendancesController from './attendance'
import importAttendancesController from './import-attendances/importFileController'
import importAttendanceRawController from './import/attemdamceRawController'

export default {
    master: masterControllers,
    attendance: attendancesController,
    importAttendance: importAttendancesController,
    attendanceRaw: importAttendanceRawController,
}