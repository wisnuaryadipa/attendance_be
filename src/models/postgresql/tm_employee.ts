import {DataTypes, Sequelize, Model, HasOneGetAssociationMixin, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin} from 'sequelize';
import {IEmployee, IBaseEmployee} from '@src/interfaces/db/IEmployee';
import sequelize from '@src/loaders/sequelize';
import { extend } from 'joi';
import Position from './tm_position';
import { MyModel } from '.';

export interface EmployeeInstance extends Model, IBaseEmployee {}

// class Employee extends Model{
//   public id!: number;
//   public name!: string;
//   public role!: string;
//   public division?: number;
//   public status!: number;
//   public machineId?: number;
//   public positionId?: number;
//   public gender?:string;
//   public employeeStatus?:string;
//   public hireDate?: Date;
//   public dateOfBirth?: Date;
//   public address?:string;
//   public contactNumber?:string;
//   public email?:string;
//   public employeeCode?:string;
//   public description?:string;

//   public readonly createdAt!: Date;
//   public updatedAt!: Date;

//   public tm_position?: Position;
//   public position?: Position;

  
//   public getPositions!: HasManyGetAssociationsMixin<Position>; // Note the null assertions!
//   public addPosition!: HasManyAddAssociationMixin<Position, number>;
//   public hasPosition!: HasManyHasAssociationMixin<Position, number>;
//   public countPositions!: HasManyCountAssociationsMixin;
//   public createPositions!: HasManyCreateAssociationMixin<Position>;

//   // public static associate({ tm_position }) {
    
//   //   console.log(tm_position)
//   //   this.belongsTo(tm_position, {
//   //     foreignKey: 'position_id'
//   //   })
//   // // }
//   // toJSON() {
//   //   return { ...this.get(), id: undefined, positionId: undefined }
//   // }

// }

// Employee.init(
//   {
//     id: {
//       type: DataTypes.NUMBER,
//       allowNull: false,
//       primaryKey: true
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     role: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     division: {
//       type: DataTypes.NUMBER,
//       allowNull: false
//     },
//     status: {
//       type: DataTypes.NUMBER,
//       allowNull: true,
//     },
//     machineId: {
//       type: DataTypes.NUMBER,
//       allowNull: true,
//       field: 'machine_id'
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
//     positionId: {
//         type: DataTypes.NUMBER,
//         field: 'position_id'
//     },
//     gender: {
//         type: DataTypes.STRING,
//         field: 'gender'
//     },
//     employeeStatus: {
//         type: DataTypes.STRING,
//         field: 'employuee_status'
//     },
//     hireDate: {
//         type: DataTypes.DATE,
//         field: 'hire_date'
//     },
//     dateOfBirth: {
//         type: DataTypes.DATE,
//         field: 'date_of_birth'
//     },
//     address: {
//         type: DataTypes.STRING,
//         field: 'address'
//     },
//     contactNumber: {
//         type: DataTypes.STRING,
//         field: 'contact_number'
//     },
//     email: {
//         type: DataTypes.STRING,
//         field: 'email'
//     },
//     employeeCode: {
//         type: DataTypes.STRING,
//         field: 'employee_code'
//     },
//     description: {
//         type: DataTypes.STRING,
//         field: 'description'
//     },
//   },
//   {
//     sequelize,
//     tableName: 'tm_employee',
//     schema: 'attendance'
//   }
// )

// Employee.hasMany(Position, {
//   sourceKey: 'id',
//   foreignKey: 'positionId',
//   as: 'employees'
// })
// Employee.belongsTo(Position, {
//   as: 'Position',
//   foreignKey: 'positionId',
//   targetKey: 'id'
// });

const Employee = sequelize.define<EmployeeInstance>('tm_employee', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true
    },
    division: {
      type: DataTypes.NUMBER,
      allowNull: true
    },
    status: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    machineId: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'machine_id'
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
    positionId: {
        type: DataTypes.NUMBER,
        field: 'position_id'
    },
    gender: {
        type: DataTypes.STRING,
        field: 'gender'
    },
    employeeStatus: {
        type: DataTypes.STRING,
        field: 'employee_status'
    },
    hireDate: {
        type: DataTypes.STRING,
        field: 'hire_date'
    },
    dateOfBirth: {
        type: DataTypes.STRING,
        field: 'date_of_birth'
    },
    address: {
        type: DataTypes.STRING,
        field: 'address'
    },
    contactNumber: {
        type: DataTypes.STRING,
        field: 'contact_number'
    },
    email: {
        type: DataTypes.STRING,
        field: 'email'
    },
    employeeCode: {
        type: DataTypes.STRING,
        field: 'employee_code'
    },
    description: {
        type: DataTypes.STRING,
        field: 'description'
    },
    flatSalary: {
        type: DataTypes.NUMBER,
        field: 'flat_salary'
    },
    activeFlatSalary: {
        type: DataTypes.BOOLEAN,
        field: 'active_flat_salary'
    },
    rekeningNumber: {
        type: DataTypes.STRING,
        field: 'rekening_number'
    }
  }, {
    schema: 'attendance',
    // Another option
  });


export default Employee;