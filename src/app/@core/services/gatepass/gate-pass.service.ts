import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../CommonService';

@Injectable({
  providedIn: 'root'
})
export class GatePassService {

  constructor(private http: HttpClient, 
    private router:Router,
    private service:CommonService) { }

    getToken() {
      return sessionStorage.getItem("key");
    }
    httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.getToken() // Adding the bearer token here
      })
    };
}
