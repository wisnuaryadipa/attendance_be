import {Sequelize} from 'Sequelize';
import config from '@src/config/sequelize'

const db = new Sequelize(config.database, config.username, config.password, config); 
export default db;