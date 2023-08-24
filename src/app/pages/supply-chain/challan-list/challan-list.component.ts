import { HttpStatusCode } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, EditableTip, FormLayout, MenuConfig, TableWidthConfig } from 'ng-devui';
import { AppendToBodyDirection } from 'ng-devui/utils';
import { Subscription } from 'rxjs';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { ListDataService } from 'src/app/@core/mock/list-data.service';
import { CustomerResponse } from 'src/app/@core/model/CustomerResponse';
import { DeliveryChallanResponse } from 'src/app/@core/model/DeliveryChallanResponse';
import { OrderResponse } from 'src/app/@core/model/OrderResponse';
import { PriecConfig, PriecConfigResponse } from 'src/app/@core/model/PriecConfigResponse';
import { Product } from 'src/app/@core/model/ProductResponse';
import { SalesInvoiceResponse } from 'src/app/@core/model/SalesInvoiceResponse';
import { SubCustomerResponse } from 'src/app/@core/model/SubCustomerResponse';
import { CommonService } from 'src/app/@core/services/CommonService';
import { DeliveryChallanService } from 'src/app/@core/services/deliveryhallan/delivery-challan.service';
import { OrderService } from 'src/app/@core/services/order/order.service';
import { ProductService } from 'src/app/@core/services/product/product.service';
import { SalesInvoiceService } from 'src/app/@core/services/salesinvoice/sales-invoice.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';
import { orderPageNotification } from 'src/assets/i18n/en-US/order';
import { productPageNotification } from 'src/assets/i18n/en-US/product';

@Component({
  selector: 'app-challan-list',
  templateUrl: './challan-list.component.html',
  styleUrls: ['./challan-list.component.scss']
})
export class ChallanListComponent implements OnInit {
  filterAreaShow = false;
  columnsLayout: FormLayout = FormLayout.Columns;
  appendToBodyDirections: AppendToBodyDirection[] = ['centerDown', 'centerUp'];
  multipleSelectConfig: any;
  selectedDate1: any;
  selectedDate2: any;
  master: any = [];
  selectOptions = [
    {
      id: 1,
      label: 'Team1',
    },
    {
      id: 2,
      label: 'Team2',
    },
    {
      id: 3,
      label: 'Team3',
    },
  ];
  selectOptions2 = [
    {
      id: 1,
      label: 'Leader',
    },
    {
      id: 2,
      label: 'Developer',
    },
    {
      id: 3,
      label: 'Manager',
    },
  ];
  formData = {
    selectValue: this.selectOptions[1],
    multipleSelectValue: [],
    radioValue: {},
  };
  options = ['normal', 'borderless', 'bordered'];

  sizeOptions = ['sm', 'md', 'lg'];

  layoutOptions = ['auto', 'fixed'];

  searchForm: {
    borderType: '' | 'borderless' | 'bordered';
    size: 'sm' | 'md' | 'lg';
    layout: 'auto' | 'fixed';
  } = {
      borderType: '',
      size: 'md',
      layout: 'auto',
    };

  tableWidthConfig: TableWidthConfig[] = [
    {
      field: 'id',
      width: '60px',
    },
    
    {
      field: 'Product Name',
      width: '250px',
    },
    {
      field: 'Delivery Quantity',
      width: '120px',
    },
    {
      field: 'Unit',
      width: '100px',
    },
    {
      field: 'Unit Price',
      width: '120px',
    },
    {
      field: 'Total Price',
      width: '120px',
    },
    {
      field: 'Actions',
      width: '100px',
    }
  ];
  viewTableWidthConfig: TableWidthConfig[] = [
    {
      field: 'id',
      width: '60px',
    },
    
    {
      field: 'Product Name',
      width: '300px',
    },
    {
      field: 'Delivery Quantity',
      width: '200px',
    }
  ];

  breadItem: Array<MenuConfig> = [
    {
      linkType: 'hrefLink',
      link: '',
      name: 'Home'
    },
    {
      linkType: 'routerLink',
      link: './home',
      name: 'Supply Chain'
    },
    {
      linkType: 'routerLink',
      link: 'challan-list',
      name: 'Delivery Challan List'
    }
  ];

