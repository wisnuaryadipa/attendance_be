import { IEmployee } from '@src/interfaces/db/IEmployee';
import { Nullable } from "@src/types/common";

export interface IBaseWeeklyPayment {
    id: number;
    machineId: number;
    employeeId: number;
    totalWorkingDays: number;
    totalWorkingHolidays: number;
    totalOvertime: number;
    description: string;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    paymentDate: Date;
}

export interface IWeeklyPayment extends IBaseWeeklyPayment {
    readonly employee?: IEmployee;
}