import getByIdController from './getByIdController';
import getAllController from './getAllController';
import editController from './editController';
import addController from './addController';
import payroll from './payroll';
import getCountController from './getCountController';
import deleteByIdController from './deleteByIdController';

export default {
    addOne: addController,
    getById: getByIdController,
    getAll: getAllController,
    edit: editController,
    payroll: payroll,
    getCount: getCountController,
    delete: deleteByIdController
}