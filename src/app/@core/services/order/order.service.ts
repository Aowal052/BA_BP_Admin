import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { OrderResponse } from '../../model/OrderResponse';
import { CommonService } from '../CommonService';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http:HttpClient,
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
  async UpdateStatus(endpoint:string,param:any):Promise<Observable<OrderResponse>>{
    const httpOptions = await this.service.getHttpOptions();
    return this.http.post<OrderResponse>(environment.baseUrl + endpoint,param, httpOptions).pipe(
      catchError((error) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }
  async createOrder(endpoint:string,param:any):Promise<Observable<OrderResponse>>{
    const httpOptions = await this.service.getHttpOptions();
    return this.http.post<OrderResponse>(environment.baseUrl + endpoint,param, httpOptions).pipe(
      catchError((error) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }
  async getSalesOrders(endpoint:string,param:any): Promise<Observable<any>> {
    const httpOptions = await this.service.getHttpOptions();
    return this.http.post<OrderResponse>(environment.baseUrl + endpoint,param, httpOptions).pipe(
      catchError((error) => {
        debugger
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }
  async getOrderDetails(endpoint:string,id:number): Promise<Observable<OrderResponse>> {
    const httpOptions = await this.service.getHttpOptions();
    return this.http.get<OrderResponse>(environment.baseUrl + endpoint + '?id=' + id, httpOptions).pipe(
      catchError((error) => {
        debugger
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }
  async getOrderMasterInfoById(endpoint:string,id:number): Promise<Observable<OrderResponse>> {
    const httpOptions = await this.service.getHttpOptions();
    return this.http.get<OrderResponse>(environment.baseUrl + endpoint + '?id=' + id, httpOptions).pipe(
      catchError((error) => {
        debugger
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }
  async GetOrderMasterById(endpoint:string,id:number): Promise<Observable<OrderResponse>> {
    const httpOptions = await this.service.getHttpOptions();
    return this.http.get<OrderResponse>(environment.baseUrl + endpoint + '?id=' + id, httpOptions).pipe(
      catchError((error) => {
        debugger
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }
  async deleteMasterDetailById(endpoint:string,id:number): Promise<Observable<OrderResponse>> {
    const httpOptions = await this.service.getHttpOptions();
    return this.http.get<OrderResponse>(environment.baseUrl + endpoint + '?id=' + id, httpOptions).pipe(
      catchError((error) => {
        debugger
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }
}
