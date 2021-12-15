import { IEmployee } from '@src/interfaces/db/IEmployee';
import { Nullable } from "@src/types/common";

export interface IBasePayroll {

    id: string;
    employeeId: number;
    month: number;
    year: number;
    total_day_attended: number;
    daily_salary: number;
    total_overtime_hour: number;
    hourly_overtime_salary: number;
    tunjangan: number;
    fasilitas_bpjs: number;
    income_lain_lain: number;
    outcome_bpjstk: number;
    outcome_debt: number;
    outcome_lain_lain: number;
    monthly_salary: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPayroll extends IBasePayroll {
    readonly employee?: IEmployee;
}