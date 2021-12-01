import express from 'express';
import models from '@src/models/postgresql';
import { IEmployee, IBaseEmployee } from '@src/interfaces/db/IEmployee';


class EmployeeService {
    getEmployees = async () => {
        return await models.tm_employee.findAll({order:[['machine_id', 'ASC']]});
    }

    getEmployeeById = async (employeeId: number) => {
        return await models.tm_employee.findOne({ where: {id: employeeId}});
    }

    getEmployeeByDivision = async (divisionId: number) => {
        return await models.tm_employee.findAll({ where: {division: divisionId}});
    }

    updateEmployee = async (employee: IEmployee) => {
        
    }

    addEmployee = async (employee: IBaseEmployee) => {
        return await models.tm_employee.create(employee);
    }
    
}

export default new EmployeeService();