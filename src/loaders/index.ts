import expressLoader from './express';
import express from 'express';
import sequelizeLoader from './sequelize';
import Logger from './logger';


const loaders = async ({ expressApp } : {expressApp: express.Application}) => {


    /** ========= Part to connect database via sequelize ======== */
    const sequelizeConnection = await sequelizeLoader().authenticate();
    sequelizeConnection;
    Logger.info('✌️ DB loaded and connected!');
    /** ========= End part to connect database via sequelize ======= */
    
    
    await expressLoader(expressApp)

}

export default loaders;