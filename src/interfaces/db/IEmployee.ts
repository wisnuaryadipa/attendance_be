import { IAttendance } from './IAttendance';
import {IPosition} from './IPosition'

export interface IBaseEmployee {
    id: number;
    name: string;
    role?: string;
    division?: number;
    createdAt: Date;
    updatedAt: Date;
    status: number;
    machineId?: number;
    positionId?: number;
    gender?:number;
    employeeStatus?:string;
    hireDate?: string;
    dateOfBirth?: string;
    address?:string;
    contactNumber?:string;
    email?:string;
    employeeCode?:string;
    description?:string;
    flatSalary?:number;
    activeFlatSalary?:boolean;
    rekeningNumber:string;
    dailySalary: number;
    holidaySalary: number;
    overtimeSalary: number;
    visible?:number;
}

export interface IEmployee extends IBaseEmployee {
    readonly position?: IPosition
    readonly attendances?: IAttendance[];

}

export interface IEmployees {
    [key:number]: IEmployee
}

