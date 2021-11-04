import config from '../config'
import {IDBEnv, IDBType} from '../interfaces/IConfigs'

const env = (process.env.NODE_ENV || 'development');
const dbConfig: IDBType = config.db[env];

const sequelize : any = {
    "host": dbConfig.postgres?.host,
    "username": dbConfig.postgres?.username || "",
    "password": dbConfig.postgres?.password,
    "database": dbConfig.postgres?.database || "",
    "schema": dbConfig.postgres?.schema || "",
    "dialect": "postgres",
    "logging": true,
    "timezone": "+07:00",
    "operatorsAliases": false,
    "define": {
        "freezeTableName": true
    },
    "pool": {
      "max": 30,
      "min": 0,
      "acquire": 1000000000,
      "idle": 10000000
    }
}

export default sequelize;