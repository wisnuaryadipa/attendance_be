import sequelize from '@src/loaders/sequelize';
import AttendanceMachine from './tm_attendance_machine';
import Division from './tm_division';
import Employee from './tm_employee';
import Attendance from './tb_attendance';
import Position from './tm_position';
import AttendanceRecord from './tb_attendance_record';
import { Sequelize, ModelCtor } from 'sequelize';
import Payroll from './tb_payroll';
import { loadRealation} from './realation';
import SalaryEmployee from './tb_salary_employee';
import WeeklyPayment from './tb_weekly_payment';
import AttendanceRaw from './tb_attendance_raw';


interface IModelCollection {
    [key: string]: ModelCtor<any>
}


const modelCollection = {
    AttendanceMachine: AttendanceMachine,
    SalaryEmployee: SalaryEmployee,
    WeeklyPayment: WeeklyPayment,
    Division : Division,
    Employee : Employee,
    Attendance : Attendance,
    AttendanceRecord : AttendanceRecord,
    Position: Position,
    Payroll: Payroll,
    AttendanceRaw: AttendanceRaw,
    Sequelize: sequelize.Sequelize,
    sequelize: sequelize
}

export type MyModel = typeof modelCollection;
export type ModelCollection = typeof modelCollection;

loadRealation(modelCollection);
export default modelCollection;