import sequelize from '@src/loaders/sequelize';
import AttendanceMachine from './tm_attendance_machine';
import Division from './tm_division';
import Employee from './tm_employee';
import Attendance from './tb_attendance';
import Position from './tm_position';
import { Sequelize, ModelCtor } from 'sequelize';
import Payroll from './tb_payroll';
import { loadRealation} from './realation';


interface IModelCollection {
    [key: string]: ModelCtor<any>
}


const modelCollection = {
    AttendanceMachine: AttendanceMachine,
    Division : Division,
    Employee : Employee,
    Attendance : Attendance,
    Position: Position,
    Payroll: Payroll,
    Sequelize: sequelize.Sequelize,
    sequelize: sequelize
}

// Object.keys(modelCollection).forEach((modelName) => {
//     if (modelCollection[modelName].associate) {
//         modelCollection[modelName].associate(modelCollection)
//     }
//   })


export type MyModel = typeof modelCollection;
export type ModelCollection = typeof modelCollection;

loadRealation(modelCollection);
export default modelCollection;