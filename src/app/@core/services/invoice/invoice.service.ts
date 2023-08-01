import { Injectable } from '@angular/core';
import { InvoiceResponse } from '../../model/InvoiceResponse';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonService } from '../CommonService';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor( private http:HttpClient,
    private router:Router,
    private service:CommonService) { }
    
  async getInvoiceMasterCreateById(endpoint:string,param:any):Promise<Observable<InvoiceResponse>>{
    const httpOptions = await this.service.getHttpOptions();
    return this.http.post<InvoiceResponse>(environment.baseUrl + endpoint,param, httpOptions).pipe(
      catchError((error) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }
  async getInvoiceDetailCreateById(endpoint:string,param:any):Promise<Observable<InvoiceResponse>>{
    const httpOptions = await this.service.getHttpOptions();
    return this.http.post<InvoiceResponse>(environment.baseUrl + endpoint,param, httpOptions).pipe(
      catchError((error) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }

  async createInvoice(endpoint:string,param:any):Promise<Observable<InvoiceResponse>>{
    const httpOptions = await this.service.getHttpOptions();
    return this.http.post<InvoiceResponse>(environment.baseUrl + endpoint,param, httpOptions).pipe(
      catchError((error) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }
}
