import {DataTypes, Sequelize, Model} from 'sequelize';
import {IDivision, IBaseDivision} from '@src/interfaces/db/IDivision';
import Position from './tm_position';
import sequelize from '@src/loaders/sequelize';

interface DivisionInstance extends Model, IDivision {}

    const Division = sequelize.define<DivisionInstance>('tm_division', {
        name: {
          type: DataTypes.STRING,
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
        schema: 'attendance',
        // Another option
      });
export default Division;