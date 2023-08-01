import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../CommonService';
import { VehicleResponse } from '../../model/VehicleResponse';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SalesInvoiceResponse } from '../../model/SalesInvoiceResponse';
import { GatePassResponse } from '../../model/GatePassResponse';

@Injectable({
  providedIn: 'root'
})
export class GatePassService {

  constructor(private http: HttpClient, 
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


    async getVehicleDropdown(endpoint:string):Promise<Observable<VehicleResponse>>{
      const httpOptions = await this.service.getHttpOptions();
      return this.http.get<VehicleResponse>(environment.baseUrl + endpoint, httpOptions).pipe(
        catchError((error) => {
          debugger
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }


    async getChallanList(endpoint:string,pager:any): Promise<Observable<any>> {
      const httpOptions = await this.service.getHttpOptions();
      return this.http.post<SalesInvoiceResponse>(environment.baseUrl + endpoint , pager, httpOptions).pipe(
        catchError((error) => {
          debugger
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }


    async createGatePass(endpoint:string,param:any):Promise<Observable<GatePassResponse>>{
      const httpOptions = await this.service.getHttpOptions();
      return this.http.post<GatePassResponse>(environment.baseUrl + endpoint,param, httpOptions).pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }
}
