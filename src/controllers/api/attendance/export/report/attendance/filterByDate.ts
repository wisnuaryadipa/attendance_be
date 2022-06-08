import { IBaseAttendance } from '@src/interfaces/db/IAttendance';
import { AttendanceRecordInstance } from './../../../../../../models/postgresql/tb_attendance_record';
import services from '@src/services'
import moment from 'moment'
import { IAttendance } from 'src/interfaces/db/IAttendance';


interface IReportAttendance {
    employeeId: number,
    checkIn: Date,
    checkOut: Date,
    duration: string,
    isLate: boolean,
    isBackTooEarly: boolean,
}


class FilterByDate {

    index = () => {
        const _reportAttendances = [] as IReportAttendance[]
        const _attendances = this.getAttendanceByDate();
        
    }

    getAttendanceByDate = async () => {
        return await services.attendanceRecord.getAll();
    }

    generateReport = (attendances: AttendanceRecordInstance[]) => {
        for (const key in attendances) {
            
        }
    }

    identifyAttendance = (attendance: AttendanceRecordInstance) => {
        const _regisTime = moment(attendance.recordTime, 'YYYY/MM/DD HH:mm:ss').toDate();
        const _employeeId = attendance.employeeId;
        let _refDateTime = _regisTime;
        
        if(_regisTime.getHours() >= 0 && _regisTime.getHours() <= 3 ) {
            // Condition when tapping attendance on 00:00 until 03:00
            // Means it's pretends as check out state in next day
            _regisTime.setDate(_regisTime.getDate() - 1);
            _refDateTime = _regisTime;
        }

        const attendanceByIdByDate = services.attendance.getAttendanceByIdByDate(_employeeId, _refDateTime);

        if (!attendanceByIdByDate) {
            // Condition when attendance data these day haven't recorded on database
            const newAttendance: IBaseAttendance = {
                employeeId: _employeeId.toString(),
                visible: 1,
                attendanceStatus: 1,
                date: moment(_refDateTime).format('DD/MM/YYYY'),
                createdAt: moment().toDate(),
                updatedAt: moment().toDate(),
            }
            services.attendance.addAttendance(newAttendance)
        }

    }

}


export default new FilterByDate();