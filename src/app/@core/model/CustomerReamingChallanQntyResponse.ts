export class CustomerReamingChallanQntyResponse{
    statusCode?:number;
    Message?:string;
    totalCount:number = 0;
    $expandConfig:any;
    data:CustomerReamingChallanQnty[] = [];
}

export interface CustomerReamingChallanQnty {
    id:number;
    salesOrderMasterId:number
    orderNo:string;
    customerId:number;
    customerName:string;
    productId:number;
    productName:string;
    unitId:number;
    unitName:string;
    unitPrice:number;
    quantity:number;
    deliveryQuantity: number;
    reamingQuantity:number;
  }