import express, { Application, Router } from 'express';
import v1 from '@src/router/api/v1'

const api = Router();

api.use('/', v1);

export default api;