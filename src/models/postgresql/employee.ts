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
        positionId: {
            type: DataTypes.NUMBER,
            field: 'position_id'
        },
        gender: {
            type: DataTypes.STRING,
            field: 'gender'
        },
        employeeStatus: {
            type: DataTypes.STRING,
            field: 'employuee_status'
        },
        hireDate: {
            type: DataTypes.DATE,
            field: 'hire_date'
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            field: 'date_of_birth'
        },
        address: {
            type: DataTypes.STRING,
            field: 'address'
        },
        contactNumber: {
            type: DataTypes.STRING,
            field: 'contact_number'
        },
        email: {
            type: DataTypes.STRING,
            field: 'email'
        },
        employeeCode: {
            type: DataTypes.STRING,
            field: 'employee_code'
        },
        description: {
            type: DataTypes.STRING,
            field: 'description'
        },
      }, {
        // Another option
      });
    
    return Employee;
}

export default Employee;