
import express, { Application, Router } from "express";
import multer from 'multer';
import controllers from '@src/controllers'

const attendance = Router();


attendance.post('/import/file', multer().single('file'), (req, res, next) => {
    req.setTimeout(0);
    next();
}, controllers.apiControllers.attendanceControllers.importAttendance.requestHandler);


attendance.post('/importraw/file', multer().single('file'), (req, res, next) => {
    req.setTimeout(0);
    next();
}, controllers.apiControllers.attendanceControllers.importAttendance.requestHandler);

attendance.get('/user/:employeeId/all', controllers.apiControllers.attendanceControllers.attendanceRecord.getAttendanceByEmployee.requestHandler);
attendance.get('/list/:employeeId', controllers.apiControllers.attendanceControllers.attendance.filterByEmployeeId.requestHandler);

export default attendance