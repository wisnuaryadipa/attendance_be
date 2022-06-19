import { IBaseAttendanceRecord } from "src/interfaces/db/IAttendanceRecord";
import model from '@src/models/postgresql';
import {FindOptions, Op} from 'sequelize';
import moment from "moment";

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
                employeeId: employeeId,
                recordTime: {
                    [Op.gte]: moment(dateStart).startOf('days').toDate(),
                    [Op.lte]: moment(dateEnd).endOf('days').toDate()
                }
            }
        })
    }
    
    getAllByDate = async (dateStart: string, dateEnd: string, _option: FindOptions) => {
        return await model.AttendanceRecord.findAll({
            ...option, 
            ..._option,
            where: {
                recordTime: {
                    [Op.gte]: moment(dateStart).startOf('days').toDate(),
                    [Op.lte]: moment(dateEnd).endOf('days').toDate()
                }
            }

        })
    }


}

export default new AttendanceRecord();

