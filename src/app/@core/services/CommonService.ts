import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private headingSubject = new BehaviorSubject<string>('');

  setHeading(heading: string): void {
    this.headingSubject.next(heading);
  }

  getHeading(): BehaviorSubject<string> {
    return this.headingSubject;
  }

  async getHttpOptions() {
    const token = sessionStorage.getItem("id_token");
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token
    });
    return { headers: headers };
  }

}
