import {DataTypes, Sequelize, ModelCtor, Model} from 'sequelize';
import {IAttendanceMachine} from '@src/interfaces/db/IAttendanceMachine'

export interface AttendanceMachineInstance extends Model, IAttendanceMachine {}

const AttendanceMachine = (sequelize: Sequelize) => {
    const AttendanceMachine = sequelize.define<AttendanceMachineInstance>('tm_attendance_machine', {
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
      }, {
        // Another option
      });
    
    return AttendanceMachine;
}

export default AttendanceMachine;