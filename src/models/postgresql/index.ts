import attendanceMachineModel from '@src/models/postgresql/attendance_machine';
import divisionModel from '@src/models/postgresql/division';
import employeeModel from '@src/models/postgresql/employee';
import sequelize from '@src/loaders/sequelize'

const modelCollection = {
    tm_attendance_machine: attendanceMachineModel(sequelize),
    tm_division: divisionModel(sequelize),
    tm_employee: employeeModel(sequelize)
}



export default modelCollection;