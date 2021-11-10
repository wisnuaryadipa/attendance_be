import {DataTypes, Sequelize} from 'sequelize';

const Employee = (sequelize: Sequelize) => {
    const Employee = sequelize.define('tm_employee', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        role: {
          type: DataTypes.STRING,
          allowNull: false
        },
        division: {
          type: DataTypes.NUMBER,
          allowNull: false
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
    
    return Employee;
}

export default Employee;