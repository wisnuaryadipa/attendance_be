import model from '@src/models/postgresql';
import {IBasePosition, IPosition} from '@src/interfaces/db/IPosition';

class PositionService {
    getPositions = async () => {
        return await model.tm_position.findAll();
    };

    getPositionById = async (positionId: number) => {
        return await model.tm_position.findOne({where: {id: positionId}});
    }

    addPosition = async (position: IBasePosition) => {
        return await model.tm_position.create(position);
    }

    editPosition = async (position: IPosition) => {
        return await model.tm_position.update(position, { where: {id: position.id}});
    }
}

export default new PositionService();