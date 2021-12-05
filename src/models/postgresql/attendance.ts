import { IAttendance } from '@src/interfaces/db/IAttendance';
import {DataTypes, Sequelize, Model} from 'sequelize';

interface AttendanceInstance extends Model, IAttendance {}

const Attendance = (sequelize: Sequelize) => {
    const Attendance = sequelize.define<AttendanceInstance>('tb_attendance', {
        employeeId: {
          type: DataTypes.STRING,
          allowNull: false,
          field: 'employee_id'
        },
        attendanceTime: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'attendance_time'
        },
        visible: {
          type: DataTypes.NUMBER,
          allowNull: true,
        },
        attendanceStatus: {
          type: DataTypes.NUMBER,
          allowNull: true,
          field: 'attendance_status'
        },
        date: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        checkIn: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'check_in'
        },
        checkOut: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'check_out'
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'updated_at'
        },
        workDuration: {
          type: DataTypes.NUMBER,
          allowNull: true,
          field: 'work_duration'
        },
      }, {
        // Another option
      });
    
    return Attendance;
}

export default Attendance;