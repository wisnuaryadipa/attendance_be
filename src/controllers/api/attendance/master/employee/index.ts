import getByIdController from '@src/controllers/api/attendance/master/employee/getByIdController';
import getAllController from '@src/controllers/api/attendance/master/employee/getAllController';
import editController from '@src/controllers/api/attendance/master/employee/editController';
import addController from '@src/controllers/api/attendance/master/employee/addController';

export default {
    addOne: addController,
    getById: getByIdController,
    getAll: getAllController,
    edit: editController
}