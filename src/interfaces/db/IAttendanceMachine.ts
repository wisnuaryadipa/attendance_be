export interface IBaseAttendanceMachine {
    name: string;
    officeLocation: string;
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
