export class VehicleResponse{
    statusCode?:number;
    Message?:string;
    totalCount:number = 0;
    $expandConfig:any;
    data:any[] = [];
}


export interface Vehicle {
    id?:number;
    vehicleNo?:string;
    driverLicenseNo?:string;
    driverPhone?:string;
    driverName?:string;
    
  }
