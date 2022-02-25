import divisionServices from './division';
import employeeServices from './employee';
import attendanceSerives from './attendance';
import attendanceRecordServices from './attendance-record';
import positionServices from './position';
import payrollServices from './payroll';
import salaryEmployeeServices from './salaryEmployee';
import weeklyPaymentServices from './weeklyPayment';

export default {
    division: divisionServices,
    employee: employeeServices,
    attendance: attendanceSerives,
    attendanceRecord: attendanceRecordServices,
    position: positionServices,
    payroll: payrollServices,
    salaryEmployee: salaryEmployeeServices,
    weeklyPayment: weeklyPaymentServices
}