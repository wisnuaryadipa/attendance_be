import model from '@src/models/postgresql';
import {IBaseDivision, IDivision} from '@src/interfaces/db/IDivision';;

const includePositions = [{model: model.Position, include: [{model: model.Employee, as: 'employees'}] , as: "positions"}]
class DivisionService {
    getDivisions = async () => {
        return await model.Division.findAll({include: includePositions});
    };

    getDivisionById = async (divisionId: number) => {
        return await model.Division.findOne({where: {id: divisionId}, include: includePositions});
    }

    addDivision = async (division: IBaseDivision) => {
        return await model.Division.create(division);
    }

    editDivision = async (division: IDivision) => {
        return await model.Division.update(division, { where: {id: division.id}});
    }
}

export default new DivisionService();