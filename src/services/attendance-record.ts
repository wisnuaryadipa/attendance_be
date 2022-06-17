import { IBaseAttendanceRecord } from "src/interfaces/db/IAttendanceRecord";
import model from '@src/models/postgresql';
import {FindOptions} from 'sequelize';

const option: FindOptions = {
    limit: 10,
    offset: 1,
}


class AttendanceRecord {

    add = async (attendance: IBaseAttendanceRecord) => {
        return await model.AttendanceRecord.create(attendance);
    }

    getAll = async () => {
        return await model.AttendanceRecord.findAll({...option});
    }

    getAllByEmployee = async (employeeId: string, dateStart: string, dateEnd: string, _option: FindOptions) => {
        return await model.AttendanceRecord.findAll({...option, ..._option, 
            where: {
                employeeId: employeeId
            }
        })
    }
    
    getAllByDate = async (dateStart: string, dateEnd: string, _option: FindOptions) => {
        return await model.AttendanceRecord.findAll({
            ...option, 
            ..._option,
            where: {
                
            }

        })
    }


}

export default new AttendanceRecord();

