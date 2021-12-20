import { IBasePayroll } from '@src/interfaces/db/IPayroll';
import { IAttendance, IBaseAttendance } from '@src/interfaces/db/IAttendance';
import {DataTypes, Sequelize, Model} from 'sequelize';
import { Nullable } from '@src/types/common';
import sequelize from '@src/loaders/sequelize';
import Position from './tm_position';

export interface PayrollInstance extends Model, IBasePayroll {}

const Payroll = sequelize.define<PayrollInstance>('tb_payroll', {
    employeeId: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: 'employee_id'
    },
    month: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    year: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    totalDayAttended: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'total_day_attended'
    },
    dailySalary: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'daily_salary'
    },
    totalOvertimeHour: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'total_overtime_hour'
    },
    hourlyOvertimeSalary: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'hourly_overtime_salary'
    },
    tunjangan: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'tunjangan'
    },
    fasilitasBpjs: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'fasilitas_bpjs'
    },
    incomeLainLain: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'income_lain_lain'
    },
    outcomeBpjstk: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'outcome_bpjstk'
    },
    outcomeDebt: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'outcome_debt'
    },
    outcomeLainLain: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'outcome_lain_lain'
    },
    monthlySalary: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'monthly_salary'
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
    selectedSalaryType: {
        type: DataTypes.BOOLEAN,
        field: 'is_use_flat'
    }
  }, {
    schema: 'attendance',
    // Another option
  });

  
export default Payroll;