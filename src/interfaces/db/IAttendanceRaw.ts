import { IEmployee } from '@src/interfaces/db/IEmployee';
import { Nullable } from "@src/types/common";

export interface IBaseAttendanceRaw {

    employeeId: string;
    attendanceTime?: string;
    visible: number;
    attendanceStatus?: number;
    date: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAttendanceRaw extends IBaseAttendanceRaw {
    id: number;
    readonly employee?: IEmployee;
}