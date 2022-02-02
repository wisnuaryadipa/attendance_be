import { IBaseSalaryEmployee } from './../interfaces/db/ISalaryEmployee';
import Payroll from '@src/models/postgresql/tm_employee';
import model from '@src/models/postgresql';
import {IBasePayroll, IPayroll} from '@src/interfaces/db/IPayroll';
import {IBaseEmployee, IEmployee} from '@src/interfaces/db/IEmployee';
import Employee from '@src/models/postgresql/tm_employee';
import { PayrollInstance } from '@src/models/postgresql/tb_payroll';
import {Op} from 'sequelize';


const includeObj = [{model: Employee, as: "employee"}]


class SalaryEmployeeService {
    getSalaries = async () => {
        return await model.SalaryEmployee.findAll({include: includeObj});
    };

    getSalaryById = async (salaryId: number) => {
        return await model.SalaryEmployee.findOne({where: {id: salaryId}, include: includeObj});
    }

    addSalary = async (salaryEmployee: IBaseSalaryEmployee) => {

        try {
            return await model.SalaryEmployee.create(salaryEmployee);
        } catch (e: any) {
            console.log(e)
            return e;
        }
    }
}

export default new SalaryEmployeeService();