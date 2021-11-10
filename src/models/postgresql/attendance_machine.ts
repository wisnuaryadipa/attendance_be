import {DataTypes, Sequelize} from 'sequelize';

const AttendanceMachine = (sequelize: Sequelize) => {
    const AttendanceMachine = sequelize.define('tm_attendance_machine', {
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