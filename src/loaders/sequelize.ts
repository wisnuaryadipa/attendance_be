import {Sequelize} from 'Sequelize';
import config from '../config/sequelize'


export default () => {
    
    const db = new Sequelize(config.database, config.username, config.password, config);    
    return db;

}
