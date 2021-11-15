import sendResponse from '@src/utilities/sendResponse';
import express, { Application, Router } from "express";
import controller from '@src/controllers/';
import multer from 'multer';

const v1 = Router();

v1.post('/status', multer().single('file'), controller.apiControllers.importAttendanceController.requestHandler);
v1.get('/master/employee/get-all', controller.apiControllers.attendanceControllers.master.employee.getAll.requestHandler);


v1.post('/master/division/add', controller.apiControllers.attendanceControllers.master.division.addOne.requestHandler);

export default v1;
