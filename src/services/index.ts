import divisionServices from './division';
import employeeServices from './employee';
import attendanceSerives from './attendance';
import positionServices from './position';
import payrollServices from './payroll';
import salaryEmployeeServices from './salaryEmployee';
import weeklyPaymentServices from './weeklyPayment';

export default {
    division: divisionServices,
    employee: employeeServices,
    attendance: attendanceSerives,
    position: positionServices,
    payroll: payrollServices,
    salaryEmployee: salaryEmployeeServices,
    weeklyPayment: weeklyPaymentServices
}