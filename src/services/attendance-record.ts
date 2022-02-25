import { IBaseAttendanceRecord } from "src/interfaces/db/IAttendanceRecord";
import model from '@src/models/postgresql';




class AttendanceRecord {

    add = async (attendance: IBaseAttendanceRecord) => {
        return await model.AttendanceRecord.create(attendance);
    }

}

export default new AttendanceRecord();

