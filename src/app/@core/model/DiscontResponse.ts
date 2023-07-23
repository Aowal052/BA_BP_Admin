
export class DiscountResponse{
    statusCode?:number;
    Message?:string;
    totalCount:number = 0;
    $expandConfig:any;
    data:Discount[] = [];
}

 
export interface Discount {
    id?:number;
    discountName?:string;
    discountType?:string;
    discountAmnt?:number;
  }