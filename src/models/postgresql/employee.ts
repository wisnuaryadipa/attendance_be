import {DataTypes, Sequelize, Model} from 'sequelize';
import {IEmployee} from '@src/interfaces/db/IEmployee';

interface EmployeeInstance extends Model, IEmployee {}

const Employee = (sequelize: Sequelize) => {
    const Employee = sequelize.define<EmployeeInstance>('tm_employee', {
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
      }, {
        // Another option
      });
    
    return Employee;
}

export default Employee;