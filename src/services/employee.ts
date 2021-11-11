import express from 'express';
import models from '@src/models/postgresql';


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

    updateEmployee = async (employeeId: number) => {
        
    }
    
}

export default new EmployeeService();