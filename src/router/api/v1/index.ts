import sendResponse from '@src/utilities/sendResponse';
import express, { Application, Router } from "express";
import controller from '@src/controllers/';
import multer from 'multer';

const v1 = Router();

v1.post('/status', multer().single('file'), controller.apiControllers.importAttendanceController.requestHandler);


v1.get('/master/division/get-all', controller.apiControllers.attendanceControllers.master.division.getAll.requestHandler);
v1.post('/master/division/add', controller.apiControllers.attendanceControllers.master.division.addOne.requestHandler);
v1.put('/master/division/edit/:id', controller.apiControllers.attendanceControllers.master.division.edit.requestHandler);
v1.get('/master/division/:id', controller.apiControllers.attendanceControllers.master.division.getById.requestHandler);

v1.get('/master/employee/get-all', controller.apiControllers.attendanceControllers.master.employee.getAll.requestHandler);
v1.post('/master/employee/add', controller.apiControllers.attendanceControllers.master.employee.addOne.requestHandler);
v1.put('/master/employee/edit/:id', controller.apiControllers.attendanceControllers.master.employee.edit.requestHandler);
v1.get('/master/employee/:id', controller.apiControllers.attendanceControllers.master.employee.getById.requestHandler);

v1.get('/master/position/get-all', controller.apiControllers.attendanceControllers.master.position.getAll.requestHandler);
v1.post('/master/position/add', controller.apiControllers.attendanceControllers.master.position.addOne.requestHandler);
v1.put('/master/position/edit/:id', controller.apiControllers.attendanceControllers.master.position.edit.requestHandler);
v1.get('/master/position/:id', controller.apiControllers.attendanceControllers.master.position.getById.requestHandler);

v1.post('/master/attendance/filter/:employeeId', controller.apiControllers.attendanceControllers.attendance.filterByEmployee.requestHandler);

v1.post('/payroll/:employeeId', controller.apiControllers.PayrollController.addPayrollPrint.requestHandler);
v1.get('/payroll/:employeeId', controller.apiControllers.PayrollController.getByEmployeeId.requestHandler);
v1.put('/payroll/:employeeId/:year/:month', controller.apiControllers.PayrollController.editPayrollPrint.requestHandler);

export default v1;
