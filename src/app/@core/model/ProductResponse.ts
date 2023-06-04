
export class ProductResponse{
    statusCode?:number;
    Message?:string;
    totalCount:number = 0;
    $expandConfig:any;
    data:Product[] = [];
}

export class Products{
    id?:number;
    productCode?:string;
    productName?:string;
    defaultPrice?:string;
    description?:string;
    showDescriptionInPurchase:boolean = false;
    showDescriptionInSales:boolean = false;
    categoryId?:string;
    brand?:string;
    subCategory?:string;
    $expandConfig?: any;
}

export interface Product {
    id?:number;
    productCode?:string;
    productName?:string;
    defaultPrice?:string;
    description?:string;
    showDescriptionInPurchase?:boolean;
    showDescriptionInSales?:boolean;
    categoryId?:string;
    brand?:string;
    subCategory?:string;
    $expandConfig?: any;
  }