import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VehicleResponse } from '../../model/VehicleResponse';
import { CommonService } from '../CommonService';
import { BranchResponse } from '../../model/BranchResponse';
import { UserResponse } from '../../model/UserResponse';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

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
    async getUserDropdown(endpoint:string):Promise<Observable<UserResponse>>{
      const httpOptions = await this.service.getHttpOptions();
      return this.http.get<UserResponse>(environment.baseUrl + endpoint, httpOptions).pipe(
        catchError((error) => {
          debugger
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }
    async getBranchList(endpoint:string,pager:any):Promise<Observable<BranchResponse>>{
      const httpOptions = await this.service.getHttpOptions();
      debugger
      return this.http.get<BranchResponse>(environment.baseUrl + endpoint + '?pageNumber=' + pager.pageIndex + '&pageSize=' + pager.pageSize, httpOptions).pipe(
        catchError((error) => {
          debugger
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }

  

    async createBranch(endpoint:string,param:any):Promise<Observable<BranchResponse>>{
      const httpOptions = await this.service.getHttpOptions();
      return this.http.post<BranchResponse>(environment.baseUrl + endpoint,param, httpOptions).pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }
    
    async updateBranch(endpoint:string,param:any):Promise<Observable<BranchResponse>>{
      const httpOptions = await this.service.getHttpOptions();
      return this.http.post<BranchResponse>(environment.baseUrl + endpoint,param, httpOptions).pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            this.router.navigate(['login']);
          }
          return throwError(error);
        })
      );
    }
}
