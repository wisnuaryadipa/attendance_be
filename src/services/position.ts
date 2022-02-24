import { Op } from 'sequelize';
import Employee from '@src/models/postgresql/tm_employee';
import model from '@src/models/postgresql';
import {IBasePosition, IPosition} from '@src/interfaces/db/IPosition';
import Division from 'src/models/postgresql/tm_division';

const includeEmployees = [{model: Division, as: "division"}]
const includeDivision = [{model: Division, as: "division"}]
const {Sequelize, Position} = model; 

class PositionService {
    getPositions = async () => {
        return await Position.findAll({include: includeEmployees});
    };

    getPositionById = async (positionId: number) => {
        return await Position.findOne({where: {id: positionId}, include: includeEmployees});
    }

    addPosition = async (position: IBasePosition) => {
        return await Position.create(position);
    }

    editPosition = async (position: IPosition) => {
        return await Position.update(position, { where: {id: position.id}});
    }
    getPositionByName = async (positionName: string) => {
        return await Position.findOne({where: {[Op.and]: [
            Sequelize.where(Sequelize.fn('lower', Sequelize.col('tm_position.name')), Sequelize.fn('lower', positionName))
        ]}, include: includeEmployees})
    }
}

export default new PositionService();