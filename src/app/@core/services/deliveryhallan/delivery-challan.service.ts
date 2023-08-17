import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../CommonService';
import { CustomerResponse } from '../../model/CustomerResponse';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SubCustomerResponse } from '../../model/SubCustomerResponse';
import { BranchResponse } from '../../model/BranchResponse';
import { DeliveryChallanResponse } from '../../model/DeliveryChallanResponse';

@Injectable({
  providedIn: 'root'
})
export class DeliveryChallanService {

  constructor( private http: HttpClient, 
    private router:Router,
    private service:CommonService) { }

    getToken() {
      return localStorage.getItem("key");
    }
  
    
     httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.getToken() // Adding the bearer token here
      })
    };

    async getChallanSubCustomerDropdown(endpoint:string,id:number):Promise<Observable<SubCustomerResponse>> {
      const httpOptions = await this.service.getHttpOptions();
      debugger;
      return this.http.get<SubCustomerResponse>(environment.baseUrl + endpoint + '?id=' + id, httpOptions).pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }
   
    async updateChallanDetails(endpoint:string,param:any):Promise<Observable<DeliveryChallanResponse>>{
      debugger;
      const httpOptions = await this.service.getHttpOptions();
      return this.http.post<DeliveryChallanResponse>(environment.baseUrl + endpoint,param, httpOptions).pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }

    async getBranchDropdown(endpoint:string):Promise<Observable<BranchResponse>>{
      const httpOptions = await this.service.getHttpOptions();
      return this.http.get<BranchResponse>(environment.baseUrl + endpoint, httpOptions).pipe(
        catchError((error) => {
          debugger
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }

    async createDirectChallan(endpoint:string,param:any):Promise<Observable<DeliveryChallanResponse>>{
      const httpOptions = await this.service.getHttpOptions();
      return this.http.post<DeliveryChallanResponse>(environment.baseUrl + endpoint,param, httpOptions).pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }
    
}
