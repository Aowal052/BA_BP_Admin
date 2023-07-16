import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../CommonService';
import { Observable, catchError, throwError } from 'rxjs';
import { SalesInvoiceResponse } from '../../model/SalesInvoiceResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesInvoiceService {

  constructor( private http: HttpClient, 
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
  
    async getProducts(endpoint:string,pager:any):Promise<Observable<SalesInvoiceResponse>>{
      const httpOptions = await this.service.getHttpOptions();
      debugger
      return this.http.get<SalesInvoiceResponse>(environment.baseUrl + endpoint + '?pageNumber=' + pager.pageIndex + '&pageSize=' + pager.pageSize, httpOptions).pipe(
        catchError((error) => {
          debugger
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }

    async createInvoice(endpoint:string,param:any):Promise<Observable<SalesInvoiceResponse>>{
      const httpOptions = await this.service.getHttpOptions();
      return this.http.post<SalesInvoiceResponse>(environment.baseUrl + endpoint,param, httpOptions).pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }
}
