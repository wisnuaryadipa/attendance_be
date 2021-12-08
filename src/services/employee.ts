import express from 'express';
import models from '@src/models/postgresql';
import { IEmployee, IBaseEmployee } from '@src/interfaces/db/IEmployee';
import Position from 'src/models/postgresql/tm_position';
import Attendance from 'src/models/postgresql/tb_attendance';


const includePosition = [{model: Position, as: "position"}, {model: Attendance, as: "attendances"}]

class EmployeeService {
    getEmployees = async () => {
        return await models.Employee.findAll({
            order:[['machine_id', 'ASC']], 
            include: includePosition
        });
    }

    getEmployeeById = async (employeeId: number) => {
        return await models.Employee.findOne({ 
            order:[['machine_id', 'ASC']], 
            where: {id: employeeId}, 
            include: includePosition
        });
    }

    getEmployeeByDivision = async (divisionId: number) => {
        return await models.Employee.findAll({ where: {division: divisionId}});
    }

    updateEmployee = async (employee: IBaseEmployee) => {
        
    }

    addEmployee = async (employee: IBaseEmployee) => {
        return await models.Employee.create(employee);
    }
    
}

export default new EmployeeService();