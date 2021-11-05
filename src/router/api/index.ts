import express, { Application } from 'express';
import v1 from '@src/router/api/v1'


const api = (app: Application) => {
    app.use('/', v1);
}

export default api;