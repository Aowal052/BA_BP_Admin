export class MenuResponse{
    statusCode?:number;
    Message?:string;
    totalCount:number = 0;
    $expandConfig:any;
    data:Menu[] = [];
  }
  
  export interface Menu {
    id?:number;
    moduleId?: number;
    icon?:string;
    title?:string;
    link?:string;
    parentMenuId?: number;
  }