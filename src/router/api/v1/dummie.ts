
import express, { Application, Router } from "express";
import multer from 'multer';
import controllers from '@src/controllers'
import importEditEmployeeGender from '@src/controllers/api/attendance/dummies/import-edit-employees'

const dummie = Router();


dummie.post('/import/edit-employee-gender', multer().single('file'), (req, res, next) => {
    req.setTimeout(0);
    next();
}, importEditEmployeeGender.index);


export default dummie