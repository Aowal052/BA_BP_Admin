import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../CommonService';
import { SalesReturnResponse } from '../../model/SalesReturnResponse';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesReturnService {

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

    async createSalesReturn(endpoint:string,param:any):Promise<Observable<SalesReturnResponse>>{
      const httpOptions = await this.service.getHttpOptions();
      return this.http.post<SalesReturnResponse>(environment.baseUrl + endpoint,param, httpOptions).pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }
}
