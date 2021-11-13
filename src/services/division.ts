import model from '@src/models/postgresql';
import {IBaseDivision} from '@src/interfaces/db/IDivision';

class DivisionService {
    getDivisions = () => {
        return model.tm_division.findAll();
    };

    getDivisionById = (divisionId: number) => {
        return model.tm_division.findAll({where: {id: divisionId}});
    }

    addDivision = (division: IBaseDivision) => {
        return model.tm_division.create(division);
    }
}

export default new DivisionService();