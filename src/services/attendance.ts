
import { IEmployee } from '@src/interfaces/db/IEmployee';
import model from '@src/models/postgresql';
import {IBaseAttendance, IAttendance} from '@src/interfaces/db/IAttendance';
import Employee from '@src/models/postgresql/tm_employee';
import moment from 'moment';
import { Op } from 'sequelize';

const Sequelize = model.Sequelize;
const includeObj = [{model: Employee, as: "employee"}];
class AttendanceService {
    getAttendance = async () => {
        return await model.Attendance.findAll({include: includeObj});
    };

    getAttendanceById = async (attendanceId: number) => {
        return await model.Attendance.findOne({where: {id: attendanceId}, include: includeObj});
    }

    getAttendanceByDateEmployeeId = async (employeeId: number ,date: string) => {
        return await model.Attendance.findOne({ where: {date: date, employeeId: employeeId}, include: includeObj});
    }

    addAttendance = async (attendance: IBaseAttendance) => {
        return await model.Attendance.create(attendance);
    }

    editAttendanceById = async (attendance: IBaseAttendance, employeeId: number ,date: string) => {
        return await model.Attendance.update(attendance, { where: {date: date, employeeId: employeeId}});
    }

    editAttendanceByDateEmployeeId = async (attendance: IBaseAttendance, employeeId: number ,date: string) => {
        return await model.Attendance.update(attendance, { where: {date: date, employeeId: employeeId}});
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
        return await model.Attendance.findAll({ 
            where:  {
                [Op.and]: [
                    Sequelize.where( Sequelize.fn("substring", Sequelize.col("date"), 4, 2), {[Op.eq]: filter.month.toString()}),
                    _where
                ]
            }
            

        });
    }

    // editAttendanceByDateEmployeeId = async (date: string, employeeId: number, attendance: any) => {
    //     const convertedDate = moment(date).format('YYYY-MM-DD');
    //     return await model.tb_attendance.update(attendance, { where: {date: convertedDate, }})

    // }
}

export default new AttendanceService();