import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../CommonService';
import { Observable, catchError, throwError } from 'rxjs';
import { UserResponse } from '../../model/UserResponse';
import { environment } from 'src/environments/environment';
import { CustomerResponse } from '../../model/CustomerResponse';
import { ProductResponse } from '../../model/ProductResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http:HttpClient,
    private router:Router,
    private service:CommonService) { }
  apiurl = 'https://172.16.61.221:8010/api/';

  getToken() {
    return sessionStorage.getItem("key");
  }

  
   httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + this.getToken() // Adding the bearer token here
    })
  };
  //`${ApiEndPoints.GetProducts}?pageNumber=${pageNumber}&pageSize=${pageSize}`

  async getUsers(endpoint:string):Promise<Observable<UserResponse>>{
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

  
  async getCustomerDropdown(endpoint:string):Promise<Observable<CustomerResponse>>{
    const httpOptions = await this.service.getHttpOptions();
    return this.http.get<CustomerResponse>(environment.baseUrl + endpoint, httpOptions).pipe(
      catchError((error) => {
        debugger
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }
  async getProductDropdown(endpoint:string):Promise<Observable<ProductResponse>>{
    const httpOptions = await this.service.getHttpOptions();
    return this.http.get<ProductResponse>(environment.baseUrl + endpoint, httpOptions).pipe(
      catchError((error) => {
        debugger
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }

  async getProductsById(endpoint:string,id:number):Promise<Observable<ProductResponse>> {
    const httpOptions = await this.service.getHttpOptions();
    return this.http.get<ProductResponse>(environment.baseUrl + endpoint + '?id=' + id, httpOptions).pipe(
      catchError((error) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }

  async createProduct(endpoint:string,param:any):Promise<Observable<ProductResponse>>{
    const httpOptions = await this.service.getHttpOptions();
    return this.http.post<ProductResponse>(environment.baseUrl + endpoint,param, httpOptions).pipe(
      catchError((error) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }

  
   async updateProduct(endpoint:string,param:any):Promise<Observable<ProductResponse>>{
    const httpOptions = await this.service.getHttpOptions();
    return this.http.post<ProductResponse>(environment.baseUrl + endpoint,param, httpOptions).pipe(
      catchError((error) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }

  async deleteProduct(endpoint:string,id:number):Promise<Observable<ProductResponse>>{
    const httpOptions = await this.service.getHttpOptions();
    return this.http.get<ProductResponse>(environment.baseUrl + endpoint+ '?id=' + id, httpOptions).pipe(
      catchError((error) => {
        // if (error.status === HttpStatusCode.Unauthorized) {
        //   this.router.navigate(['login']);
        // }
        return throwError(error);
      })
    );
  }
}
