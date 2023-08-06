import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
   dateFormate: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
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

  async dateConvertion(dateString:string){
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    return formattedDate;
  }

  async getHttpOptions() {
    const token = localStorage.getItem("id_token");
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
  async createFormData(arrayData: any[]): Promise<FormData> {
    const formData = new FormData();
  
    // Check if arrayData is an array
    if (Array.isArray(arrayData)) {
      // Append the array data to the FormData
      arrayData.forEach(async (item: any, index: number) => {
        const itemKey = `arrayData[${index}]`;
        const convertedItem = await this.convertObjectKeysToCamelCase(item);
  
        for (const key in convertedItem) {
          const value = convertedItem[key];
          const fieldKey = `${itemKey}.${key}`;
  
          formData.append(fieldKey, value);
        }
      });
    }
  
    return formData;
  }
  async arrayToFormData(array:any) {
    const formData = new FormData();
    
    for (let key in array) {
      if (array.hasOwnProperty(key)) {
        formData.append(key, array[key]);
      }
    }
    
    return formData;
  }
  async createFormDataObj(arrayData: any): Promise<FormData> {
    const formData = new FormData();
  
    // Check if arrayData is an array
    if (Array.isArray(arrayData)) {
      // Append the array data to the FormData
      arrayData.forEach(async (item: any, index: number) => {
        const itemKey = `arrayData[${index}]`;
        const convertedItem = await this.convertObjectKeysToCamelCase(item);
  
        for (const key in convertedItem) {
          const value = convertedItem[key];
          const fieldKey = `${itemKey}.${key}`;
  
          formData.append(fieldKey, value);
        }
      });
    }
  
    return formData;
  }
  async convertObjectKeysToCamelCase(obj: any): Promise<any> {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(this.convertObjectKeysToCamelCase);
    }

    const camelCaseObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        camelCaseObj[camelCaseKey] = this.convertObjectKeysToCamelCase(value);
      }
    }

    return camelCaseObj;
  }

}
