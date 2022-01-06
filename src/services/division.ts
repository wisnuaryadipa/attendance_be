import { Op } from 'sequelize';
import model from '@src/models/postgresql';
import {IBaseDivision, IDivision} from '@src/interfaces/db/IDivision';;

const includePositions = [{model: model.Position, include: [{model: model.Employee, as: 'employees'}] , as: "positions"}]
const {Sequelize, Division} = model;
class DivisionService {
    getDivisions = async () => {
        return await Division.findAll({include: includePositions});
    };

    getDivisionById = async (divisionId: number) => {
        return await Division.findOne({where: {id: divisionId}, include: includePositions});
    }

    addDivision = async (division: IBaseDivision) => {
        return await Division.create(division);
    }

    editDivision = async (division: IDivision) => {
        return await Division.update(division, { where: {id: division.id}});
    }
    getDivisionByName = async (divisionName: string) => {
        return await Division.findOne({where: {[Op.and]: [
            Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), Sequelize.fn('lower', divisionName))
        ]}, include: includePositions})
    }
}

export default new DivisionService();