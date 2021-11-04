
import config from '../config'

export type IConfig = typeof config

export type IDBEnv = {
    development: IDBType,
    production: IDBType,
    test: IDBType,
}

export interface IDBType {
    postgres?: IDBPostgres;
    mysql?: IDBPostgres;
}

export interface IDBPostgres {
    username: string | undefined;
    password: string | undefined;
    database: string | undefined;
    host: string | undefined;
    schema?: string | undefined;
}