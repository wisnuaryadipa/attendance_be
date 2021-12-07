import { Nullable } from "@src/types/common";

export interface IBaseAttendance {

    employeeId: string;
    attendanceTime?: string;
    visible: number;
    attendanceStatus: number;
    date: string;
    checkIn?: Date;
    checkOut?: Date;
    createdAt: Date;
    updatedAt: Date;
    workDuration?: Nullable<number>;
}

export interface IAttendance extends IBaseAttendance {
    id: number;
}