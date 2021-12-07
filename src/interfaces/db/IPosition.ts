export interface IBasePosition {
    name: string;
    basicSalary?: string;
    wagePerHour?: number;
    overtimeWagePerHour?: number;
    defaultWorkingHour?: number;
    description?: number;
    divisionId?: number;
    createdAt: Date;
    updatedAt: Date;
    status: string;
}

export interface IPosition extends IBasePosition {
    id: number;
}