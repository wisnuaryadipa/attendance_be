export interface IBaseDivision {

    name: string;
    createdAt: Date;
    updatedAt: Date;
    status: number;
}

export interface IDivision extends IBaseDivision {
    id: number;
}

export interface IDivisions {
    [key:number]: IDivision;
}