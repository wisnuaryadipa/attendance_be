import { IEmployee } from '@src/interfaces/db/IEmployee';
import { Nullable } from "@src/types/common";

export interface IBasePayroll {
    id: string;
    employeeId: number;
    month: number;
    year: number;
    monthlySalary: number;
    totalDayAttended: number;
    dailySalary: number;
    totalOvertimeHour: number;
    hourlyOvertimeSalary: number;
    tunjangan: number;
    fasilitasBpjs: number;
    incomeLainLain: number;
    outcomeBpjstk: number;
    outcomeDebt: number;
    outcomeLainLain: number;
    createdAt: Date;
    updatedAt: Date;
    selectedSalaryType: boolean;
}

export interface IPayroll extends IBasePayroll {
    readonly employee?: IEmployee;
}