
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
    shortName?:string;
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
    shortName?:string;
    piecePrice:string;
    dozenPrice:string;
    defaultPrice?:string;
    description?:string;
    reamingOpeningQuantity:string;
    showDescriptionInPurchase?:boolean;
    showDescriptionInSales?:boolean;
    categoryId?:string;
    activeUnitId?:number;
    subCategory?:string;
    $expandConfig?: any;
  }