  basicDataSource: any[] = [];

  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: 'orderCode',
        prop: 'orderCode',
        type: 'input',
      },
      {
        label: 'customerName',
        prop: 'customerName',
        type: 'select',
        options: ['Low', 'Medium', 'High'],
      },
      {
        label: 'customerPhone',
        prop: 'customerPhone',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'orderAmount',
        prop: 'orderAmount',
        type: 'input',
      },
      {
        label: 'orderDate',
        prop: 'orderDate',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
    ],
    labelSize: '',
  };
  labelList = [
    {
      id: 1,
      label: 'OpenSource',
    },
    {
      id: 2,
      label: 'DevOps',
    },
    {
      id: 3,
      label: 'SoftWare',
    },
  ];
  addedLabelList = [];

  editForm: any = null;
  viewForm: any = null;

  editRowIndex = -1;
  viewRowIndex = -1;

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    fromDate: null,
    toDate: null,
    customerId: null,
    challanNo: null,
    orderNo: null
  };
  rangeStart = new Date();
  rangeEnd = new Date();
  editableTip = EditableTip.btn;
  listData!: any[];
  orderMaster!: any[];
  productRowData = {
    product: { id: 0, label: '' },
    deliveryQuantity: 0,
    unit: { id: 0, label: '' },
    unitPrice: 0,
    totalPrice: 0,
    quantity:0
  };
  productInfo!: Product;
  dropdownProductList: any[] = [];
  productList: any[] = [];
  busy!: Subscription;
  priceConfigInfo!:PriecConfig;
  toastMessage: any;
  @ViewChild('EditorTemplate', { static: true })
  //@ViewChild('ViewTemplate', { static: true })
  EditorTemplate!: TemplateRef<any>;
  @ViewChild('ViewTemplate', { static: true })
  ViewTemplate!: TemplateRef<any>;
  selectUnits = [
    {
      id: 2,
      label: 'Pcs',
    },
    {
      id: 1,
      label: 'Dzn',
    }
  ];
  masterData = {
    id: 0,
    challanNo: 0,
    orderDate: (new Date).toDateString(),
    orderNumber: 0,
    estimatedDeliveryDate: new Date,
    selectedCustomer: { id: 0, label: '' },
    selectedDiscount: { id: 0, name: '' },
    customerDeliveryAddress: '',
    selectedSubCustomer: { id: 0, label: '' },
    subCustomerName: '',
    subCustomerDeliveryAddress: '',
    totalPrice: 0,
    pdc: true,
    genDiscount: 0,
    orderAmDiscount: 0,
    otherDiscount: 0,
    netAmount: 0,
    deliveryInstruction: '',
    deliveryAddress: '',
    invoiceNo: '',
    remarks: ''
  }
  currentDate = new Date();
  searchModel = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    fromDate: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, this.currentDate.getDate()),
    toDate: new Date(),
    challanNo: '',
    selectedCustomer: { id: 0, label: '' },
    selectedSubCustomer: { id: 0, label: '' },
  }
  customerDropdownList: any[] = [];
  customerList: any[] = [];
  selectedItem: string = '';
  isSelect: boolean = false;
  selectedId: string = '';
  msgs: Array<Object> = [];
  data: any;
  subCustomerList: any[] = [];
  subCustomerDropdownList: any[] = [];
  public res: any;

  StatusOptions = ['Approved', 'Rejected'];
  constructor(
    private service: OrderService,
    private challanService: DeliveryChallanService,
    private SaleInvservice: SalesInvoiceService,
    private comService: CommonService,
    private proService: ProductService,
    private dialogService: DialogService,) { }

  ngOnInit() {
    this.search(this.searchModel);
    this.getCustomerDropdown();
    this.getProductList();
  }
  async getProductList() {
    this.busy = (await this.proService.getProductDropdown(ApiEndPoints.GetProductForDropdown)).subscribe((res: OrderResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      this.dropdownProductList = data;
      this.productList = res.data.map(({ id, productName, shortName }) => ({ id: id, label: productName, shortName: shortName ?? 'test' }));
      //this.pager.total = res.totalCount;
    });
  }
  async genarateSubInfo(data: any) {
    const customer = this.subCustomerDropdownList.find(x => x.id == data.id);
    debugger
    await this.getSubCustomerDropdown(customer.id);
    this.masterData.customerDeliveryAddress = customer?.deliveryAddress ?? '';
  }
  async getSubCustomerDropdown(id: any) {
    this.searchModel.selectedSubCustomer = { id: 0, label: '' }
    this.busy = (await this.challanService.getChallanSubCustomerDropdown(ApiEndPoints.GetSuCustomerFoDropdown, id)).subscribe((res: SubCustomerResponse) => {
      this.subCustomerDropdownList = res.data;
      this.subCustomerList = [
        { id: 0, label: 'Select Customer' }, // Add the default option
        ...res.data.map(({ id, customerName }) => ({ id: id, label: customerName }))
      ];
    });
  }
  async search(model: any) {
    debugger
    var fromData = new FormData();
    //this.searchModel.fromDate = new Date((await this.comService.dateConvertion(this.searchModel.fromDate.toDateString())).toString())
    //this.searchModel.toDate = new Date((await this.comService.dateConvertion(this.searchModel.toDate.toDateString())).toString())
    fromData.append("PageIndex", this.searchModel.pageIndex.toString());
    fromData.append("PageSize", this.searchModel.pageSize.toString());
    fromData.append("FromDate", this.searchModel.fromDate.toLocaleDateString(undefined, this.comService.dateFormate));
    fromData.append("Todate", this.searchModel.toDate.toLocaleDateString(undefined, this.comService.dateFormate));
    fromData.append("SubCustomerId", this.searchModel.selectedSubCustomer.id.toString());
    fromData.append("CustomerId", this.searchModel.selectedCustomer.id.toString());
    fromData.append("challanNo", this.searchModel.challanNo.toString());
    debugger
    this.busy = (await this.service.getSalesOrders(ApiEndPoints.GetChallanMasterList, fromData)).subscribe((res: OrderResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      debugger
      this.basicDataSource = data;
      this.pager.total = res.totalCount;
    });
  }
  beforeEditStart = (rowItem: any, field: any) => {
    debugger
    return true;
  };

  beforeEditEnd = async (rowItem: any, field: any) => {
    debugger
    var data = {
      id: rowItem.id,
      key: field,
      value: rowItem[field]
    }
    // await this.updateChallanDetails(data);
    if (rowItem && rowItem[field].length < 1) {
      return false;
    } else {
      rowItem.totalPrice = rowItem.unitPrice * rowItem.deliveryQuantity;
      return true;
    }
  };
  async arrayToFormData(array: any) {
    const formData = new FormData();

    for (let key in array) {
      if (array.hasOwnProperty(key)) {
        formData.append(key, array[key]);
      }
    }

    return formData;
  }
 
  async getCustomerDropdown() {
    this.busy = (await this.proService.getCustomerDropdown(ApiEndPoints.GetCustomerFoDropdown)).subscribe(async (res: CustomerResponse) => {
      this.customerDropdownList = res.data;
      this.customerList = res.data.map(({ id, customerName }) => ({ id: id, label: customerName }));
    });
  }
  async getList() {
    debugger
    var fromData = new FormData();
    fromData.append("PageIndex", this.searchModel.pageIndex.toString());
    fromData.append("PageSize", this.searchModel.pageSize.toString());
    this.busy = (await this.SaleInvservice.getChallanMasterListDetails(ApiEndPoints.GetChallanMasterList, fromData))
      .subscribe((res: SalesInvoiceResponse) => {
        const data = JSON.parse(JSON.stringify(res.data));
        this.basicDataSource = data;
        this.pager.total = res.totalCount;
      });
  }

  async genarateMasterInfo(data: any) {
    const customer = this.customerDropdownList.find(x => x.id == data.id);
    await this.getSubCustomerDropdown(customer.id);
    this.masterData.customerDeliveryAddress = customer?.deliveryAddress ?? '';
  }
  isActive!: boolean;
  async viewRow(row: any, index: number, status: boolean) {
    debugger;
    this.busy = (await this.SaleInvservice.GetChallanDetailsList(ApiEndPoints.GetChallanDetailsList, row.id))
      .subscribe((res: SalesInvoiceResponse) => {
        const data = JSON.parse(JSON.stringify(res.data));
        debugger
        this.listData = data;
      });

    this.isActive = status;
    this.master = this.basicDataSource.find(x => x.id == row.id);
    this.editRowIndex = index;
    this.formData = row;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '1000px',
      maxHeight: 'auto',
      title: 'Delivery Challan',
      showAnimate: true,
      contentTemplate: this.ViewTemplate,
      backdropCloseable: true,
      onClose: () => { },
      buttons: [
      ],
    });
  }
  async EditRow(row: any, index: number, status: boolean) {
    debugger;
    this.busy = (await this.SaleInvservice.GetChallanDetailsList(ApiEndPoints.GetChallanDetailsList, row.id))
      .subscribe((res: SalesInvoiceResponse) => {
        const data = JSON.parse(JSON.stringify(res.data));
        debugger
        this.listData = data;
      });

    this.isActive = status;
    this.master = this.basicDataSource.find(x => x.id == row.id);
    this.editRowIndex = index;
    this.formData = row;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '1000px',
      maxHeight: 'auto',
      title: 'Delivery Challan',
      showAnimate: true,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => { },
      buttons: [
      ],
    });
  }
  showToast(type: any, title: string, msg: string) {
    this.msgs = [{ severity: type, summary: title, detail: msg }];
  }
  onPageChange(e: number) {
    this.searchModel.pageIndex = e;
    this.search(this.searchModel);
  }

  onSizeChange(e: number) {
    this.searchModel.pageSize = e;
    this.search(this.searchModel);
  }
  async quickRowAdded(e: any) {
    debugger
    e.unitName = e.unit.label;
    e.productName = e.product.label;
    e.unitId = e.unit.id;
    e.productId = e.product.id;

    // Check if product.id already exists in this.listData
    const productExists = this.listData.some((item) => item.productId === e.productId);

    if (productExists) {
      this.showToast('error', 'Error', 'Your product alredy is in the list.');
      return;
    }

    const newData = { ...e };
    this.listData.unshift(newData);
    const totalPrice = this.listData.reduce((sum, item) => sum + item.totalPrice, 0);
    this.masterData.netAmount = totalPrice - (this.masterData.genDiscount / 100) * totalPrice;
    this.masterData.totalPrice = totalPrice;
    var discount = this.comService.getDiscountByParcent(this.masterData.netAmount)
    this.masterData.netAmount = this.masterData.netAmount - (discount / 100) * this.masterData.netAmount;
    this.masterData.orderAmDiscount = discount;
  }
 
  changeProduct(product: any) {
    debugger
    this.productInfo = this.dropdownProductList.find(x => x.id == product.id);
    const unit = this.selectUnits.find(x => x.id == this.productInfo.activeUnitId);
    this.productRowData.deliveryQuantity = 1;
    this.productRowData.unit = { id: Number(unit?.id), label: unit?.label ?? '' };
    this.productRowData.unitPrice = this.productRowData.unit.id == 1 ? Number(this.productInfo?.dozenPrice) : Number(this.productInfo?.piecePrice)
    this.productRowData.totalPrice = this.productRowData.deliveryQuantity * this.productRowData.unitPrice;
  }
  async genarateTotalPrice(productRowData:any){
    debugger
    var fromData = new FormData();
    fromData.append("Quantity", this.productRowData.deliveryQuantity.toString());
    fromData.append("UnitId", this.productRowData.unit.id.toString());
    fromData.append("ProductId", this.productRowData.product.id.toString());
    this.busy = (await this.service.GetPriceRangeConfigsByQnty(ApiEndPoints.GetPriceRangeConfigsByQntyAsync, fromData)).subscribe((res: PriecConfigResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      this.priceConfigInfo =data;
      debugger
      this.productRowData.unitPrice = data.priceRangeConfigs.unitPrice;
      this.productRowData.totalPrice = data.priceRangeConfigs.unitPrice * this.productRowData.deliveryQuantity;
    });
  }

  genarateUnitTotalPrice(productRowData:any){
    this.productRowData.totalPrice = productRowData.deliveryQuantity * productRowData.unitPrice;
    debugger
  }

  async modifyTotalPrice(event:any,productRow:any){
    debugger
    var fromData = new FormData();
    fromData.append("Quantity", productRow.deliveryQuantity.toString());
    fromData.append("UnitId", event.id.toString());
    fromData.append("ProductId", productRow.product.id.toString());
    this.busy = (await this.service.GetPriceRangeConfigsByQnty(ApiEndPoints.GetPriceRangeConfigsByQntyAsync, fromData)).subscribe((res: PriecConfigResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      this.priceConfigInfo =data.priceRangeConfigs;
      debugger
      if(data.priceRangeConfigs != null)
      {
        this.productRowData.unitPrice = data.priceRangeConfigs.unitPrice;
        this.productRowData.totalPrice = data.priceRangeConfigs.unitPrice * this.productRowData.deliveryQuantity;
      }
      else{
        this.productRowData.unitPrice  = 0;
        this.productRowData.totalPrice = 0;
      }
    });
  }

  
  reset() {
    this.searchForm = {
      borderType: '',
      size: 'md',
      layout: 'auto',
    };
    this.searchModel.pageIndex = 1;
    this.search(this.searchModel);
  }

  async placeOrder(master: any) {
    debugger
    const masterData = this.master;
    const products = await this.comService.createFormData(this.listData);
    // Append master data

    const formData = new FormData();
    debugger
    formData.append('ChallanMasterDto.id', masterData.id.toString());
    formData.append('ChallanMasterDto.CustomerId', masterData.customerId.toString());
    // Append list data
    for (let i = 0; i < this.listData.length; i++) {
      debugger
      const item = this.listData[i];
      formData.append(`ChallanDetailsDtos[${i}].productId`, item.productId.toString());
      if(this.master.orderNo === null)
      {
        formData.append(`ChallanDetailsDtos[${i}].quantity`, item.deliveryQuantity.toString());
      }
      else
      {
        formData.append(`ChallanDetailsDtos[${i}].quantity`, item.quantity.toString());
      }
      
      formData.append(`ChallanDetailsDtos[${i}].deliveryQuantity`, item.deliveryQuantity.toString());
      formData.append(`ChallanDetailsDtos[${i}].unitId`, item.unitId.toString());
      formData.append(`ChallanDetailsDtos[${i}].unitPrice`, item.unitPrice.toString());
    }
    debugger
    (await this.challanService.updateChallanDetails(ApiEndPoints.UpdateChallanDetail, formData)).subscribe({
      
      next: (res: DeliveryChallanResponse) => {
        this.data = res;
        if (res.statusCode == HttpStatusCode.Ok) {
          this.msgs = [
            {
              severity: 'success',
              summary: orderPageNotification.orderPage.createMessage.summary,
              content: orderPageNotification.orderPage.createMessage.updateSuccess,
            },
          ];
        }
        this.editForm.modalInstance.hide();
      },
  
      error: (error) => {
        this.msgs = [
          {
            severity: 'error',
            summary: orderPageNotification.orderPage.createMessage.summary,
            content: error.error.error,
          },
        ];
      }
    });
  }
  deleteItem(index: number, item: any) {
    const results = this.dialogService.open({
      id: 'delete-dialog',
      width: '346px',
      maxHeight: '600px',
      title: 'Delete',
      showAnimate: false,
      content: 'Are you sure you want to delete it?',
      backdropCloseable: true,
      onClose: () => { },
      buttons: [
        {
          cssClass: 'primary',
          text: 'Ok',
          disabled: false,
          handler: async ($event: Event) => {
            this.listData.splice(index, 1);
            results.modalInstance.hide();
           
          },
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: 'Cancel',
          handler: ($event: Event) => {
            results.modalInstance.hide();
          },
        },
      ],
    });
  }
  onSubmitted(e: any) {
    this.editForm!.modalInstance.hide();
    this.basicDataSource.splice(this.editRowIndex, 1, e);
  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
    this.editRowIndex = -1;
  }
  selectStart(value: any) {
    console.log('start', value);
  }
  selectEnd(value: any) {
    console.log('end', value);
  }
  selectRange(value: any) {
    console.log(value);
  }



  items: Array<any> = [];
  onRowCheckChange(rowItem: any) {
    this.items.push(rowItem);
  }

  cancelRequest() {
    this.editForm.modalInstance.hide();
  }

}
