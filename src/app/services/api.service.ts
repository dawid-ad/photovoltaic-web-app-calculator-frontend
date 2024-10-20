import {inject, Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {CalculationFormData} from "../model/CalculationFormData";
import {ContactForm} from "../model/ContactForm";
import {environment} from "../../environments/enivonment";
import {WarrantyData} from "../model/WarrantyData";

@Injectable({
  providedIn: 'root'
})
export class ApiService implements OnInit {
  http = inject(HttpClient);
  posts: any =[]

  ngOnInit() {
    // this.fetchPosts();
  }

  fetchPosts(){
    this.http.get(environment.API_URL + "/public/contact-form").subscribe((response:any) => {
      console.log(response);
    })
  }

  getCalculationResult(object:CalculationFormData):Observable<ContactForm>{
    return this.http.post<ContactForm>(environment.API_URL + "public/calculate",object);
  }
  getWarrantyData():Observable<WarrantyData>{
    const headers = new HttpHeaders({
      'Authorization': 'your-api-key-here'  // Replace 'your-api-key-here' with your actual API key
    });
    return this.http.get<WarrantyData>(environment.API_URL + "api/warranty");
  }
}
