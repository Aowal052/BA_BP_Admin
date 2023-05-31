export class CategoryResponse{
    StatusCode?: number;
    Message?: string;
    Data?: Category[];
}

export class Category{
    name?:string;
    id?:number;
}