import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../CommonService';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerResponse } from '../../model/CustomerResponse';
import { MenuResponse } from '../../model/MenuResponse';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

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
    async getParentMenu(endpoint:string):Promise<Observable<MenuResponse>>{
      const httpOptions = await this.service.getHttpOptions();
      debugger
      return this.http.get<MenuResponse>(environment.baseUrl + endpoint , httpOptions).pipe(
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
