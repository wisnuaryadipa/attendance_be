import { IAttendance, IBaseAttendance } from '@src/interfaces/db/IAttendance';
import {DataTypes, Sequelize, Model} from 'sequelize';
import { Nullable } from '@src/types/common';
import sequelize from '@src/loaders/sequelize';
import Position from './tm_position';

interface AttendanceInstance extends Model, IBaseAttendance {}

// class Attendance extends Model<IBaseAttendance> implements IBaseAttendance {
//   public id?: number;
//   public employeeId!: string;
//   public attendanceTime?: string;
//   public visible!: number;
//   public attendanceStatus!: number;
//   public date!: string;
//   public checkIn?: Date;
//   public checkOut?: Date;
//   public readonly createdAt!: Date;
//   public updatedAt!: Date;
//   public workDuration?: Nullable<number>;
// }

// Attendance.init(
//   {
//     employeeId: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       field: 'employee_id'
//     },
//     attendanceTime: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       field: 'attendance_time'
//     },
//     visible: {
//       type: DataTypes.NUMBER,
//       allowNull: true,
//     },
//     attendanceStatus: {
//       type: DataTypes.NUMBER,
//       allowNull: true,
//       field: 'attendance_status'
//     },
//     date: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     checkIn: {
//       type: DataTypes.DATE,
//       allowNull: true,
//       field: 'check_in'
//     },
//     checkOut: {
//       type: DataTypes.DATE,
//       allowNull: true,
//       field: 'check_out'
//     },
//     createdAt: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW,
//         field: 'created_at'
//     },
//     updatedAt: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW,
//         field: 'updated_at'
//     },
//     workDuration: {
//       type: DataTypes.NUMBER,
//       allowNull: true,
//       field: 'work_duration'
//     },
//   },
//   {
//     sequelize,
//     tableName: "tb_attendance",
//     schema: 'attendance',

//   }
// )


const Attendance = sequelize.define<AttendanceInstance>('tb_attendance', {
    employeeId: {
      type: DataTypes.NUMBER,
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
    schema: 'attendance',
    // Another option
  });

export default Attendance;