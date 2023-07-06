import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  SaleAmountOfferOptions = [
    { id: '1', name: 'Sales Offer', min: 50000, max:99999, disc:1 },
    { id: '2', name: 'Sales Offer' , min: 100000, max:199999, disc:2 },
    { id: '3', name: 'Sales Offer' , min: 200000, max:399999, disc:3  },
    { id: '4', name: 'Sales Offer' , min: 400000, max:599999, disc:4  },
    { id: '5', name: 'Sales Offer' , min: 600000, max:699999, disc:5  },
    { id: '6', name: 'Sales Offer' , min: 700000, max:99999999, disc:6  },
  ];
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

  getDiscountByParcent(amount: number): number {
    // Find the matching offer based on the given amount
    const offer = this.SaleAmountOfferOptions.find(option => amount >= option.min && amount <= option.max);
    
    // Return the discount value if an offer is found, otherwise return 0
    return offer ? offer.disc : 0;
  }

}
