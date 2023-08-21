export class ApiEndPoints{
    static readonly Login: string = 'v1/Accounts/Login';
    static readonly GetUser: string = 'v1/Accounts/Get';
    static readonly GetUsers: string = 'v1/Accounts/GetUser';
    static readonly CreateUser: string = 'v2/Accounts/register';
    static readonly GetRole: string = 'v1/Accounts/GetRole';
    //#region customer
    static readonly CreateCustomer: string = 'Customer/Create';
    static readonly UpdateCustomer: string = 'Customer/Update';
    static readonly DeleteCustomer: string = 'Customer/Delete';
    static readonly GetCustomers: string = 'Customer/Get';
    static readonly GetCustomerById: string = 'Customer/GetById';
    static readonly GetCustomerDropDown: string = 'Customer/GetForDropdown';
    //#endregion
    
    //#region Sub Customer
    static readonly CreateSubCustomer: string = 'SubCustomer/Create';
    static readonly UpdateSubCustomer: string = 'SubCustomer/Update';
    static readonly DeleteSubCustomer: string = 'SubCustomer/Delete';
    static readonly GetSubCustomers: string = 'SubCustomer/Get';
    static readonly SearchSubCustomer: string = 'SubCustomer/Search';
    static readonly GetSubCustomerById: string = 'SubCustomer/GetById';
    //#endregion

    static readonly GetCategory: string = 'ProductCategory/Get';
    static readonly GetSalesReport: string = 'SalesOrder/Get';
    static readonly GetCategoryDroppdown: string = 'ProductCategory/GetForDropdown';
    static readonly SearchCategory: string = 'ProductCategory/Search';
    static readonly GetForPagination: string = 'ProductCategory/GetForPagination';
    static readonly GetSubCategory: string = 'ProductSubCategory/GetSubCatery';
    static readonly SearchSubCategory: string = 'ProductSubCategory/Search';
    static readonly UpdateSubCategory: string = 'ProductSubCategory/Update';
    static readonly DeleteSubCategory: string = 'ProductSubCategory/Delete';
    static readonly GetCategoryById: string = 'ProductCategory/GetById';
    static readonly UpdateCategory: string = 'ProductCategory/Update';
    static readonly AddProduct: string = 'v1/Product/Create';
    static readonly SearchProduct: string = 'v1/Product/Search';
    static readonly CreateSales:string = 'SalesOrder/Create';
    static readonly CreateQuantityWisePriceConfig:string = 'v1/Config/Create';
    static readonly UpdateSales:string = 'SalesOrder/Update';
    static readonly UpdateStatusAsync:string = 'v1/CRM/UpdateStatusAsync';
    static readonly RevertStatusAsync:string = 'v1/CRM/RevertStatusAsync';
    static readonly GetProducts: string = 'v1/Product/GetForPagination';
    static readonly GetProductForDropdown: string = 'v1/Product/GetForDropdown';
    static readonly GetCustomerFoDropdown: string = 'Customer/GetForDropdown';
    static readonly SearchCustomer: string = 'Customer/Search';
    static readonly GetSuCustomerFoDropdown: string = 'Customer/GetSubCustomerForDropdown';
    static readonly DeleteProducts: string = 'v1/Product/Delete';
    static readonly UpdateProduct: string = 'v1/Product/Update';
    static readonly UpdateProductPrice: string = 'v1/Product/UpdatePrice';
    static readonly GetProductById: string = 'v1/Product/GetById'
    static readonly AddCategory: string = 'ProductCategory/Create';
    static readonly AddSubCategory: string = 'ProductSubCategory/Create';
    static readonly AddOrder: string = 'SalesOrder/Create';
    static readonly GetOrders: string = 'SalesOrder/Get';
    static readonly GetSalesOrder:string = 'SalesOrder/GetSalesOrder';
    static readonly GetOrderDetailById: string = 'SalesOrder/GetOrderDetailById';
    static readonly GetDetailByIdForChallan: string = 'v1/CRM/GetDetailsByIdForChallanAsync';
    static readonly DeleteMasterDetailById: string = 'SalesOrder/DeleteMasterDetailById';
    static readonly GetOrderMasterById: string = 'SalesOrder/GetOrderMasterById';
    static readonly DeleteCategory: string = 'ProductCategory/Delete';
    static readonly GetSalesInvoiceById: string = 'SalesInvoice/GetById';
    static readonly AddDeliveryChallan:string = 'v1/CRM/ChallanCreate';
    static readonly GetApprovedSalesOrder:string = 'v1/CRM/GetApprovedSalesOrder';
    static readonly GetInvoiceMaster:string = 'v1/CRM/GetInvoiceMaster';
    static readonly GetInvoiceDetails:string = 'v1/CRM/GetInvoiceDetails';
    static readonly GetVehicleDropdown:string = 'v1/CRM/GetVehicles';
    static readonly GetDiscountByInvoiceId:string = 'v1/CRM/GetDiscountByInvoiceId';

    static readonly GetCustomerReamingChallanQnty:string = 'SalesOrderReport/GetCustomerReamingChallanQntyAsync';

    //#region PriceConfigure
     static readonly GetPriceRangeConfigsByQntyAsync:string = 'SalesOrderReport/GetPriceRangeConfigsByQntyAsync';
   
    //#endregion

    //#region Challan Master And  Detail
    static readonly GetChallanMasterList:string = 'v1/CRM/GetChallanMasterAsync';
    static readonly GetChallanDetailsList:string = 'v1/CRM/GetChallanDetailsById';
    static readonly UpdateChallanDetail:string = 'v1/CRM/ChallanUpdate';
    //#endregion

    //#region Branch
    static readonly GetBranchList:string = 'Branch/GetForDropdown';
    static readonly CreateBranch:string = 'Branch/Create';
    static readonly UpdateBranch:string = 'Branch/Update';
    static readonly GetBranch:string = 'Branch/Get';
    static readonly GetBranchDelete:string = 'Branch/Delete';
    //#endregion

    //#region GetGatePassInfo
    static readonly GetChallanListGatePass:string = 'v1/CRM/GetGatePassInfo';
    static readonly CreateGatePass:string = 'v1/CRM/CreateGatePass';
    //#endregion

    //#region GetGatePassInfo
    static readonly GetInvoiceMasterCreateById:string = 'v1/CRM/GetInvoiceMasterInfo';
    static readonly GetInvoiceDetailCreateById:string = 'v1/CRM/GetInvoiceDetailsInfo';
    static readonly CreateInvoice:string = 'v1/CRM/InvoiceCreate';
    //#endregion

    //#region Discount
    static readonly GetDiscountList:string = 'Discount/Get';
    static readonly GetDiscountCreate:string = 'Discount/Create';
    static readonly GetDiscountDelete:string = 'Discount/Delete';
    //#endregion

    //#region Vehicle
    static readonly CreateVehicle: string = 'Vehicle/Create';
    static readonly GetVehicle: string = 'Vehicle/Get';
    static readonly DeleteVehicle: string = 'Vehicle/Delete';
    //#endregion

    //#region SalesReturn
    static readonly CreateSalesReturn: string = 'v1/CRM/CreateSalesReturn';
    static readonly GetSalesReturnMasterList:string = 'v1/CRM/GetSalesReturnMasterAsync';
    static readonly GetSalesReturnDetailsList:string = 'v1/CRM/GetSalesReturnDetailsAsync';
    //#endregion

    // Additional static messages can be added here

    // Private constructor to prevent instantiation
    private constructor() {}
}