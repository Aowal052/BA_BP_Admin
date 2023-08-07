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
  async convertNumberToText(number: number): Promise<string> {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion'];

    function convertChunk(num: number, units: string[], teens: string[], tens: string[]): string {
      if (num === 0) return '';

      if (num < 10) return units[num];
      if (num < 20) return teens[num - 10];

      const tensDigit = Math.floor(num / 10) % 10;
      const unitsDigit = num % 10;

      if (tensDigit === 0) {
        return units[unitsDigit];
      }

      return (tensDigit === 0 ? '' : tens[tensDigit] + ' ') + units[unitsDigit];
    }

    if (number === 0) return 'Zero';

    let text = '';
    let chunkIndex = 0;

  let integerPart = Math.floor(number);
  const decimalPart = Math.round((number - integerPart) * 100); // Convert decimal part to poisa

  while (integerPart > 0) {
    const chunk = integerPart % 1000;
    if (chunk > 0) {
      if (chunkIndex > 0) {
        text = convertChunk(chunk, units, teens, tens) + ' ' + thousands[chunkIndex] + ' ' + text;
      } else {
        text = convertChunk(chunk, units, teens, tens);
      }
    }
    integerPart = Math.floor(integerPart / 1000);
    chunkIndex++;
  }

  if (text.length === 0) {
    text = 'Zero';
  }

  if (decimalPart > 0) {
    text += ' and ' + (decimalPart < 10 ? 'Zero ' : '') + convertChunk(decimalPart, units, teens, tens) + ' Poisa';
  }

  return text.trim() + ' Taka';
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
