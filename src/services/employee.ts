
import express from 'express';
import models from '@src/models/postgresql';
import { IEmployee, IBaseEmployee } from '@src/interfaces/db/IEmployee';
import model from '@src/models/postgresql';
import { EmployeeInstance } from '@src/models/postgresql/tm_employee';
import { Includeable } from 'sequelize/types';
import {IncludeList} from '@src/models/postgresql/realation';
import {MonthYear} from '@src/types/common';
import { isEmptyObject } from '@src/helper/main';
import { Op } from 'sequelize';
import _ from 'lodash';
import { number } from 'joi';
import util from 'util';
import IncludeInject from './includeInjection';


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

class EmployeeService {
    getEmployees = async ({filter = undefined as any, includes = undefined as any} = {}) => {
        let _includes = IncludeInject(includes)
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
        
        return await models.Employee.findAll({
            order:[['machine_id', 'ASC']], 
            where: {
                [Op.or]: [
                    { 'name': where.search  },
                ],
            },
            include: _includes
        });
    }

    getEmployeesPayroll = async ({filter = undefined as any, includes = undefined as any} = {}) => {
        let _includes = IncludeInject(includes)
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
        
        _includes = [..._includes, { model: model.Payroll, as: "payrolls", required: false, where: where.payroll,  }]
        return await models.Employee.findAll({
            order:[['machine_id', 'ASC']], 
            where: {
                '$payrolls$': where.inputedPayroll,
                [Op.or]: [
                    { 'name': where.search  },
                ],
            },
            include: _includes
        });
    }

    getEmployeeById = async (employeeId: number, includes : string | Array<string> = "") => {
        const _includes = IncludeInject(includes)

        return await models.Employee.findOne({ 
            order:[['id', 'ASC']], 
            where: {'id': employeeId}, 
            include: _includes, 
        });
    }

    getEmployeeByMachineId = async (machineId: number, includes : string | Array<string> = "") => {
        const _includes = IncludeInject(includes)
        return await models.Employee.findOne({
            order:[['id', 'ASC']],
            where: {'machineId': machineId},
            include: _includes
        })
    }

    getEmployeeByDivision = async (divisionId: number, includes : string | Array<string> = "") => {
        const _includes = IncludeInject(includes)
        return await models.Employee.findAll({ 
            where: {division: divisionId},
            include: _includes,
        });
    }

    getEmployeeByIdFilter = async (employeeId: number, filter: any, includes : string | Array<string> = "") => {
        const _includes = IncludeInject(includes)

        const includePosition = [..._includes, {
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

    getBeforeEmployee = async (employeeId: number, includes : string | Array<string> = "") => {
        const _includes = IncludeInject(includes)
        return await models.Employee.findAll({
            where: {
                machineId: {[Op.lt]: employeeId}
            },
            include: _includes,
            limit: 1,
            order: [['machine_id', 'DESC']]
        })
    }

    getAfterEmployee = async (employeeId: number, includes : string | Array<string> = "") => {
        const _includes = IncludeInject(includes)
        return await models.Employee.findAll({
            where: {
                machineId: {[Op.gt]: employeeId}
            },
            include: _includes,
            order: [['machine_id', 'ASC']],
            limit: 1
        })
    }

    getCountEmployees = async () => {
        return await models.Employee.count();
    }

    getTest = async (include : string | Array<string> = "") => {
        let _convertedToArray = [] as Array<string>
        (typeof include == 'string') ? _convertedToArray.push(include) : _convertedToArray = include;
        const result = IncludeInject(_convertedToArray)

        console.log(util.inspect(result, false, null, true))
    }
    
}

export default new EmployeeService();