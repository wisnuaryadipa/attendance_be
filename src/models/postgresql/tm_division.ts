import {DataTypes, Sequelize, Model} from 'sequelize';
import {IDivision, IBaseDivision} from '@src/interfaces/db/IDivision';
import Position from './tm_position';
import sequelize from '@src/loaders/sequelize';

interface DivisionInstance extends Model, IDivision {}

// class Division extends Model<IDivision> implements IDivision {
//   id!: number;
//   name!: string;
//   status!: number;
//   public readonly createdAt!: Date;
//   public updatedAt!: Date;
// }

// Division.init(
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
//     status: {
//       type: DataTypes.NUMBER,
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
//     tableName: 'tm_division',
//     schema: 'attendance'
//   }
// )

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