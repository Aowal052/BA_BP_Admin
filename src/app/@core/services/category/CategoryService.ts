import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { CommonService } from '../CommonService';
import { CategoryResponse } from '../../model/CategoryResponse';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http:HttpClient,
    private router:Router,
    private service:CommonService) { }
  apiurl = 'https://localhost:7143/api/';

  

  async getCategory(endpoint:string,pager:any):Promise<Observable<CategoryResponse>>{
    const httpOptions = await this.service.getHttpOptions();
    return this.http.get<CategoryResponse>(this.apiurl + endpoint + '?pageNumber=' + pager.pageIndex + '&pageSize=' + pager.pageSize, httpOptions).pipe(
      catchError((error) => {
        debugger
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['abnormal403']);
        }
        return throwError(error);
      })
    );
  }

  async addCategory(endpoint:string,param:any):Promise<Observable<CategoryResponse>>{
    const httpOptions = await this.service.getHttpOptions();
    return this.http.post<CategoryResponse>(this.apiurl + endpoint,param, httpOptions).pipe(
      catchError((error) => {
        debugger
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['abnormal403']);
        }
        return throwError(error);
      })
    );
  }

  async getCategoryById(endpoint:string,id:number):Promise<Observable<CategoryResponse>> {
    const httpOptions = await this.service.getHttpOptions();
    return this.http.get<CategoryResponse>(this.apiurl + endpoint + '?id=' + id, httpOptions).pipe(
      catchError((error) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['abnormal403']);
        }
        return throwError(error);
      })
    );
  }
  
  async deleteCategory(endpoint:string,id:number):Promise<Observable<CategoryResponse>>{
    const httpOptions = await this.service.getHttpOptions();
    return this.http.get<CategoryResponse>(this.apiurl + endpoint+ '?id=' + id, httpOptions).pipe(
      catchError((error) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['abnormal403']);
        }
        return throwError(error);
      })
    );
  }

  async updateCategory(endpoint:string,param:any):Promise<Observable<CategoryResponse>>{
    const httpOptions = await this.service.getHttpOptions();
    return this.http.post<CategoryResponse>(this.apiurl + endpoint,param, httpOptions).pipe(
      catchError((error) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['abnormal403']);
        }
        return throwError(error);
      })
    );
  }
}
