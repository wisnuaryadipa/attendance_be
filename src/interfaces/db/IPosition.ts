export interface IBasePosition {
    name: string;
    basicSalary?: string;
    wagePerhour?: number;
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