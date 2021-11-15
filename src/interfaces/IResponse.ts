import Joi from "joi";

interface IOptions {
    data?: any;
    flag?: string;
    message?: string;
    error?: Error;
    joiError?: Joi.ValidationError;
    status?: 200 | 201 | 400 | 401 | 500;
}

interface IDataToSend {
    httpCode: number;
    requestId: string;
    errors: string[];
    data: any;
    message: string;
    flag?: string | undefined;
}

export {
    IOptions,
    IDataToSend
}