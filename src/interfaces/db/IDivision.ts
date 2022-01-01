export interface IBaseDivision {

    name: string;
    createdAt: Date;
    updatedAt: Date;
    status: number;
    visible?: number;
}

export interface IDivision extends IBaseDivision {
    id: number;
}

export interface IDivisions {
    [key:number]: IDivision;
}