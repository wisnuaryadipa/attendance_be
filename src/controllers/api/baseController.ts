import express, { RequestHandler, Request} from 'express'
import Joi from 'joi';
import sendResponse from '@src/utilities/sendResponse';
import errorCode from '@src/errors/flags';
import ApplicationError from '@src/errors/application-error'


class IRequestValidationSchema {
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

    public Joi = Joi;
    sendResponse = sendResponse;
    requestHandler!: RequestHandler;
    validation: IRequestValidationSchema = {};
    requestValidationSchema!: IRequestValidationSchema;
    
    validateRequest = async (req: Request) => {
        let { body, headers, params, query} = req;
        let _return;
        console.log(this.requestValidationSchema.query)
        query = await this.requestValidationSchema.query?.validateAsync(query).catch(error => {
          throw new ApplicationError({ message: error.message, flag: errorCode.INVALID_QUERY_PARAM })
        })
        body = await this.requestValidationSchema.body?.validateAsync(body).catch(error => {
          throw new ApplicationError({ message: error.message, flag: errorCode.INVALID_BODY })
        })
        headers = await this.requestValidationSchema.header?.validateAsync(headers, { allowUnknown: true }).catch(error => {
          throw new ApplicationError({ message: error.message, flag: errorCode.INVALID_HEADER })
        })
        params = await this.requestValidationSchema.params?.validateAsync(params, { allowUnknown: true }).catch(error => {
          throw new ApplicationError({ message: error.message, flag: errorCode.INVALID_URL_PARAM })
        })

        return {query, body, headers, params}

      }
}
