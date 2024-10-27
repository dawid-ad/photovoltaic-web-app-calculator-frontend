import {CalculationFormData} from "./CalculationFormData";
import {CalculationResult} from "./CalculationResult";

export class ContactForm {
  id: number = 0;
  name: string = '-';
  email: string = '-';
  phone: string = '-';
  message: string = '-';
  contactDate: any = null;
  calculationFormData: CalculationFormData = new CalculationFormData();
  calculationResult: CalculationResult = new CalculationResult();
}
