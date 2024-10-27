import { Injectable } from '@angular/core';
import {CalculationFormData} from "../model/CalculationFormData";

@Injectable({
  providedIn: 'root'
})
export class CalculationFormDataService {
  private CalculationFormData = new CalculationFormData();

  setFormData(data: any) {
    this.CalculationFormData = { ...this.CalculationFormData, ...data };
  }

  getCalculationFormData() {
    return this.CalculationFormData;
  }

  resetCalculationFormData() {
    this.CalculationFormData = new CalculationFormData();
  }
}
