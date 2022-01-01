import {ModelCollection} from './index'
import model from './index'

export const loadRealation = (modelColl: ModelCollection) => {
    
    modelColl.Position.hasMany( modelColl.Employee, {
        foreignKey: 'positionId',
        sourceKey: 'id',
        as: 'employees'
    })

    modelColl.Employee.belongsTo( modelColl.Position, { 
        foreignKey: 'positionId', targetKey: 'id', as: 'position' 
    });

    modelColl.Division.hasMany( modelColl.Position, {
        foreignKey: 'divisionId',
        sourceKey: 'id',
        as: 'positions'
    })

    modelColl.Position.belongsTo( modelColl.Division, { 
        foreignKey: 'divisionId', targetKey: 'id', as: 'division' 
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
}

export const IncludeList = (model: ModelCollection) => {

    return ({
        position: {
            model: model.Position,
            as: 'position'
        },
        positions: {
            model: model.Position,
            as: 'positions'
        },
        employee: {
            model: model.Employee,
            as: 'employee'
        },
        employees: {
            model: model.Employee,
            as: 'employees'
        },
        division: {
            model: model.Division,
            as: 'division'
        },
        divisions: {
            model: model.Division,
            as: 'divisions'
        },
        attendance: {
            model: model.Attendance,
            as: 'attendance'
        },
        attendances: {
            model: model.Attendance,
            as: 'attendances'
        },
        payroll: {
            model: model.Payroll,
            as: 'payroll'
        },
        payrolls: {
            model: model.Payroll,
            as: 'payrolls'
        },
    })
    
}