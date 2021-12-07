import model from '@src/models/postgresql';
import {IBaseAttendance, IAttendance} from '@src/interfaces/db/IAttendance';
import moment from 'moment';

class AttendanceService {
    getAttendance = async () => {
        return await model.Attendance.findAll();
    };

    getAttendanceById = async (attendanceId: number) => {
        return await model.Attendance.findOne({where: {id: attendanceId}});
    }

    getAttendanceByDateEmployeeId = async (employeeId: number ,date: string) => {
        return await model.Attendance.findOne({ where: {date: date, employeeId: employeeId}});
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