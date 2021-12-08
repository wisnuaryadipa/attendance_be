import { IEmployee } from '@src/interfaces/db/IEmployee';
import model from '@src/models/postgresql';
import {IBaseAttendance, IAttendance} from '@src/interfaces/db/IAttendance';
import Employee from '@src/models/postgresql/tm_employee';
import moment from 'moment';


const includeObj = [{model: Employee, as: "employee"}]
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

    // editAttendanceByDateEmployeeId = async (date: string, employeeId: number, attendance: any) => {
    //     const convertedDate = moment(date).format('YYYY-MM-DD');
    //     return await model.tb_attendance.update(attendance, { where: {date: convertedDate, }})

    // }
}

export default new AttendanceService();