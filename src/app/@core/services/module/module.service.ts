import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../CommonService';
import { ModuleResponse } from '../../model/ModuleResponse';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  constructor( private http:HttpClient,
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

    async getModules(endpoint:string,pager:any):Promise<Observable<ModuleResponse>>{
      const httpOptions = await this.service.getHttpOptions();
      debugger
      return this.http.get<ModuleResponse>(environment.baseUrl + endpoint + '?pageNumber=' + pager.pageIndex + '&pageSize=' + pager.pageSize, httpOptions).pipe(
        catchError((error) => {
          debugger
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }

    async createModule(endpoint:string,param:any):Promise<Observable<ModuleResponse>>{
      const httpOptions = await this.service.getHttpOptions();
      return this.http.post<ModuleResponse>(environment.baseUrl + endpoint,param, httpOptions).pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }
  
    
     async updateModule(endpoint:string,param:any):Promise<Observable<ModuleResponse>>{
      const httpOptions = await this.service.getHttpOptions();
      return this.http.post<ModuleResponse>(environment.baseUrl + endpoint,param, httpOptions).pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }
    
}
