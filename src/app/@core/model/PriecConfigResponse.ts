export class PriecConfigResponse{
    statusCode?:number;
    Message?:string;
    totalCount:number = 0;
    $expandConfig:any;
    data:PriecConfig[] = [];
}

export interface PriecConfig {
    id?:number;
    ProductId:number;
    UnitId:number;
    unitPrice:number;
    FromQuantity?:number;
    ToQuantity?:number;
  }