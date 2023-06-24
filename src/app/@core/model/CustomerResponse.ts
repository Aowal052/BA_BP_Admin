export class CustomerResponse{
    statusCode?:number;
    Message?:string;
    totalCount:number = 0;
    $expandConfig:any;
    data:Customer[] = [];
}

export interface Customer {
    id?:number;
    customerName?:string;
    address?:string;
    billingAddress?:string;
    deliveryAddress?:string;
    binNo?:string;
    contactPerson?:boolean;
    cpDesignation?:string;
    cpDepartment?:string;
    cpMobile?:string;
    CreditLimit?: number;
  }