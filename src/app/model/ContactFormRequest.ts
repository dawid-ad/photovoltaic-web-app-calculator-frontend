import {ContactForm} from "./ContactForm";
import {CalculationFormData} from "./CalculationFormData";
import {CalculationResult} from "./CalculationResult";

export class ContactFormRequest {
  contactForm: ContactForm = new ContactForm();
  calculationFormData: CalculationFormData = new CalculationFormData();
  calculationResult: CalculationResult = new CalculationResult();
}
