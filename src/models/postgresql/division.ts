import {DataTypes, Sequelize, Model} from 'sequelize';
import {IDivision} from '@src/interfaces/db/IDivision';

interface DivisionInstance extends Model, IDivision {}

const Division = (sequelize: Sequelize) => {
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
        // Another option
      });
    
    return Division;
}

export default Division;