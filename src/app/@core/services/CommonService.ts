import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Dictionary<T> {
  [key: number]: T;
}
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
  ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  hundreds = ['', 'Hundred', 'Thousand', 'Lak', 'Core'];

  convertToBDTkFormatAmt(ConAmt: string): string {
    if (!ConAmt || ConAmt.trim() === '') {
      return '';
    }

    const GetAmt: number = this.getNumbers(ConAmt);
    const Minus: string = (GetAmt < 0) ? '-' : '';
    const TmpAmt: string[] = Math.round(Math.abs(GetAmt)).toString().split('.');
    let MainAmt: string = TmpAmt[0];
    const Points: string = (TmpAmt.length > 1) ? '.' + TmpAmt[1] : '';
    let StrMoney: string = '';

    while (MainAmt.length > 0) {
      if (MainAmt.length < 4) {
        StrMoney = (StrMoney === '') ? MainAmt : MainAmt + ',' + StrMoney;
        MainAmt = '';
      } else {
        StrMoney = (StrMoney === '') ? MainAmt.substring(MainAmt.length - 3, 3) : MainAmt.substring(MainAmt.length - 3, 3) + ',' + StrMoney;
        MainAmt = MainAmt.substring(0, MainAmt.length - 3);

        if (MainAmt.length < 3) {
          StrMoney = MainAmt + ',' + StrMoney;
          MainAmt = '';
        } else {
          StrMoney = MainAmt.substring(MainAmt.length - 2, 2) + ',' + StrMoney;
          MainAmt = MainAmt.substring(0, MainAmt.length - 2);

          if (MainAmt.length < 3) {
            StrMoney = MainAmt + ',' + StrMoney;
            MainAmt = '';
          } else {
            StrMoney = MainAmt.substring(MainAmt.length - 2, 2) + ',' + StrMoney;
            MainAmt = MainAmt.substring(0, MainAmt.length - 2);
          }
        }
      }
    }

    ConAmt = Minus + StrMoney + Points;

    return ConAmt;
  }
  private getNumbers(value: string): number {
    const numValue = parseFloat(value.replace(/,/g, ''));
    return isNaN(numValue) ? 0 : numValue;
  }
  convertToBDTkFormatWord(ConAmt: string, UpCase: string): string {
    const ones = this.ones;
    const tens = this.tens;
    const hundreds = this.hundreds;

    if (!ConAmt || ConAmt.trim() === '') {
      return '';
    }

    let Points = '';
    let StrMoney = '';
    const Minus = (parseFloat(ConAmt) < 0) ? 'Negative ' : '';

    const TmpAmt = this.convertToBDTkFormatAmt(ConAmt).split('.');
    StrMoney = Math.abs(parseFloat(TmpAmt[0])).toString();
    Points = (TmpAmt.length > 1) ? TmpAmt[1] : '';

    const TmpAmt2 = StrMoney.split(',').reverse();
    let Count = 1;
    ConAmt = '';

    for (const Amt of TmpAmt2) {
      StrMoney = '';
      if (parseInt(Amt) < 20) {
        StrMoney = (parseInt(Amt) > 0) ? ones[parseInt(Amt)] : '';
      } else if (parseInt(Amt) < 100) {
        if (parseInt(Amt.substring(0, 1)) > 0) {
          StrMoney = tens[parseInt(Amt.substring(0, 1))];
        }
        if (parseInt(Amt.substring(1, 1)) > 0) {
          StrMoney = StrMoney + (StrMoney === '' ? '' : ' ') + ones[parseInt(Amt.substring(1, 1))];
        }
      } else {
        if (parseInt(Amt.substring(0, 1)) > 0) {
          StrMoney = tens[parseInt(Amt.substring(0, 1))] + ' ' + hundreds[1];
        }
        if (parseInt(Amt.substring(1, 1)) > 0) {
          StrMoney = StrMoney + (StrMoney === '' ? '' : ' ') + tens[parseInt(Amt.substring(1, 1))];
        }
        if (parseInt(Amt.substring(2, 1)) > 0) {
          StrMoney = StrMoney + (StrMoney === '' ? '' : ' ') + ones[parseInt(Amt.substring(2, 1))];
        }
      }

      if (Count > 1) {
        StrMoney = StrMoney === '' ? '' : StrMoney + ' ' + hundreds[Count];
      }

      Count++;
      if (Count > 4) {
        Count = 2;
      }
      ConAmt = StrMoney + (ConAmt === '' ? '' : ' ') + ConAmt;
    }

    if (ConAmt !== '') {
      ConAmt = ConAmt + ' Taka';
    }

    if (Points !== '' && parseInt(Points) > 0) {
      StrMoney = '';
      if (Points.length === 1) {
        StrMoney = tens[parseInt(Points)];
      } else {
        if (parseInt(Points.substring(0, 1)) > 1) {
          StrMoney = tens[parseInt(Points.substring(0, 1))];
          if (parseInt(Points.substring(1, 1)) > 0) {
            StrMoney = StrMoney + (StrMoney === '' ? '' : ' ') + ones[parseInt(Points.substring(1, 1))];
          }
        } else if (parseInt(Points.substring(0, 1)) > 0) {
          StrMoney = ones[parseInt(Points)];
        }
        ConAmt = ConAmt + ' And ' + StrMoney + ' Poisa';
      }
    }

    if (ConAmt !== '') {
      ConAmt = ConAmt + ' Only.';
    }

    if (ConAmt !== '' && UpCase !== '') {
      if (UpCase === 'Up') {
        ConAmt = ConAmt.toUpperCase();
      } else if (UpCase === 'Lo') {
        ConAmt = ConAmt.toLowerCase();
      } else {
        ConAmt = ConAmt.charAt(0).toUpperCase() + ConAmt.slice(1).toLowerCase();
      }
    }

    return ConAmt;
  }

  public rkBDTkFormatWord(ConAmt: string = '', UpCase: string = ''): string {
    const ones: Dictionary<string> = {
      1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten', 11: 'Eleven',
      12: 'Twelve', 13: 'Thirteen', 14: 'Fourteen', 15: 'Fifteen', 16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen', 19: 'Nineteen'
    };
    const tens: Dictionary<string> = {
      1: 'Ten',2: 'Twenty', 3: 'Thirty', 4: 'Forty', 5: 'Fifty', 6: 'Sixty', 7: 'Seventy', 8: 'Eighty', 9: 'Ninety'
    };
    const hundreds: Dictionary<string> = {
      1: 'Hundred', 2: 'Thousand', 3: 'Lak', 4: 'Core'
    };
    
    if (!ConAmt) {
      return '';
    }
    
    let Points = '';
    let StrMoney = '';
    const Minus = (parseFloat(ConAmt) < 0) ? 'Negative ' : '';
    
    const TmpAmt = this.rkBDTkFormatAmt(ConAmt).split('.');
    StrMoney = TmpAmt[0].toString();
    Points = (TmpAmt.length > 1) ? TmpAmt[1] : '';
    
    const TmpAmtArray = StrMoney.split(',').reverse();
    let Count = 1;
    ConAmt = '';
    
    TmpAmtArray.forEach((Amt) => {
      StrMoney = '';
    
      if (parseInt(Amt) < 20) {
        StrMoney = (parseInt(Amt) > 0) ? ones[parseInt(Amt)] : '';
      } else if (parseInt(Amt) < 100) {
        if (parseInt(Amt.charAt(0)) > 0) {
          StrMoney = tens[parseInt(Amt.charAt(0))];
        }
        if (parseInt(Amt.charAt(1)) > 0) {
          StrMoney = StrMoney + (StrMoney ? ' ' : '') + ones[parseInt(Amt.charAt(1))];
        }
      } else if (parseInt(Amt) < 1000) {
        if (parseInt(Amt.charAt(0)) > 0) {
          StrMoney = ones[parseInt(Amt.charAt(0))] + ' ' + hundreds[1];
        }
        // if (parseInt(Amt.charAt(1)) > 0) {
        //   StrMoney = StrMoney + (StrMoney ? ' ' : '') + tens[parseInt(Amt.charAt(1))];
        // }
        if (parseInt(Amt.charAt(2)) > 0 && parseInt(Amt.charAt(1)) !== 1) {
          StrMoney = StrMoney + (StrMoney ? ' ' : '') + ones[parseInt(Amt.charAt(2))];
        } else if (parseInt(Amt.charAt(1)) === 1) {
          StrMoney = StrMoney + (StrMoney ? ' ' : '') + ones[parseInt(Amt.substring(1, 3))];
        }
      } else {
        const thousands = Amt.substring(0, Amt.length - 3);
        const hundredsPart = Amt.substring(Amt.length - 3);
        StrMoney = ones[parseInt(thousands)] + ' ' + hundreds[2];
        
        if (parseInt(hundredsPart) < 20) {
          StrMoney += (parseInt(hundredsPart) > 0) ? ' ' + ones[parseInt(hundredsPart)] : '';
        } else {
          if (parseInt(hundredsPart.charAt(0)) > 0) {
            StrMoney += ' ' + tens[parseInt(hundredsPart.charAt(0))];
          }
          if (parseInt(hundredsPart.charAt(1)) > 0) {
            StrMoney += (StrMoney ? ' ' : '') + ones[parseInt(hundredsPart.charAt(1))];
          }
          if (parseInt(hundredsPart.charAt(2)) > 0) {
            StrMoney += (StrMoney ? ' ' : '') + ones[parseInt(hundredsPart.charAt(2))];
          }
        }
      }
    
      if (Count > 1) {
        StrMoney = StrMoney ? StrMoney + ' ' + hundreds[Count] : '';
      }
    
      Count++;
      if (Count > 4) {
        Count = 2;
      }
      ConAmt = StrMoney + (ConAmt ? ' ' : '') + ConAmt;
    });
    
    if (ConAmt) {
      ConAmt = ConAmt + ' Taka';
    }
    
    if (Points && parseInt(Points) > 0) {
      StrMoney = '';
    
      if (Points.length === 1) {
        StrMoney = tens[parseInt(Points)];
      } else {
        if (parseInt(Points.charAt(0)) > 1) {
          StrMoney = tens[parseInt(Points.charAt(0))];
          if (parseInt(Points.charAt(1)) > 0) {
            StrMoney = StrMoney + (StrMoney ? ' ' : '') + ones[parseInt(Points.charAt(1))];
          }
        } else if (parseInt(Points.charAt(0)) > 0) {
          StrMoney = ones[parseInt(Points.charAt(0))];
        }
        ConAmt = ConAmt + ' And ' + StrMoney + ' Paisa';
      }
    }
    
    if (ConAmt) {
      ConAmt = ConAmt + ' Only.';
    }
    
    if (ConAmt && UpCase) {
      if (UpCase === 'Up') {
        ConAmt = ConAmt.toUpperCase();
      } else if (UpCase === 'Lo') {
        ConAmt = ConAmt.toLowerCase();
      } else {
        ConAmt = ConAmt.charAt(0).toUpperCase() + ConAmt.substring(1).toLowerCase();
      }
    }
    
    return ConAmt;
  }
  public rkBDTkFormatAmt(ConAmt: string = ''): string {
    if (!ConAmt) {
      return '';
    }

    const GetAmt: number = this.getNumbers(ConAmt);
    const Minus: string = (GetAmt < 0) ? '-' : '';
    const TmpAmt: string[] = Math.abs(GetAmt).toFixed(2).split('.');
    let MainAmt: string = TmpAmt[0];
    const Points: string = (TmpAmt.length > 1) ? '.' + TmpAmt[1] : '';
    let StrMoney: string = '';

    while (MainAmt.length > 0) {
      if (MainAmt.length < 4) {
        StrMoney = StrMoney ? MainAmt + ',' + StrMoney : MainAmt;
        MainAmt = '';
      } else {
        StrMoney = StrMoney ? MainAmt.substring(MainAmt.length - 3, MainAmt.length) + ',' + StrMoney : MainAmt.substring(MainAmt.length - 3, MainAmt.length);
        MainAmt = MainAmt.substring(0, MainAmt.length - 3);

        if (MainAmt.length < 3) {
          StrMoney = MainAmt + ',' + StrMoney;
          MainAmt = '';
        } else {
          StrMoney = StrMoney ? MainAmt.substring(MainAmt.length - 2, MainAmt.length) + ',' + StrMoney : MainAmt.substring(MainAmt.length - 2, MainAmt.length);
          MainAmt = MainAmt.substring(0, MainAmt.length - 2);

          if (MainAmt.length < 3) {
            StrMoney = MainAmt + ',' + StrMoney;
            MainAmt = '';
          } else {
            StrMoney = StrMoney ? MainAmt.substring(MainAmt.length - 2, MainAmt.length) + ',' + StrMoney : MainAmt.substring(MainAmt.length - 2, MainAmt.length);
            MainAmt = MainAmt.substring(0, MainAmt.length - 2);
          }
        }
      }
    }

    ConAmt = Minus + StrMoney + Points;

    return ConAmt;
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
