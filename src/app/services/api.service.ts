import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {CalculationFormData} from "../model/CalculationFormData";
import {environment} from "../../environments/environment";
import {WarrantyData} from "../model/WarrantyData";
import {CalculationResult} from "../model/CalculationResult";
import {EnergyStorage} from "../model/EnergyStorage";
import {ContactFormResponse} from "../model/ContactFormResponse";
import {ContactFormRequest} from "../model/ContactFormRequest";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  http = inject(HttpClient);

  getWarrantyData(): Observable<WarrantyData> {
    return this.http.get<WarrantyData>(`${environment.API_URL}/api/warranty`).pipe(
      catchError(error => {
        console.error("API Warranty Error:", error);
        return of(new WarrantyData());
      })
    );
  }

  getEnergyStorageModels(): Observable<EnergyStorage[]> {
    return this.http.get<EnergyStorage[]>(`${environment.API_URL}/api/energy-storage/models`);
  }
  getCalculationResult(data: CalculationFormData): Observable<CalculationResult> {
    return this.http.post<CalculationResult>(`${environment.API_URL}/api/calculate`, data);
  }

  submitContactForm(data: ContactFormRequest): Observable<ContactFormResponse> {
    return this.http.post<ContactFormResponse>(`${environment.API_URL}/api/contact-form/submit`, data).pipe(
      catchError(error => {
        const contactFormResponse = new ContactFormResponse();
        contactFormResponse.success = false;
        contactFormResponse.message = error;
        return of(contactFormResponse);
      })
    );
  }

}
