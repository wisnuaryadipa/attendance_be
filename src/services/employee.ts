import express from 'express';
import models from '@src/models/postgresql';
import { IEmployee, IBaseEmployee } from '@src/interfaces/db/IEmployee';
import model from 'src/models/postgresql';
import { EmployeeInstance } from '@src/models/postgresql/tm_employee';
import { Includeable } from 'sequelize/types';

const includeAll = [
    {model: model.Position, as: "position", include: [{
        model: model.Division, as: "division"
    }]}
]

let includePosition : Includeable[] = [
    {model: model.Position, as: "position", include: [{
        model: model.Division, as: "division"
    }]}, 
    {model: model.Attendance, as: "attendances"}]

class EmployeeService {
    getEmployees = async () => {
        return await models.Employee.findAll({
            order:[['machine_id', 'ASC']], 
            include: includeAll
        });
    }

    getEmployeeById = async (employeeId: number) => {
        return await models.Employee.findOne({ 
            order:[['machine_id', 'ASC']], 
            where: {machine_id: employeeId}, 
            include: includePosition, 
        });
    }

    getEmployeeByDivision = async (divisionId: number) => {
        return await models.Employee.findAll({ where: {division: divisionId}});
    }

    getEmployeeByIdFilter = async (employeeId: number, filter: any) => {
        includePosition = [...includePosition, {
            model: model.Payroll,
            where: {
                month: filter.month,
                year: filter.year
            },
            required: false,
            as: 'payrolls'
        }]

        
        const whereCollection = {} as any;
        whereCollection['machine_id'] = employeeId;

        return await models.Employee.findOne({ 
            order:[['machine_id', 'ASC']], 
            where: whereCollection, 
            include: includePosition
        });
    }

    updateEmployee = async (employee: IBaseEmployee) => {
        
    }

    addEmployee = async (employee: IBaseEmployee) => {
        return await models.Employee.create(employee);
    }
    
}

export default new EmployeeService();