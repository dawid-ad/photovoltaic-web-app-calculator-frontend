import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {CalculationFormData} from "../model/CalculationFormData";
import {environment} from "../../environments/environment";
import {WarrantyData} from "../model/WarrantyData";
import {CalculationResult} from "../model/CalculationResult";
import {EnergyStorage} from "../model/EnergyStorage";

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
    return this.http.get<EnergyStorage[]>(`${environment.API_URL}/api/energy-storage/models`).pipe(
      catchError(error => {
        console.error("API Energy Storage Error:", error);
        return of([]);
      })
    );
  }

  getCalculationResult(data: CalculationFormData): Observable<CalculationResult> {
    return this.http.post<CalculationResult>(`${environment.API_URL}/api/calculate`, data).pipe(
      catchError(error => {
        console.error("API Calculation Error:", error);
        return of(new CalculationResult());
      })
    );
  }

  // submitContactForm(contactForm: ContactForm): Observable<ContactFormResponse> {
  //   return this.http.post<ContactFormResponse>(`${environment.API_URL}/api/contact-form`, contactForm);
  // }

}
