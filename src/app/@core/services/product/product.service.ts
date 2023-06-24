import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { CommonService } from '../CommonService';
import { ProductResponse } from '../../model/ProductResponse';
import { CustomerResponse } from '../../model/CustomerResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

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

  async getProducts(endpoint:string,pager:any):Promise<Observable<ProductResponse>>{
    const httpOptions = await this.service.getHttpOptions();
    debugger
    return this.http.get<ProductResponse>(environment.baseUrl + endpoint + '?pageNumber=' + pager.pageIndex + '&pageSize=' + pager.pageSize, httpOptions).pipe(
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
