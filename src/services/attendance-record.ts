import { IBaseAttendanceRecord } from "src/interfaces/db/IAttendanceRecord";
import model from '@src/models/postgresql';




class AttendanceRecord {

    add = async (attendance: IBaseAttendanceRecord) => {
        return await model.AttendanceRecord.create(attendance);
    }

    getAll = async () => {
        return await model.AttendanceRecord.findAll();
    }

}

export default new AttendanceRecord();

