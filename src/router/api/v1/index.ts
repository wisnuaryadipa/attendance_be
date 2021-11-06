import sendResponse from '@src/utilities/sendResponse';
import express, { Application, Router } from "express";
import controller from '@src/controllers/';
import multer from 'multer';

const v1 = Router();

v1.post('/status', multer().single('file'), controller.apiControllers.importAttendanceController.requestHandler);

export default v1;
