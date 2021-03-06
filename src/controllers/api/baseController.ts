import express, { RequestHandler, Request} from 'express'
import Joi from 'joi';
import sendResponse from '@src/utilities/sendResponse';
import errorCode from '@src/errors/flags';
import ApplicationError from '@src/errors/application-error'
import {IOptions} from '@src/interfaces/IResponse';
import { IFilterOption } from 'src/interfaces/IFilterOption';
import moment from 'moment';



export interface IRequestValidationSchemaJOI {
    body?: Joi.Schema;
    header?: Joi.Schema;
    params?: Joi.Schema;
    query?: Joi.Schema;
}
export class BaseController {

    constructor() {
        this.requestValidationSchema = {
            body: undefined,
            header: undefined,
            params: undefined,
            query: undefined,
        }
    }

    protected  Joi = Joi;
    protected sendResponse = sendResponse;
    protected requestHandler!: RequestHandler;
    protected validation: IRequestValidationSchemaJOI = {};
    protected requestValidationSchema: IRequestValidationSchemaJOI;
    protected responseOption: IOptions = {
      status: 500, 
      message: "Error !, something wrong in your input parameter or problem on server. "
    };

    protected filterOpt: IFilterOption = {
      offsetPage: 1,
      limit: 10,
      dateStart: moment().subtract('3', 'years').startOf('days').toString(),
      dateEnd: moment().endOf('days').toString(),

    }
    
    protected validateRequest = async (req: Request) => {
        let { body, headers, params, query} = req;
        
        query = await this.requestValidationSchema.query?.validateAsync(query)
        .catch( error => {
          throw new ApplicationError({ 
            message: error.message, 
            flag: errorCode.INVALID_QUERY_PARAM 
          })
        })
        
        body = await this.requestValidationSchema.body?.validateAsync(body,
          { allowUnknown: true })
        .catch( error => {
          console.log('erre')
          throw new ApplicationError({ 
            message: error.message, 
            flag: errorCode.INVALID_BODY 
          })
        })
        
        headers = await this.requestValidationSchema.header?.validateAsync(
          headers, 
          { allowUnknown: true })
        .catch(error => {
          throw new ApplicationError({ 
            message: error.message, 
            flag: errorCode.INVALID_HEADER 
          })
        })

        params = await this.requestValidationSchema.params?.validateAsync(
          params, 
          { allowUnknown: true })
        .catch(error => {
          throw new ApplicationError({ 
            message: error.message, 
            flag: errorCode.INVALID_URL_PARAM 
          })
        })

        return {query, body, headers, params}

    }
}
