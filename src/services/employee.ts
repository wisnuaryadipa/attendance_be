
import express from 'express';
import models from '@src/models/postgresql';
import { IEmployee, IBaseEmployee } from '@src/interfaces/db/IEmployee';
import model from '@src/models/postgresql';
import { EmployeeInstance } from '@src/models/postgresql/tm_employee';
import { Includeable } from 'sequelize/types';
import {IncludeList} from '@src/models/postgresql/realation';
import {MonthYear} from '@src/types/common';
import { Op } from 'sequelize';


const arch = {
    position: {
        division: "end"
    },
    payrolls: 'end'
}

const whereArch = {
    id: 1,
    position:{
        division: {}
    },
    payrolls: {
        month: 12,
        year: 2021
    }
}

const _includeList = IncludeList(model)
const buildIncludes = (archInclude: any) => {
    const arrIncludes: any = [];
    for (const key in archInclude) {
        if (typeof archInclude[key] === 'object') {
            const includeObj: any = _includeList[key]
            includeObj['include'] = buildIncludes(archInclude[key])
            arrIncludes.push(includeObj)
        } else {
            arrIncludes.push(_includeList[key])
        }
    }
    return arrIncludes;
}

const buildWhere = (archWhere) => {
    let all = {};
    const arrIncludes: any = [];
    let _where = {}
    let _option = {
        where: {},
        include: []
    }
    for (const key in archWhere) {

        if (typeof archWhere[key] === 'object') {
           const  __where = buildWhere(archWhere[key]);
            const includeObj: any = {..._includeList[key], where: __where}
            includeObj['include'] = buildWhere(archWhere[key])
            console.log(includeObj)
            _where = {..._where, includeObj};
        } else {
            arrIncludes.push(_includeList[key])
            _where = {..._where, [key]: archWhere[key]}
        }

    }
    return _where;
}


let includePosition : Includeable[] = [
    {model: model.Position, as: "position", include: [{
        model: model.Division, as: "division"
    }]}, 
    {model: model.Attendance, as: "attendances"}
]

const buildInclude = (arr: Array<string>) => {
    let _arrIncludes : Includeable[] = []
    for (const key in arr) {
        const splited = arr[key].split('.');
        if (splited.length > 1) {
            for (const key in splited) {
                if (key === '0'){
                    _arrIncludes.push(_includeList[splited[key]])
                } else {
                    
                }
            }

        } else {
            _arrIncludes.push(_includeList[splited[key]])
        }
    }
}

class EmployeeService {
    getEmployees = async ({filter = undefined as any, includes = undefined as any} = {}) => {
        let where: Partial<any> = {
            inputedPayroll: {[Op.or]: [null, {[Op.not]: null}]},
            payroll: {},
            attendance: {},
            division: {},
            search: { [Op.iLike]: `%%` } ,

        };
        
        if (filter) {
            filter.year && (where.payroll["year"] = filter.year);
            filter.month && (where.payroll["month"] = filter.month);
            filter.search && (where.search = { [Op.iLike]: `%${filter.search}%` })
            if (filter.inputedPayroll === "1") { where.inputedPayroll = null }
            if (filter.inputedPayroll === "2") { where.inputedPayroll = {[Op.not]: null} }
        } else {
            
        }
        console.log(where.search)
        return await models.Employee.findAll({
            order:[['machine_id', 'ASC']], 
            where: {
                '$payrolls$': where.inputedPayroll,
                [Op.or]: [
                    { 'name': where.search  },
                ],
            },
            include: [
                { model: model.Position, as: "position", include: [{
                    model: model.Division, as: "division"
                }] },
                { model: model.Payroll, as: "payrolls", required: false, where: where.payroll,  }
            ]
        });
    }

    getEmployeeById = async (employeeId: number, include : string | Array<string> = "") => {

        return await models.Employee.findOne({ 
            order:[['id', 'ASC']], 
            where: {'id': employeeId}, 
            include: includePosition, 
        });
    }

    getEmployeeByDivision = async (divisionId: number) => {
        return await models.Employee.findAll({ where: {division: divisionId}});
    }

    getEmployeeByIdFilter = async (employeeId: number, filter: any) => {
        includePosition = [...includePosition, {
            model: model.Payroll,
            where: {
                month: filter.month,
                year: filter.year
            },
            required: false,
            as: 'payrolls'
        }]

        
        const whereCollection = {} as any;
        whereCollection['machine_id'] = employeeId;

        return await models.Employee.findOne({ 
            order:[['machine_id', 'ASC']], 
            where: whereCollection, 
            include: includePosition
        });
    }

    updateEmployee = async (employee: IBaseEmployee) => {
        
    }

    addEmployee = async (employee: IBaseEmployee) => {
        return await models.Employee.create(employee);
    }

    getBeforeEmployee = async (employeeId: number) => {
        return await models.Employee.findAll({
            where: {
                machineId: {[Op.lt]: employeeId}
            },
            limit: 1,
            order: [['machine_id', 'DESC']]
        })
    }

    getAfterEmployee = async (employeeId: number) => {
        return await models.Employee.findAll({
            where: {
                machineId: {[Op.gt]: employeeId}
            },
            order: [['machine_id', 'ASC']],
            limit: 1
        })
    }

    getCountEmployees = async () => {
        return await models.Employee.count();
    }
    
}

export default new EmployeeService();