export class UserResponse{
    statusCode?:number;
    Message?:string;
    totalCount:number = 0;
    $expandConfig:any;
    data:Users[] = [];
}

export interface Users {
    id:number;
    userId:string;
    firstName:string;
    lastName:string;
  }