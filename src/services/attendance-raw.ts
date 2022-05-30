
import { IEmployee } from '@src/interfaces/db/IEmployee';
import model from '@src/models/postgresql';
import {IBaseAttendanceRaw, IAttendanceRaw} from '@src/interfaces/db/IAttendanceRaw';
import Employee from '@src/models/postgresql/tm_employee';
import moment from 'moment';
import { Op } from 'sequelize';

const Sequelize = model.Sequelize;
const includeObj = [{model: Employee, as: "employee"}];
class AttendanceService {
    getAttendance = async () => {
        return await model.AttendanceRaw.findAll({include: includeObj});
    };

    getAttendanceById = async (attendanceId: number) => {
        return await model.AttendanceRaw.findOne({where: {id: attendanceId}, include: includeObj});
    }

    getAttendanceByDateEmployeeId = async (employeeId: number ,date: string) => {
        return await model.AttendanceRaw.findOne({ where: {date: date, employeeId: employeeId}, include: includeObj});
    }

    addAttendance = async (attendance: IBaseAttendanceRaw) => {
        return await model.AttendanceRaw.create(attendance);
    }

    editAttendanceById = async (attendance: IBaseAttendanceRaw, employeeId: number ,date: string) => {
        return await model.AttendanceRaw.update(attendance, { where: {date: date, employeeId: employeeId}});
    }

    editAttendanceByDateEmployeeId = async (attendance: IBaseAttendanceRaw, employeeId: number ,date: string) => {
        return await model.AttendanceRaw.update(attendance, { where: {date: date, employeeId: employeeId}});
    }

    getAttendanceFilter = async (employeeId: number, filter: any) => {
        const _where = {employeeId: employeeId} as any;
        const _arrWhere: any = [];
        if(filter){
            if(filter.month && filter.year){
                // _where[Op.and] = [sequelize.where(sequelize.fn('substring', sequelize.col("date"), 3, 5), "=", filter.month.toString() ), 
                // sequelize.where(sequelize.fn('substring', sequelize.col("date"), 6, 7), "=", filter.year )] 
                // Sequelize.where(Sequelize.fn("substr", Sequelize.col("date"), 3, 5), {[Op.eq]: "10"})
                // const dateClouse = model.Attendance.sequelize!.where(model.Attendance.sequelize.fn("SUBSTRING", model.Attendance.sequelize.col("date"), 3, 5), filter.month)
                // _arrWhere.push(dateClouse);
            }
        }
        
        _arrWhere.push(_where)
        return await model.AttendanceRaw.findAll({ 
            where:  {
                [Op.and]: [
                    Sequelize.where( Sequelize.fn("substring", Sequelize.col("date"), 7, 4), {[Op.eq]: filter.year.toString()}),
                    Sequelize.where( Sequelize.fn("substring", Sequelize.col("date"), 4, 2), {[Op.eq]: filter.month.toString()}),
                    _where
                ]
            }
            

        });
    }
}

export default new AttendanceService();