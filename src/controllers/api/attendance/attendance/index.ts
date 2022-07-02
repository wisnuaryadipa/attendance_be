import getByEmployeeId from './getByEmployeeIdController'
import getByEmployeeController from './getByEmployeeController'
import regenerateStatusAttend from './regenerateStatusAttend'

export default {
    filterByEmployee: getByEmployeeController,
    filterByEmployeeId: getByEmployeeId,
    regenerateStatusAttend: regenerateStatusAttend
}