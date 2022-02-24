import masterControllers from './master'
import attendancesController from './attendance'
import importAttendancesController from './import-attendances'

export default {
    master: masterControllers,
    attendance: attendancesController,
    importAttendance: importAttendancesController
}