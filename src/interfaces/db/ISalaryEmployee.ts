import { IEmployee } from '@src/interfaces/db/IEmployee';
import { Nullable } from "@src/types/common";

export interface IBaseSalaryEmployee {
    id: number;
    machineId: number;
    employeeId: number;
    dailySalary: number;
    holidaySalary: number;
    overtimeSalary: number;
    bankAccountId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISalaryEmployee extends IBaseSalaryEmployee {
    readonly employee?: IEmployee;
}