import addController from '@src/controllers/api/attendance/master/division/addController';
import getByIdController from '@src/controllers/api/attendance/master/division/getByIdController';
import getAllController from '@src/controllers/api/attendance/master/division/getAllController';

export default {
    addOne: addController,
    getById: getByIdController,
    getAll: getAllController
}