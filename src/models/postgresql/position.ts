import {DataTypes, Sequelize, Model} from 'sequelize';
import {IEmployee} from '@src/interfaces/db/IEmployee';

interface PositionInstance extends Model, IEmployee {}

const Position = (sequelize: Sequelize) => {
    const Position = sequelize.define<PositionInstance>('tm_position', {
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
        // Another option
      });
    
    return Position;
}

export default Position;