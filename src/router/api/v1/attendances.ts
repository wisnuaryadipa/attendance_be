
import express, { Application, Router } from "express";
import multer from 'multer';
import controllers from '@src/controllers'

const attendance = Router();


attendance.post('/import/file', multer().single('file'), (req, res, next) => {
    req.setTimeout(0);
    next();
}, controllers.apiControllers.attendanceControllers.importAttendance.index);


attendance.post('/importraw/file', multer().single('file'), (req, res, next) => {
    req.setTimeout(0);
    next();
}, controllers.apiControllers.attendanceControllers.attendanceRaw.requestHandler);


export default attendance