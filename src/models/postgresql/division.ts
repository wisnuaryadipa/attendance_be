import {DataTypes, Sequelize} from 'sequelize';

const Division = (sequelize: Sequelize) => {
    const Division = sequelize.define('tm_division', {
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