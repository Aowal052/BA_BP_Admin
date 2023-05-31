import { Injectable } from '@angular/core';
import { throwError, of, catchError, Observable } from 'rxjs';
import { User } from 'src/app/@shared/models/user';
import { AuthResponse } from '../model/AuthResponse';
import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiEndPoints } from '../helper/ApiEndPoints';

const USERS = [
  {
    account: 'Admin',
    gender: 'male',
    userName: 'Admin',
    password: 'DevUI.admin',
    phoneNumber: '19999996666',
    email: 'admin@devui.com',
    userId: '100',
  },
  {
    account: 'User',
    gender: 'female',
    userName: 'User',
    password: 'DevUI.user',
    phoneNumber: '19900000000',
    email: 'user@devui.com',
    userId: '200',
  },
  {
    account: 'admin@devui.com',
    gender: 'male',
    userName: 'Admin',
    password: 'devuiadmin',
    phoneNumber: '19988888888',
    email: 'admin@devui.com',
    userId: '300',
  },
];

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http:HttpClient,private router:Router) { }
  apiurl = 'https://localhost:7143/api/';

  getToken() {
    return sessionStorage.getItem("key");
  }

  
   httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + this.getToken() // Adding the bearer token here
    })
  };

  login(param: any, endpoint: string):Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiurl+endpoint,param,this.httpOptions).pipe(
      catchError((error) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          this.router.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }

  logout() {
    sessionStorage.removeItem('id_token');
    sessionStorage.removeItem('expires_at');
    sessionStorage.removeItem('userinfo');
  }

  setSession(userInfo: any) {
    sessionStorage.setItem('id_token', userInfo.token);
    sessionStorage.setItem('userinfo', JSON.stringify(userInfo.user));
    sessionStorage.setItem('expires_at', '120');
  }

  isUserLoggedIn() {
    if (sessionStorage.getItem('userinfo')) {
      return true;
    } else {
      return false;
    }
  }
}
