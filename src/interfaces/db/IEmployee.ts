import { IAttendance } from './IAttendance';
import {IPosition} from './IPosition'

export interface IBaseEmployee {
    name: string;
    role?: string;
    division?: number;
    createdAt: Date;
    updatedAt: Date;
    status: number;
    machineId?: number;
    positionId?: number;
    gender?:string;
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
    visible?:number;
}

export interface IEmployee extends IBaseEmployee {
    id: number;
    readonly position?: IPosition
    readonly attendances?: IAttendance[];

}

export interface IEmployees {
    [key:number]: IEmployee
}

