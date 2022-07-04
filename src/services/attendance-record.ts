import { IFilterOption } from './../interfaces/IFilterOption';
import { IBaseAttendanceRecord } from "src/interfaces/db/IAttendanceRecord";
import model from '@src/models/postgresql';
import {Filterable, FindOptions, Op, WhereOptions} from 'sequelize';
import moment from "moment";
import { AttendanceRecordInstance } from "src/models/postgresql/tb_attendance_record";
import { IFilterAttendanceRecord } from './../interfaces/IFilterOption';


const optionPagination: FindOptions = {
    limit: 10,
    offset: 1,
}

class AttendanceRecord {

    add = async (attendance: IBaseAttendanceRecord) => {
        return await model.AttendanceRecord.create(attendance);
    }

    edit = async (attendance: AttendanceRecordInstance) => {
        return await model.AttendanceRecord.update(attendance, { where: {id: attendance.id}})
    }

    getAll = async () => {
        return await model.AttendanceRecord.findAll({ ...optionPagination });
    }

    getAttendances = async ( _options? :IFilterAttendanceRecord) => {
        let _where: IFilterAttendanceRecord = {..._options}
        let where: WhereOptions<AttendanceRecordInstance> = {}
        
        if (_where.employeeId) { where = {...where, employeeId: _options?.employeeId}}  

        return await model.AttendanceRecord.findAll({ 
           
            where: {
                ...where,
                recordTime: {
                    [Op.gte]: moment(_where.dateStart, 'DD-MM-YYYY').startOf('days').toDate(),
                    [Op.lte]: moment(_where.dateEnd, 'DD-MM-YYYY').endOf('days').toDate()
                }
            },
            order: [
                ['recordTime', 'asc']
            ]
        })
    }

    getAllByEmployee = async (employeeId: string, dateStart: string, dateEnd: string, _option?: FindOptions) => {
        return await model.AttendanceRecord.findAll({  ..._option, 
            where: {
                employeeId: employeeId,
                recordTime: {
                    [Op.gte]: moment(dateStart, 'DD-MM-YYYY').startOf('days').format('YYYY-MM-DD HH:mm'),
                    [Op.lte]: moment(dateEnd, 'DD-MM-YYYY').endOf('days').format('YYYY-MM-DD HH:mm')
                }
            },
            order: [
                ['recordTime', 'asc']
            ]
        })
    }
    
    getAllByDate = async (dateStart: string, dateEnd: string, _option: FindOptions) => {
        return await model.AttendanceRecord.findAll({
            ...optionPagination, 
            ..._option,
            where: {
                recordTime: {
                    [Op.gte]: moment(dateStart, 'DD-MM-YYYY').startOf('days').format(),
                    [Op.lte]: moment(dateEnd, 'DD-MM-YYYY').endOf('days').toDate()
                }
            }
        });
    }

    getPrevRecordByRecordTime = async (_employeeId: number, _recordTime: string) => {
        /*
            Desc    : Find last previous attendance recordTime by recordTime function parameter.
        */
        return await model.AttendanceRecord.findOne({
            where: {
                employeeId: _employeeId,
                recordTime: {
                    [Op.lt]: moment(_recordTime).toDate()
                }
            },
            order: [
                ['recordTime', 'desc']
            ]
        });
    }

    getPrevRecordsByRecordTime = async (_employeeId: number, _recordTime: string) => {
        /*
            Desc    : Find previous attendance recordTime by recordTime function parameter.
        */
        return await model.AttendanceRecord.findOne({
            where: {
                employeeId: _employeeId,
                recordTime: {
                    [Op.lt]: moment(_recordTime).toDate()
                }
            },
            order: [
                ['recordTime', 'desc']
            ]
        });
    }

    getAttendanceByRecordTime = async (_employeeId: number, _recordTime: string) => {
        return await model.AttendanceRecord.findOne({
            where: {
                recordTime: moment(_recordTime).toDate(),
                employeeId: _employeeId
            }
        })
    }


}

export default new AttendanceRecord();

