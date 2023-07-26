export class CategoryResponse{
    statusCode?: number;
    Message?: string;
    data?: Category[];
    totalCount!:number;
}

export class Category{
    name?:string;
    id?:number;
}
export interface Category {
    name?:string;
    id?:number;
  }