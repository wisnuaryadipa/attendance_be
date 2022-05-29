import _ from 'lodash';

import { isEmptyObject } from '@src/helper/main';
import { Includeable } from 'sequelize/types';
import {IncludeList} from '@src/models/postgresql/realation';
import model from '@src/models/postgresql';



const _includeList = IncludeList(model)
export const buildInclude = (includeParams: Array<string> | string) => {

    // Input = string or string[] (attendance, attendance.employee)
    // Output = Includeable
    // Description = This function build Includeable object according to input parameter.
    // This fucntion makes you not have to do declare one by one includes inside sequelize query
    // it's so covered includes bound.
    
    let _includeParams = [] as string[];
    let _arrIncludes : Includeable[] = []

    // This condition to handle if includeList parameter shapes as an string
    // then put that string to string of array inside '_includeList'
    if (!includeParams) { return _arrIncludes};
    Array.isArray(includeParams) ? _includeParams = includeParams : _includeParams.push(includeParams)

    
    for (const key in _includeParams) {
        const splited = _includeParams[key].split('.');
        let __incld = _.find(_arrIncludes, {as: splited[key]});
        let _incld: Includeable = __incld ? __incld : {} as Includeable;
        let _varIndex: string = "_arrIncludes";

        if (splited.length > 1) {
            // Do this condition when values of array have dot inside
            // (employee.attendance, position.attendance)
            // not ( employee, position, division )
            for (const key1 in splited) {
                let _indx = 0;
                let _child: any[] = [];

                if (key1 === '0'){

                } else {
                    _varIndex = _varIndex + ".include";
                }
                _child = eval(_varIndex);
                if(_child.length <= 0){
                    // Do this condition if array has empty value
                    _child.push(_includeList[splited[key1]]) 
                    _indx = 0;
                } else {
                    // Do this condiition if array has at least one values
                    // doesn't push nothing becouse already has this relation
                    _indx = _.findIndex(_child, {as: splited[key]});
                    if (_indx == -1) {
                        // Do this condition if there is no item on include array
                        _child.push(_includeList[splited[key1]])
                        _indx = _child.length-1;
                    } else {
                        
                    }
                }
                _varIndex = _varIndex + `[${_indx}]`
            }

        } else {

            // Do this condition when values of array haven't dot inside
            // ( employee, position, division )
            // not (employee.attendance, position.attendance)
            const isIncldEmpty = isEmptyObject(_incld);
            if(isIncldEmpty){
                _incld = _includeList[splited[key]]
            }
        }
    }
    return _arrIncludes
}

export default buildInclude