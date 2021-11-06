import express, { Application } from 'express';
import api from '@src/router/api';

const routes = (app: Application) => {

    app.use('/api', api)
}


export default routes;

