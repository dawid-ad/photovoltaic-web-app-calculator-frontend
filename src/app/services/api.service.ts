import {inject, Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {FormData} from "../model/FormData";
import {ContactForm} from "../model/ContactForm";
import {environment} from "../../environments/enivonment";

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

  getCalculationResult(obj:FormData):Observable<ContactForm>{
    return this.http.post<ContactForm>(environment.API_URL + "public/calculate",obj);
  }
}
