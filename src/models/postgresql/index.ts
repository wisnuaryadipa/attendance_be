import AttendanceMachine from './tm_attendance_machine';
import Division from './tm_division';
import Employee from './tm_employee';
import Attendance from './tb_attendance';
import Position from './tm_position';

const modelCollection = {
    AttendanceMachine: AttendanceMachine,
    Division : Division,
    Employee : Employee,
    Attendance : Attendance,
    Position: Position,
}

// Object.keys(modelCollection).forEach((modelName) => {
//     if (modelCollection[modelName].associate) {
//         modelCollection[modelName].associate(modelCollection)
//     }
//   })


Position.hasMany(Employee, {
    foreignKey: 'positionId',
    sourceKey: 'id',
    as: 'employees'
})

Employee.belongsTo(Position, { foreignKey: 'positionId', targetKey: 'id', as: 'position' });

Division.hasMany(Position, {
    foreignKey: 'divisionId',
    sourceKey: 'id',
    as: 'positions'
})

Position.belongsTo(Division, { foreignKey: 'divisionId', targetKey: 'id', as: 'division' });

export type MyModel = typeof modelCollection;
export default modelCollection;