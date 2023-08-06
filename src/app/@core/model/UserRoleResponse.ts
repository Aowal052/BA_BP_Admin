export class UserRoleResponse{
    statusCode?:number;
    Message?:string;
    totalCount:number = 0;
    $expandConfig:any;
    data:UserRoles[] = [];
}

export interface UserRoles {
    id:number;
    roleName:string;
  }