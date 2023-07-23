export class BranchResponse{
    statusCode?:number;
    Message?:string;
    totalCount:number = 0;
    $expandConfig:any;
    data:Branch[] = [];
}

export interface Branch {
    id?:number;
    branchName?:string;
    branchAddresss?:string;
    userId?:number;
    
  }