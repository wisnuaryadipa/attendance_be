import model from '@src/models/postgresql';
import {IBaseDivision, IDivision} from '@src/interfaces/db/IDivision';

class DivisionService {
    getDivisions = () => {
        return model.tm_division.findAll();
    };

    getDivisionById = (divisionId: number) => {
        return model.tm_division.findOne({where: {id: divisionId}});
    }

    addDivision = (division: IBaseDivision) => {
        return model.tm_division.create(division);
    }

    editDivision = (division: IDivision) => {
        return model.tm_division.update(division, { where: {id: division.id}});
    }
}

export default new DivisionService();