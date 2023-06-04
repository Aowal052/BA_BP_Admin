import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { CommonService } from '../CommonService';
import { ProductResponse } from '../../model/ProductResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http:HttpClient,
    private router:Router,
    private service:CommonService) { }
  apiurl = 'https://localhost:7143/api/';

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
    return this.http.get<ProductResponse>(this.apiurl + endpoint + '?pageNumber=' + pager.pageIndex + '&pageSize=' + pager.pageSize, httpOptions).pipe(
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
    return this.http.get<ProductResponse>(this.apiurl + endpoint + '?id=' + id, httpOptions).pipe(
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
    return this.http.post<ProductResponse>(this.apiurl + endpoint,param, httpOptions).pipe(
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
    return this.http.post<ProductResponse>(this.apiurl + endpoint,param, httpOptions).pipe(
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
    return this.http.get<ProductResponse>(this.apiurl + endpoint+ '?id=' + id, httpOptions).pipe(
      catchError((error) => {
        // if (error.status === HttpStatusCode.Unauthorized) {
        //   this.router.navigate(['login']);
        // }
        return throwError(error);
      })
    );
  }
  
}
