import express from 'express';
import models from '@src/models/postgresql';
import { IEmployee } from '@src/interfaces/db/IEmployee';


class EmployeeService {
    getEmployees = async () => {
        return await models.tm_employee.findAll();
    }

    getEmployeeById = async (employeeId: number) => {
        return await models.tm_employee.findOne({ where: {id: employeeId}});
    }

    getEmployeeByDivision = async (divisionId: number) => {
        return await models.tm_employee.findAll({ where: {division: divisionId}});
    }

    updateEmployee = async (employee: IEmployee) => {
        
    }
    
}

export default new EmployeeService();