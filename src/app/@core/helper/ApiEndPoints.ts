export class ApiEndPoints{
    static readonly Login: string = 'v1/Accounts/Login';
    static readonly GetUser: string = 'v1/Accounts/Get';
    //#region customer
    static readonly CreateCustomer: string = 'Customer/Create';
    static readonly UpdateCustomer: string = 'Customer/Update';
    static readonly DeleteCustomer: string = 'Customer/Delete';
    static readonly GetCustomers: string = 'Customer/Get';
    static readonly GetCustomerById: string = 'Customer/GetById';
    //#endregion
    
    //#region Sub Customer
    static readonly CreateSubCustomer: string = 'SubCustomer/Create';
    static readonly UpdateSubCustomer: string = 'SubCustomer/Update';
    static readonly DeleteSubCustomer: string = 'SubCustomer/Delete';
    static readonly GetSubCustomers: string = 'SubCustomer/Get';
    static readonly GetSubCustomerById: string = 'SubCustomer/GetById';
    //#endregion
    static readonly GetCategory: string = 'ProductCategory/Get';
    static readonly GetSalesReport: string = 'SalesOrder/Get';
    static readonly GetCategoryDroppdown: string = 'ProductCategory/GetForDropdown';
    static readonly GetForPagination: string = 'ProductCategory/GetForPagination';
    static readonly GetSubCategory: string = 'ProductSubCategory/GetSubCatery';
    static readonly UpdateSubCategory: string = 'ProductSubCategory/Update';
    static readonly DeleteSubCategory: string = 'ProductSubCategory/Delete';
    static readonly GetCategoryById: string = 'ProductCategory/GetById';
    static readonly UpdateCategory: string = 'ProductCategory/Update';
    static readonly AddProduct: string = 'v1/Product/Create';
    static readonly CreateSales:string = 'SalesOrder/Create';
    static readonly UpdateSales:string = 'SalesOrder/Update';
    static readonly UpdateStatusAsync:string = 'v1/CRM/UpdateStatusAsync';
    static readonly GetProducts: string = 'v1/Product/GetForPagination';
    static readonly GetProductForDropdown: string = 'v1/Product/GetForDropdown';
    static readonly GetCustomerFoDropdown: string = 'Customer/GetForDropdown';
    static readonly GetSuCustomerFoDropdown: string = 'Customer/GetSubCustomerForDropdown';
    static readonly DeleteProducts: string = 'v1/Product/Delete';
    static readonly UpdateProduct: string = 'v1/Product/Update';
    static readonly UpdateProductPrice: string = 'v1/Product/UpdatePrice';
    static readonly GetProductById: string = 'v1/Product/GetById'
    static readonly AddCategory: string = 'ProductCategory/Create';
    static readonly AddSubCategory: string = 'ProductSubCategory/Create';
    static readonly AddOrder: string = 'SalesOrder/Create';
    static readonly GetOrders: string = 'SalesOrder/Get';
    static readonly GetOrderDetailById: string = 'SalesOrder/GetOrderDetailById';
    static readonly GetDetailByIdForChallan: string = 'v1/CRM/GetDetailsByIdForChallanAsync';
    static readonly DeleteMasterDetailById: string = 'SalesOrder/DeleteMasterDetailById';
    static readonly GetOrderMasterById: string = 'SalesOrder/GetOrderMasterById';
    static readonly DeleteCategory: string = 'ProductCategory/Delete';

    static readonly GetSalesInvoiceById: string = 'SalesInvoice/GetById';


    static readonly AddDeliveryChallan:string = 'v1/CRM/ChallanCreate';
    static readonly GetChallanMasterList:string = 'v1/CRM/GetChallanMasterAsync';
    static readonly GetChallanDetailsList:string = 'v1/CRM/GetChallanDetailsById';
    static readonly GetApprovedSalesOrder:string = 'v1/CRM/GetApprovedSalesOrder';
    static readonly GetInvoiceMaster:string = 'v1/CRM/GetInvoiceMaster';
    static readonly GetInvoiceDetails:string = 'v1/CRM/GetInvoiceDetails';
    static readonly GetVehicleDropdown:string = 'v1/CRM/GetVehicles';
    static readonly GetDiscountByInvoiceId:string = 'v1/CRM/GetDiscountByInvoiceId';
    static readonly GetChallanListGatePass:string = 'v1/CRM/GetGatePassInfo';
    static readonly CreateGatePass:string = 'v1/CRM/CreateGatePass';
    static readonly GetDiscountList:string = 'Discount/Get';
    static readonly GetBranchList:string = 'Branch/GetForDropdown';

    static readonly GetInvoiceMasterCreateById:string = 'v1/CRM/GetInvoiceMasterInfo';
    static readonly GetInvoiceDetailCreateById:string = 'v1/CRM/GetInvoiceDetailsInfo';
    static readonly CreateInvoice:string = 'v1/CRM/InvoiceCreate';

    // Additional static messages can be added here

    // Private constructor to prevent instantiation
    private constructor() {}
}