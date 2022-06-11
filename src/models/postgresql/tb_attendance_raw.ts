import { IAttendanceRaw, IBaseAttendanceRaw } from '@src/interfaces/db/IAttendanceRaw';
import {DataTypes, Sequelize, Model} from 'sequelize';
import { Nullable } from '@src/types/common';
import sequelize from '@src/loaders/sequelize';
import Position from './tm_position';

export interface AttendanceRawInstance extends Model, IBaseAttendanceRaw {}

const AttendanceRaw = sequelize.define<AttendanceRawInstance>('tb_attendance_raw', {
    employeeId: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: 'employee_id'
    },
    attendanceTime: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'time'
    },
    visible: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    attendanceStatus: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'attend_status'
    },
    date: {
      type: DataTypes.STRING,
      allowNull: true,
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
  }, {
    schema: 'attendance',
    // Another option
  });

  
export default AttendanceRaw;