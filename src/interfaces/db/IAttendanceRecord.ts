import { IEmployee } from '@src/interfaces/db/IEmployee';
import { Nullable } from "@src/types/common";

export interface IBaseAttendanceRecord {

    employeeId: number;
    machineId?: number;
    status: string;
    recordTime: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IAttendance extends IBaseAttendanceRecord {
    id: number;
    readonly employee?: IEmployee;
}