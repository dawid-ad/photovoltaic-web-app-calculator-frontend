import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  formData: any = {
    region: '',
    customerType: '',
    roofType: '',
    roofSurface: '',
    installationType: '',
    energyConsumptionPerYear: null,
    installationPower: null,
  };

  setFormData(data: any) {
    this.formData = { ...this.formData, ...data };
  }

  getFormData() {
    return this.formData;
  }

  resetFormData() {
    this.formData = {
      region: '',
      customerType: '',
      roofType: '',
      roofSurface: '',
      installationType: '',
      energyConsumptionPerYear: null,
      installationPower: null,
    };
  }
}
