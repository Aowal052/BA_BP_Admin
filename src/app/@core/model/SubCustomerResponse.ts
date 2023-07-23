export class SubCustomerResponse{
    statusCode?:number;
    Message?:string;
    totalCount:number = 0;
    $expandConfig:any;
    data:SubCustomer[] = [];
}

export interface SubCustomer {
    id?:number;
    customerId?:number;
    customerName?:string;
    subCustomeraddress?:string;
    subCustomerbillingAddress?:string;
    subCustomerdeliveryAddress?:string;
    subCustomerbinNo?:string;
    subCustomercontactPerson?:boolean;
    subCustomercpDesignation?:string;
    subCustomercpDepartment?:string;
    subCustomercpMobile?:string;
    subCustomercreditLimit?: number;
    subCustomercreditBalance?: number;
    subCustomerdefaultDiscount:number;
  }