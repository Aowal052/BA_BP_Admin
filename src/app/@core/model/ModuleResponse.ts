export class ModuleResponse{
  statusCode?:number;
  Message?:string;
  totalCount:number = 0;
  $expandConfig:any;
  data:Module[] = [];
}

export interface Module {
  id?:number;
  Icon?:string;
  Name?:string;
}