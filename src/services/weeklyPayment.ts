import { IBaseWeeklyPayment } from "src/interfaces/db/IWeeklyPayment";
import model from '@src/models/postgresql';

class WeeklyPaymentService {
    addWeeklyPayment = async (payment: IBaseWeeklyPayment) => {
        return await model.WeeklyPayment.create(payment);
    }

    getWeelyPaymentGrouped = async (grouped: string) => {

        return model.WeeklyPayment.findAll({group: [grouped]})
    }

    getLastLotNumber = async () => {
        return model.WeeklyPayment.findOne({group: ['lot_number'], order: ['lot_number', 'DESC']});
    }
}

export default new WeeklyPaymentService();