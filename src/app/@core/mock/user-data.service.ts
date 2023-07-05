import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { Article, Project, User, UserData } from '../data/userData';
import { OrderResponse } from '../model/OrderResponse';
import { CommonService } from '../services/CommonService';
import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CustomerResponse } from '../model/CustomerResponse';
import { ApiEndPoints } from '../helper/ApiEndPoints';

@Injectable({
  providedIn: 'root',
})
export class UserDataService extends UserData {
  
  user!:User;
  project!:Project[];
  constructor(
    private http:HttpClient,
    private router:Router,
    private service:CommonService) {
    super();
  }

  getToken() {
    return sessionStorage.getItem("key");
  }

  
   httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + this.getToken() // Adding the bearer token here
    })
  };


  getUser(): Observable<User> {
    return observableOf(this.user);
  }

  async getArticles(endpoint:string,pager:any): Promise<Observable<any>> {
    const httpOptions = await this.service.getHttpOptions();
    return this.http.get<OrderResponse>(environment.baseUrl + endpoint + '?pageNumber=' + pager.pageIndex + '&pageSize=' + pager.pageSize, httpOptions).pipe(
      catchError((error) => {
        debugger
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }
  async getSalesReport(endpoint:string,pager:any):Promise<Observable<OrderResponse>>{
    const httpOptions = await this.service.getHttpOptions();
    return this.http.get<OrderResponse>(environment.baseUrl + endpoint + '?pageNumber=' + pager.pageIndex + '&pageSize=' + pager.pageSize, httpOptions).pipe(
      catchError((error) => {
        debugger
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }

  // getSalesReport(endpoint:string): Observable<any> {
  //   return observableOf(this.articles).pipe(delay(300));
  // }

  getProjects(): Observable<any> {
    return observableOf(this.project).pipe(delay(300));
  }
}
