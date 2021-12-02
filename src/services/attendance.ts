import model from '@src/models/postgresql';
import {IBaseAttendance, IAttendance} from '@src/interfaces/db/IAttendance';
import moment from 'moment';

class AttendanceService {
    getAttendance = async () => {
        return await model.tb_attendance.findAll();
    };

    getAttendanceById = async (attendanceId: number) => {
        return await model.tb_attendance.findOne({where: {id: attendanceId}});
    }

    getAttendanceByDateEmployeeId = async (employeeId: number ,date: string) => {
        return await model.tb_attendance.findOne({ where: {date: date, employeeId: employeeId}});
    }

    addAttendance = async (attendance: IBaseAttendance) => {
        return await model.tb_attendance.create(attendance);
    }

    editAttendance = async (attendance: IAttendance) => {
        return await model.tb_attendance.update(attendance, { where: {id: attendance.id}});
    }

    // editAttendanceByDateEmployeeId = async (date: string, employeeId: number, attendance: any) => {
    //     const convertedDate = moment(date).format('YYYY-MM-DD');
    //     return await model.tb_attendance.update(attendance, { where: {date: convertedDate, }})

    // }
}

export default new AttendanceService();