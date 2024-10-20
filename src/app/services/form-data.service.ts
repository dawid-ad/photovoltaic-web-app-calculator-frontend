import { Injectable } from '@angular/core';
import {CalculationFormData} from "../model/CalculationFormData";

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private formData = new CalculationFormData();

  setFormData(data: any) {
    this.formData = { ...this.formData, ...data };
  }

  private setMountType(data: any){
    switch (data.installationType) {
      case 'GROUND':
        data.mountType = data.installationType;
        break;
      case 'ROOF':
        switch (data.roofType) {
          case 'FLAT_ROOF':
            data.mountType = 'BALLAST_FLAT';
            break;
          case 'SLANT_ROOF':
            data.mountType = ((data.roofSurface === 'OTHER') ? 'STEEL_SLANT' : data.roofSurface);
            break;
        }
        break;
    }
    return data;
  }

  getFormData() {
    return this.setMountType(this.formData);
  }

  resetFormData() {
    this.formData = new CalculationFormData();
  }
}
