import model from '@src/models/postgresql';
import {IBaseDivision, IDivision} from '@src/interfaces/db/IDivision';

class DivisionService {
    getDivisions = async () => {
        return await model.tm_division.findAll();
    };

    getDivisionById = async (divisionId: number) => {
        return await model.tm_division.findOne({where: {id: divisionId}});
    }

    addDivision = async (division: IBaseDivision) => {
        return await model.tm_division.create(division);
    }

    editDivision = async (division: IDivision) => {
        return await model.tm_division.update(division, { where: {id: division.id}});
    }
}

export default new DivisionService();