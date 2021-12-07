import { IEmployee } from './../../interfaces/db/IEmployee';
import { DataTypes, Sequelize, Model, HasManyGetAssociationsMixin, Association, HasManyAddAssociationMixin, HasManyHasAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, ModelCtor } from 'sequelize';
import {IPosition, IBasePosition} from '@src/interfaces/db/IPosition';
import sequelize from '@src/loaders/sequelize';
import {Optional} from 'sequelize';
import Attendance from './tb_attendance';
import Employee from './tm_employee';


interface PositionInstance extends Model, IPosition { }
interface PositionCreationAttributes extends Optional<PositionInstance, 'id'> { }
// class Position extends Model {
//   public id!: number;
//   public name!: string;
//   public basicSalary?: string;
//   public wagePerhour?: number;
//   public overtimeWagePerHour?: number;
//   public defaultWorkingHour?: number;
//   public description?: number;
//   public divisionId?: number;
//   public status!: string;
  
//   public readonly createdAt!: Date;
//   public updatedAt!: Date;
//   public readonly employees?: Employee[];

//   public getEmployees!: HasManyGetAssociationsMixin<Employee>; // Note the null assertions!
//   public addEmployee!: HasManyAddAssociationMixin<Employee, number>;
//   public hasEmployee!: HasManyHasAssociationMixin<Employee, number>;
//   public countEmployees!: HasManyCountAssociationsMixin;
//   public createEmployees!: HasManyCreateAssociationMixin<Employee>;
//   public static associations: {
//     employees: Association<Position, Employee>;
//   };
  
//   // public static associate({ tm_employee }) {
//   //   // define association here
//   //   this.hasMany(tm_employee, {
//   //     foreignKey: 'position_id',
//   //     sourceKey: 'id',
//   //     as: 'employees'
//   //     //as: 'personalDetails',
//   //   })
//   // }
  
//   // toJSON() {
//   //   return { ...this.get(), id: undefined }
//   // }
// }

// Position.init(
//   {
//     id: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       primaryKey: true
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     basicSalary: {
//       type: DataTypes.NUMBER,
//       allowNull: true,
//       field: 'basic_salary'
//     },
//     wagePerHour: {
//       type: DataTypes.NUMBER,
//       allowNull: true,
//       field: 'wage_per_hour'
//     },
//     overtimeWagePerHour: {
//       type: DataTypes.NUMBER,
//       allowNull: true,
//       field: 'overtime_wage_per_hour'
//     },
//     defaultWorkingHour: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       field: 'default_working_hour'
//     },
//     description: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     divisionId: {
//       type: DataTypes.NUMBER,
//       allowNull: true,
//       field: 'division_id'
//     },
//     status: {
//       type: DataTypes.STRING,
//       allowNull: true,
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
//   },
//   {
//     sequelize,
//     tableName: 'tm_position',
//     schema: 'attendance',
//   }
// )

const Position = sequelize.define<PositionCreationAttributes>('tm_position', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  basicSalary: {
    type: DataTypes.NUMBER,
    allowNull: true,
    field: 'basic_salary'
  },
  wagePerHour: {
    type: DataTypes.NUMBER,
    allowNull: true,
    field: 'wage_per_hour'
  },
  overtimeWagePerHour: {
    type: DataTypes.NUMBER,
    allowNull: true,
    field: 'overtime_wage_per_hour'
  },
  defaultWorkingHour: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'default_working_hour'
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  divisionId: {
    type: DataTypes.NUMBER,
    allowNull: true,
    field: 'division_id'
  },
  status: {
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

export default Position;