import Employee from '@src/models/postgresql/tm_employee';
import model from '@src/models/postgresql';
import {IBasePosition, IPosition} from '@src/interfaces/db/IPosition';
import Division from 'src/models/postgresql/tm_division';

const includeEmployees = [{model: Employee, as: "employees"}, {model: Division, as: "division"}]
const includeDivision = [{model: Division, as: "division"}]


class PositionService {
    getPositions = async () => {
        return await model.Position.findAll({include: includeEmployees});
    };

    getPositionById = async (positionId: number) => {
        return await model.Position.findOne({where: {id: positionId}, include: includeEmployees});
    }

    addPosition = async (position: IBasePosition) => {
        return await model.Position.create(position);
    }

    editPosition = async (position: IPosition) => {
        return await model.Position.update(position, { where: {id: position.id}});
    }
}

export default new PositionService();