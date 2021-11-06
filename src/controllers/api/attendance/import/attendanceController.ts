import express, {Request, Response} from "express";
import {BaseController} from "@src/controllers/api/index";
import {IOptions} from "@src/interfaces/IResponse"
import xlsx from 'xlsx';

class Controller extends BaseController {

    requestHandler = async (req: Request, res: Response) => {
        this.sendResponse(req, res, {data: req.file});
        let option: IOptions = {};
        try {
            if (req.body == undefined) {
                option.status = 400;
                option.message = "Please upload an excel file!";
                this.sendResponse(req, res, option);
            }
            let importedExcel = xlsx.read(req.body, {type: 'buffer'})
            let firstSheetName = importedExcel.SheetNames[0];

            let worksheet = importedExcel.Sheets[firstSheetName];
            
            option.status = 200;
            option.message = "success";
            option.data = importedExcel;
            this.sendResponse(req, res, option);
            
        }
        catch (err) {
            console.log(err);
            
            option.status = 500;
            option.message = "Could not upload the file";
            this.sendResponse(req, res, option);
        }
        
    }
}

export default new Controller();