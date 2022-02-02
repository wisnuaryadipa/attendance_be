import { IAttendance, IBaseAttendance } from '@src/interfaces/db/IAttendance';
import {DataTypes, Sequelize, Model} from 'sequelize';
import { Nullable } from '@src/types/common';
import sequelize from '@src/loaders/sequelize';
import Position from './tm_position';

export interface SalaryEmployeeInstance extends Model, IBaseAttendance {}

const SalaryEmployee = sequelize.define<SalaryEmployeeInstance>('tb_salary_employee', {
    machineId: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: 'machine_id'
    },
    dailySalary: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'daily_salary'
    },
    holidaySalary: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'holiday_salary'
    },
    overtimeSalary: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'overtime_salary'
    },
    bankAccountId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'bank_account_id'
    },
    employeeId: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'employee_id'
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
    createdAt: true,
    updatedAt: true,
    // Another option
  });

  
export default SalaryEmployee;