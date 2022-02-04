import { IAttendance, IBaseAttendance } from '@src/interfaces/db/IAttendance';
import {DataTypes, Sequelize, Model} from 'sequelize';
import { Nullable } from '@src/types/common';
import sequelize from '@src/loaders/sequelize';
import Position from './tm_position';

export interface WeeklyPaymentInstance extends Model, IBaseAttendance {}

const WeeklyPayment = sequelize.define<WeeklyPaymentInstance>('tb_weekly_payment', {
    employeeId: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: 'employee_id'
    },
    machineId: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: 'machine_id'
    },
    totalWorkingDays: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'total_working_days'
    },
    totalWorkingHolidays: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'total_working_holidays'
    },
    totalOvertime: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'total_overtime'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'description'
    },
    status: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'status'
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
    paymentDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'paymentDate'
    },
  }, {
    schema: 'attendance',
    createdAt: true,
    updatedAt: true,
    // Another option
  });

  
export default WeeklyPayment;