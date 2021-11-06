import express, { RequestHandler } from 'express'
import Joi from 'joi';
import sendResponse from '@src/utilities/sendResponse'


class IRequestValidationSchema {
    body?: Joi.Schema;
    header?: Joi.Schema;
    params?: Joi.Schema;
    query?: Joi.Schema;
}

export class BaseController {
    public Joi = Joi;
    sendResponse = sendResponse;
    requestHandler!: RequestHandler;
}
