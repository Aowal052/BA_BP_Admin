export class ApiEndPoints{
    static readonly Login: string = 'v1/Accounts/Login';
    static readonly GetUser: string = 'v1/Accounts/Get';
    static readonly CreateCustomer: string = 'Customer/Create';
    static readonly UpdateCustomer: string = 'Customer/Update';
    static readonly DeleteCustomer: string = 'Customer/Delete';
    static readonly GetCustomers: string = 'Customer/Get';
    static readonly GetCustomerById: string = 'Customer/GetById';
    static readonly GetCategory: string = 'ProductCategory/Get';
    static readonly GetSalesReport: string = 'SalesOrder/Get';
    static readonly GetCategoryDroppdown: string = 'ProductCategory/GetForDropdown';
    static readonly GetForPagination: string = 'ProductCategory/GetForPagination';
    static readonly GetCategoryById: string = 'ProductCategory/GetById';
    static readonly UpdateCategory: string = 'ProductCategory/Update';
    static readonly AddProduct: string = 'v1/Product/Create';
    static readonly CreateSales:string = 'SalesOrder/Create';
    static readonly UpdateSales:string = 'SalesOrder/Update';
    static readonly UpdateStatusAsync:string = 'v1/Approve/UpdateStatusAsync';
    static readonly GetProducts: string = 'v1/Product/GetForPagination';
    static readonly GetProductForDropdown: string = 'v1/Product/GetForDropdown';
    static readonly GetCustomerFoDropdown: string = 'Customer/GetForDropdown';
    static readonly DeleteProducts: string = 'v1/Product/Delete';
    static readonly UpdateProduct: string = 'v1/Product/Update';
    static readonly GetProductById: string = 'v1/Product/GetById'
    static readonly AddCategory: string = 'ProductCategory/Create';
    static readonly AddOrder: string = 'SalesOrder/Create';
    static readonly GetOrders: string = 'SalesOrder/Get';
    static readonly GetOrderDetailById: string = 'SalesOrder/GetOrderDetailById';
    static readonly DeleteMasterDetailById: string = 'SalesOrder/DeleteMasterDetailById';
    static readonly GetOrderMasterById: string = 'SalesOrder/GetOrderMasterById';
    static readonly DeleteCategory: string = 'ProductCategory/Delete';

    static readonly GetSalesInvoiceById: string = 'SalesInvoice/GetById';

    static readonly AddDeliveryChallan:string = 'SalesOrder/ChallanCreate';
    // Additional static messages can be added here

    // Private constructor to prevent instantiation
    private constructor() {}
}