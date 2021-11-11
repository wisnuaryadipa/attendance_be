export interface IBaseEmployee {
    name: string;
    role: string;
    division: number;
    createdAt: Date;
    updatedAt: Date;
    status: number;
    machine_id: number;
}

export interface IEmployee extends IBaseEmployee {
    id: number;
}

export interface IEmployees {
    [key:number]: IEmployee
}