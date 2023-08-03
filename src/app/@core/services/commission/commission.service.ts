import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../CommonService';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommissionResponse } from '../../model/CommissionResponse';

@Injectable({
  providedIn: 'root'
})
export class CommissionService {

  constructor(private http:HttpClient,
    private router:Router,
    private service:CommonService) { }

    getToken() {
      return localStorage.getItem("key");
    }

    httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.getToken() 
      })
    };

    async getCommission(endpoint:string):Promise<Observable<CommissionResponse>>{
      const httpOptions = await this.service.getHttpOptions();
      return this.http.get<CommissionResponse>(environment.baseUrl + endpoint, httpOptions).pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }

    async createCommission(endpoint:string,param:any):Promise<Observable<CommissionResponse>>{
      const httpOptions = await this.service.getHttpOptions();
      return this.http.post<CommissionResponse>(environment.baseUrl + endpoint,param, httpOptions).pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }
}
