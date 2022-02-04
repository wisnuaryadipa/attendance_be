import {Request, Response} from 'express';
import {BaseController} from '@src/controllers/api/baseController'
import { IOptions } from '@src/interfaces/IResponse';
import xlsx from 'xlsx';


class Controller extends BaseController {

    requestHandler = (req: Request, res: Response) => {
        let option: IOptions = {};
        try {

            if (req.file == undefined) {
                option.status = 400;
                option.message = "Please upload an excel file!";
                this.sendResponse(req, res, option);
            } else {
                let _fileJson = this.parseExcelToJson(req.file);

                option.status = 200;
                option.message = "success";
                option.data = result;
                this.sendResponse(req, res, option);
            }
        }
        catch (err) {
            console.log(err);
            option.status = 500;
            option.message = "Could not upload the file";
            this.sendResponse(req, res, option);
        }
    }

    parseExcelToJson = (excelFile: Express.Multer.File) => {
        let wb = xlsx.read(excelFile?.buffer, {type: 'buffer'});
        let worksheet = wb.Sheets[wb.SheetNames[0]];
        let jsonXlsx = xlsx.utils.sheet_to_json(worksheet);
        return jsonXlsx;
    }

    storeToDB = (convertedImportFile, dateSubmit) => {
        
    }


    
}

export default new Controller();