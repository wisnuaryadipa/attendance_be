import attendanceMachineModel from '@src/models/postgresql/attendance_machine';
import divisionModel from '@src/models/postgresql/division';
import employeeModel from '@src/models/postgresql/employee';
import attendanceModel from '@src/models/postgresql/attendance';
import positionModel from '@src/models/postgresql/position';
import sequelize from '@src/loaders/sequelize'

const modelCollection = {
    tm_attendance_machine: attendanceMachineModel(sequelize),
    tm_division: divisionModel(sequelize),
    tm_employee: employeeModel(sequelize),
    tb_attendance: attendanceModel(sequelize),
    tm_position: positionModel(sequelize),
}

export default modelCollection;