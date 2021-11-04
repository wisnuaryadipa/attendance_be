
import dotenv from 'dotenv';
import {IDBEnv, IConfig, IDBPostgres, IDBType} from '../interfaces/IConfigs'

const envFound = dotenv.config();
const port = parseInt(process.env.PORT || "80")

if (envFound.error) {
// This error should crash whole process
throw new Error("⚠️  Couldn't find .env file  ⚠️");
}


const config = {

    logs: {
        level: process.env.LOG_LEVEL || 'silly'
    },

    port: port,

    api: {
        prefix: '/api',
    },

    db: {
        development: { 
            postgres: {
                username : process.env.DB_CONNECTION_PG_USER,
                password: process.env.DB_CONNECTION_PG_PASSWORD,
                database: process.env.DB_CONNECTION_PG_DATABASE,
                host: process.env.DB_CONNECTION_PG_HOST,
                schema: process.env.DB_CONNECTION_PG_SCHEMA,
                dialect: "postgres"
            },
        },
        production: { 
            postgres: {
                username : process.env.DB_CONNECTION_PG_USER,
                password: process.env.DB_CONNECTION_PG_PASSWORD,
                database: process.env.DB_CONNECTION_PG_DATABASE,
                host: process.env.DB_CONNECTION_PG_HOST,
                dialect: "postgres"
            },
        },
        test: { 
            postgres: {
                username : process.env.DB_CONNECTION_PG_USER,
                password: process.env.DB_CONNECTION_PG_PASSWORD,
                database: process.env.DB_CONNECTION_PG_DATABASE,
                host: process.env.DB_CONNECTION_PG_HOST,
                schema: process.env.DB_CONNECTION_PG_SCHEMA,
                dialect: "postgres"
            },
            mysql: {
                username : process.env.DB_CONNECTION_PG_USER,
                password: process.env.DB_CONNECTION_PG_PASSWORD,
                database: process.env.DB_CONNECTION_PG_DATABASE,
                host: process.env.DB_CONNECTION_PG_HOST,
            }
        }
    } as IDBEnv
        
        
}

export default config