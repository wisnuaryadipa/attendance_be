import moment from "moment";
import {Model} from 'sequelize'

export interface IBaseAttendanceMachine {
    name?: string | null;
    officeLocation: string|null;
    createdAt: Date;
    updatedAt: Date;
    status: number;
}

export interface IAttendanceMachine extends IBaseAttendanceMachine {
    id: number;
}

export interface IAttendanceMachines {
    [key:number]: IAttendanceMachine
}

export class AttendanceMachine implements IBaseAttendanceMachine {
    name= null;
    officeLocation= null;
    createdAt= moment().toDate();
    updatedAt= moment().toDate();
    status= 1;
}

