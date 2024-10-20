export class ContactForm {
  id: number = 0;
  name: string = '';
  email: string = '';
  phone: string = '';
  message: string = '';
  formData: FormData = new FormData();
  calculationDate: any = null;
  proposedPvPower: number = 0;
  estimatedOneYearProduction: number = 0; // dodac do backendu
  inverterModel: string = '';
  priceFrom: number = 0;
  modulePower: number = 0;
  moduleModel: string = '';
  panelsQuantity: number = 0;
  vatTax: number = 0;
}
