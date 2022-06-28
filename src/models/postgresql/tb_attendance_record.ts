import { IBaseAttendanceRecord, IAttendanceRecord } from './../../interfaces/db/IAttendanceRecord';
import { IAttendance, IBaseAttendance } from '@src/interfaces/db/IAttendance';
import {DataTypes, Sequelize, Model} from 'sequelize';
import { Nullable } from '@src/types/common';
import sequelize from '@src/loaders/sequelize';
import Position from './tm_position';

export interface AttendanceRecordInstance extends Model, IAttendanceRecord {}

const Attendance = sequelize.define<AttendanceRecordInstance>('tb_attendance_record', {
    employeeId: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: 'employee_id'
    },
    machineId: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'machine_id'
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recordTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'record_time',
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

  
export default Attendance;