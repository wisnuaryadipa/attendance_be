import Payroll from '@src/models/postgresql/tm_employee';
import model from '@src/models/postgresql';
import {IBasePayroll, IPayroll} from '@src/interfaces/db/IPayroll';
import {IBaseEmployee, IEmployee} from '@src/interfaces/db/IEmployee';
import Employee from '@src/models/postgresql/tm_employee';


const includeObj = [{model: Employee, as: "employee"}]


class PayrollService {
    getPayrolls = async () => {
        return await model.Payroll.findAll({include: includeObj});
    };

    getPayrollById = async (payrollId: number) => {
        return await model.Payroll.findOne({where: {id: payrollId}, include: includeObj});
    }

    getPayrollByEmployeeIdMonthYear = async (employeeId: number, year: number, month: number) => {
        const result = await model.Payroll.findOne({ where: {
            employeeId: employeeId,
            year: year,
            month: month
        }});
        console.log(result)
        return result
    }
    
    getPayrollByEmployeeId = async (employeeId: number, filter: any) => {
        const whereCollection = {} as any;
        whereCollection['employee_id'] = employeeId;
        filter.month && (whereCollection['month'] = filter.month);
        filter.year && (whereCollection['year'] = filter.year);
        return await model.Payroll.findOne({where: whereCollection, include: includeObj, order: [['year', 'DESC'], ['month', 'DESC'] ]})
    }

    addPayroll = async (payroll: IBasePayroll) => {
        return await model.Payroll.create(payroll);
    }

    editPayroll = async (payroll: IPayroll) => {
        return await model.Payroll.update(payroll, { where: {id: payroll.id}});
    }

    
}

export default new PayrollService();