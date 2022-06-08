import {ModelCollection} from './index'
import model from './index'

export const loadRealation = (modelColl: ModelCollection) => {
    
    modelColl.Position.hasMany( modelColl.Employee, {
        foreignKey: 'positionId',
        sourceKey: 'id',
        as: 'employees'
    })

    modelColl.Employee.belongsTo( modelColl.Position, { 
        foreignKey: 'positionId',
        targetKey: 'id',
        as: 'position'
    });

    modelColl.Division.hasMany( modelColl.Position, {
        foreignKey: 'divisionId',
        sourceKey: 'id',
        as: 'positions'
    })

    modelColl.Position.belongsTo( modelColl.Division, { 
        foreignKey: 'divisionId', 
        targetKey: 'id', 
        as: 'division' 
    });

    modelColl.Employee.hasMany( modelColl.Attendance, {
        foreignKey: 'employeeId',
        sourceKey: 'machineId',
        as: 'attendances'
    })

    modelColl.Attendance.belongsTo( modelColl.Employee, { 
        foreignKey: 'employeeId', targetKey: 'machineId', as: 'employee' 
    });

    modelColl.Employee.hasMany( modelColl.Payroll, { 
        foreignKey: 'employeeId', 
        sourceKey: 'machineId', 
        as: 'payrolls' 
    });

    modelColl.Payroll.belongsTo( modelColl.Employee, { 
        foreignKey: 'employeeId', targetKey: 'machineId', as: 'employee' 
    });

    modelColl.SalaryEmployee.belongsTo( modelColl.Employee, {
        foreignKey: 'employeeId', targetKey: 'id', as: 'employee'
    });

    modelColl.Employee.hasMany(modelColl.SalaryEmployee, {
        foreignKey: 'employeeId', sourceKey: 'id', as: 'salaries'
    });
    
    modelColl.Employee.hasMany(modelColl.WeeklyPayment, {
        foreignKey: 'employeeId', sourceKey: 'id', as: 'weeklyPayments'
    });

    modelColl.WeeklyPayment.belongsTo( modelColl.Employee, {
        foreignKey: 'employeeId', targetKey: 'id', as: 'employee'
    });
}

export const IncludeList = (model: ModelCollection) => {

    return ({
        position: {
            model: model.Position,
            as: 'position',
            include: []
        },
        positions: {
            model: model.Position,
            as: 'positions',
            include: []
        },
        employee: {
            model: model.Employee,
            as: 'employee',
            include: []
        },
        employees: {
            model: model.Employee,
            as: 'employees',
            include: []
        },
        division: {
            model: model.Division,
            as: 'division',
            include: []
        },
        divisions: {
            model: model.Division,
            as: 'divisions',
            include: []
        },
        attendance: {
            model: model.Attendance,
            as: 'attendance',
            include: []
        },
        attendances: {
            model: model.Attendance,
            as: 'attendances',
            include: []
        },
        payroll: {
            model: model.Payroll,
            as: 'payroll',
            include: []
        },
        payrolls: {
            model: model.Payroll,
            as: 'payrolls',
            include: []
        },
        salaies: {
            model: model.SalaryEmployee,
            as: 'salaries',
            include: []
        },
        salary: {
            model: model.SalaryEmployee,
            as: 'salary',
            include: []
        },
        weeklyPayment: {
            model: model.WeeklyPayment,
            as: 'weeklyPayment',
            include: []
        },
        weeklyPayments: {
            model: model.WeeklyPayment,
            as: 'weeklyPayments',
            include: []
        }
    })
    
}