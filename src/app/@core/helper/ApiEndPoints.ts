export class ApiEndPoints{
    static readonly Login: string = 'v1/Accounts/Login';
    static readonly GetCategory: string = 'ProductCategory/Get';
    static readonly GetCategoryDroppdown: string = 'ProductCategory/GetForDropdown';
    static readonly GetForPagination: string = 'ProductCategory/GetForPagination';
    static readonly GetCategoryById: string = 'ProductCategory/GetById';
    static readonly UpdateCategory: string = 'ProductCategory/Update';
    static readonly AddProduct: string = 'v1/Product/Create';
    static readonly CreateSales:string = 'SalesOrder/Create';
    static readonly GetProducts: string = 'v1/Product/GetForPagination';
    static readonly GetProductForDropdown: string = 'v1/Product/GetForDropdown';
    static readonly GetCustomerFoDropdown: string = 'Customer/GetForDropdown';
    static readonly DeleteProducts: string = 'v1/Product/Delete';
    static readonly UpdateProduct: string = 'v1/Product/Update';
    static readonly GetProductById: string = 'v1/Product/GetById'
    static readonly AddCategory: string = 'ProductCategory/Create';
    static readonly AddOrder: string = 'SalesOrder/Create';
    static readonly GetOrders: string = 'SalesOrder/Get';
    static readonly DeleteCategory: string = 'ProductCategory/Delete';
    // Additional static messages can be added here

    // Private constructor to prevent instantiation
    private constructor() {}
}