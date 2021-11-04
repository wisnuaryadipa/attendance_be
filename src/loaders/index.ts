import expressLoader from './express';
import express from 'express';
import sequelizeLoader from './sequelize';
import Logger from './logger';


const loaders = async ({ expressApp } : {expressApp: express.Application}) => {

    const sequelizeConnection = await sequelizeLoader().authenticate();
    sequelizeConnection;
    Logger.info('✌️ DB loaded and connected!');
    
    await expressLoader(expressApp)

}

export default loaders;