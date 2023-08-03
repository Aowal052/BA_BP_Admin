import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommissionResponse } from '../../model/CommissionResponse';
import { CommonService } from '../CommonService';
import { VehicleResponse } from '../../model/VehicleResponse';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

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

    async getVehicleList(endpoint:string,pager:any):Promise<Observable<VehicleResponse>>{
      const httpOptions = await this.service.getHttpOptions();
      debugger
      return this.http.get<VehicleResponse>(environment.baseUrl + endpoint + '?pageNumber=' + pager.pageIndex + '&pageSize=' + pager.pageSize, httpOptions).pipe(
        catchError((error) => {
          debugger
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }

  

    async createVehicle(endpoint:string,param:any):Promise<Observable<VehicleResponse>>{
      const httpOptions = await this.service.getHttpOptions();
      return this.http.post<VehicleResponse>(environment.baseUrl + endpoint,param, httpOptions).pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }
}
