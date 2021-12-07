import {DataTypes, Sequelize, ModelCtor, Model} from 'sequelize';
import {IAttendanceMachine, IBaseAttendanceMachine} from '@src/interfaces/db/IAttendanceMachine';
import sequelize from '@src/loaders/sequelize';
import Employee from './tm_employee';

export interface AttendanceMachineInstance extends Model, IBaseAttendanceMachine {}

class AttendanceMachines extends Model<IAttendanceMachine> implements IAttendanceMachine {
  public id!: number;
  public name!: string | null;
  public officeLocation!: string | null;
  public status!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

}

AttendanceMachines.init(
  {
    id: {
      type: DataTypes.NUMBER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    officeLocation: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'office_location'
    },
    status: {
      type: DataTypes.NUMBER,
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
  },
  {
    sequelize,
    tableName: 'tm_attendance_machine'
  }
)

// const AttendanceMachine = sequelize.define<AttendanceMachineInstance>('tm_attendance_machine', {
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   officeLocation: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     field: 'office_location'
//   },
//   status: {
//     type: DataTypes.NUMBER,
//     allowNull: true,
//   },
//   createdAt: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//       field: 'created_at'
//   },
//   updatedAt: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//       field: 'updated_at'
//   },
// }, {
//   schema: 'attendance',
//   // Another option
// });
    
export default AttendanceMachines;
