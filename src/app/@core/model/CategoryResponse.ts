export class CategoryResponse{
    statusCode?: number;
    Message?: string;
    Data?: Category[];
}

export class Category{
    name?:string;
    id?:number;
}