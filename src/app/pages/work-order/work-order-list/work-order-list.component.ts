import { HttpStatusCode } from '@angular/common/http';
import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, EditableTip, FormLayout, TableWidthConfig } from 'ng-devui';
import { AppendToBodyDirection } from 'ng-devui/utils';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/@core/data/listData';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { StringHelper } from 'src/app/@core/helper/StringHelper';
import { ListDataService } from 'src/app/@core/mock/list-data.service';
import { CustomerResponse } from 'src/app/@core/model/CustomerResponse';
import { OrderResponse } from 'src/app/@core/model/OrderResponse';
import { Product } from 'src/app/@core/model/ProductResponse';
import { CommonService } from 'src/app/@core/services/CommonService';
import { OrderService } from 'src/app/@core/services/order/order.service';
import { ProductService } from 'src/app/@core/services/product/product.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';
import { orderPageNotification } from 'src/assets/i18n/en-US/order';

@Component({
  selector: 'app-work-order-list',
  templateUrl: './work-order-list.component.html',
  styleUrls: ['./work-order-list.component.scss']
})
export class WorkOrderListComponent {
  filterAreaShow = false;
  columnsLayout: FormLayout = FormLayout.Columns;
  multipleSelectConfig: any;
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

  StatusOptions = ['Approved', 'Rejected'];

  searchForm: {
    borderType: '' | 'borderless' | 'bordered';
    size: 'sm' | 'md' | 'lg';
    layout: 'Select Status' | 'fixed';
  } = {
    borderType: '',
    size: 'md',
    layout: 'Select Status',
  };

  tableWidthConfig: TableWidthConfig[] = [
    {
      field: 'id',
      width: '150px',
    },
    {
      field: 'Product Name',
      width: '150px',
    },
    {
      field: 'Quantity',
      width: '100px',
    },
    {
      field: 'Unit',
      width: '100px',
    },
    {
      field: 'Total Price',
      width: '100px',
    },
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
  //formData = {};

  editForm: any = null;

  editRowIndex = -1;

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };
  rangeStart = new Date();
  rangeEnd = new Date();
  editableTip = EditableTip.btn;
  listData!:any[];
  orderMaster!:any[];
  productRowData = {
    product: '',
    quantity: 0,
    unit: {},
    unitPrice: 0,
    totalPrice: 0,

  };
  productInfo?:Product;
  dropdownProductList:any[] = [];
  productList: any[] = [];
  busy!: Subscription;
  toastMessage:any;
  @ViewChild('EditorTemplate', { static: true })
  EditorTemplate!: TemplateRef<any>;
  selectUnits = [
    {
      id: 1,
      label: 'Pcs',
    },
    {
      id: 2,
      label: 'Dzn',
    }
  ];
  DiscountOptions = [
    { id: 1, name: 'Online Discount' },
    { id: 2, name: 'Depot Maintanence' },
    { id: 3, name: 'Special Cost' },
    { id: 4, name: 'Eid Offer' },
    { id: 5, name: 'Promotional Offer' },
  ];
  
  currentDate = new Date();
  searchModel = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    fromDate: new Date(this.currentDate.getFullYear(),this.currentDate.getMonth()-1,this.currentDate.getDate()),
    toDate: new Date(),
    orderId:0,
    status:'',
  }


// Set the fromDate to one month behind the current date
  masterData = {
    id:0,
    orderDate:(new Date).toDateString(),
    orderNumber:0,
    estimatedDeliveryDate: new Date,
    selectedCustomer:{id:0,label:''},
    selectedDiscount: { id: 0, name: '' },
    totalPrice: 0,
    pdc:true,
    genDiscount:0,
    orderAmDiscount:0,
    otherDiscount:0,
    netAmount:0,
    deliveryInstruction:'',
    deliveryAddress:'',
    remarks:''
  }
  customerDropdownList:any[] = [];
  customerList: any[] = [];
  selectedItem: string = '';
  isSelect : boolean = false;
  selectedId : string = '';
  msgs: Array<Object> = [];
  data:any;
  selectedDate1 = new Date();
  selectedDate2 = null;
  selectedDate3 = null;
  disabled = true;
  dateConfig = {
    timePicker: true,
    dateConverter: null,
    min: 2019,
    max: 2040,
    format: {
      date: 'MM.dd.y',
      time: 'y-MM-dd HH:mm:ss'
    }
  };
  appendToBodyDirections: AppendToBodyDirection[] = ['centerDown', 'centerUp'];
  constructor(
    private listDataService: ListDataService, 
    private service:OrderService,
    private comService: CommonService,
    private proService:ProductService,
    private dialogService: DialogService, 
    private cdr: ChangeDetectorRef,
    private router: Router,) {}

  ngOnInit() {
    this.getList();
    this.getProductList();
  }
  changeProduct(product:any){
    this.productInfo = this.dropdownProductList.find(x=>x.id==product.id);
    this.productRowData.quantity = 1;
    this.productRowData.unitPrice = Number(this.productInfo?.defaultPrice)??0;
    this.productRowData.unit = this.selectUnits.find(x=>x.id == 1)??{};
    this.productRowData.totalPrice = this.productRowData.quantity * this.productRowData.unitPrice;
  }
  getValue(value:any) {
    console.log(value);
  }
  async search(model:any) {
    var data =this.searchModel
    var fromData = new FormData();
    //this.searchModel.fromDate = new Date((await this.comService.dateConvertion(this.searchModel.fromDate.toDateString())).toString())
    //this.searchModel.toDate = new Date((await this.comService.dateConvertion(this.searchModel.toDate.toDateString())).toString())
    fromData.append("PageIndex",this.searchModel.pageIndex.toString());
    fromData.append("PageSize",this.searchModel.pageSize.toString());
    fromData.append("FromDate", this.searchModel.fromDate.toLocaleDateString(undefined, this.comService.dateFormate));
    fromData.append("ToDate",this.searchModel.toDate.toLocaleDateString(undefined, this.comService.dateFormate));
    fromData.append("Status",this.searchModel.status.toString());
    fromData.append("OrderId",this.searchModel.orderId.toString());
    debugger
    this.busy = (await this.service.getSalesOrders(ApiEndPoints.GetSalesOrder, fromData)).subscribe((res:OrderResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      this.basicDataSource = data;
      this.pager.total = res.totalCount;
    });
  }
  beforeEditStart = (rowItem: any, field: any) => {
    return true;
  };
  modifyTotalPrice(event:any,productRow:any){
    if(event.id===2 && productRow.unit.id != 2)
    {
      this.productRowData.unitPrice = this.productRowData.unitPrice * 12;
      this.productRowData.totalPrice = this.productRowData.totalPrice * 12;
    }
    else if(event.id === 1){
      this.productRowData.unitPrice = Number(this.productInfo?.defaultPrice)??0;
      this.productRowData.totalPrice = Number(this.productInfo?.defaultPrice)??0;
    }
  }
  genarateTotalPrice(productRowData:any){
    this.productRowData.totalPrice = productRowData.quantity * productRowData.unitPrice;
    debugger
  }
   beforeEditEnd = async (rowItem: any, field: any) => {
    //await this.updateproduct(rowItem);
    if (rowItem && rowItem[field].length < 3) {
      return false;
    } else {
      return true;
    }
  };
  
  async getProductList() {
    this.busy = (await this.proService.getProductDropdown(ApiEndPoints.GetProductForDropdown)).subscribe((res:OrderResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      this.dropdownProductList = data;
      this.productList = res.data.map(({ id, productName }) => ({ id: id, label: productName }));
      //this.pager.total = res.totalCount;
    });
  }
  valueChange(event:any){
    debugger
    this.selectedId = event.target.value;
    this.isSelect = true;
    this.selectedItem = event.target.options[event.target.selectedIndex].text;
    //this.selected = event.target.value;
  }
  async getList() {
    var fromData = new FormData();
    fromData.append("PageIndex",this.pager.pageIndex.toString());
    fromData.append("PageSize",this.pager.pageSize.toString());
    this.busy = (await this.service.getSalesOrders(ApiEndPoints.GetSalesOrder, fromData)).subscribe((res:OrderResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      this.basicDataSource = data;
      this.pager.total = res.totalCount;
      debugger
    });
  }
  async getCustomerDropdown() {
    this.busy = (await this.proService.getCustomerDropdown(ApiEndPoints.GetCustomerFoDropdown)).subscribe((res:CustomerResponse) => {
      this.customerDropdownList = res.data;
      this.customerList = res.data.map(({ id, customerName }) => ({ id: id, label: customerName }));
    });
  }
  async editRow(row: any, index: number) {
    this.busy = (await this.service.getOrderDetails(ApiEndPoints.GetOrderDetailById, row.id)).subscribe((res:OrderResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      debugger
      this.listData = data;
      const totalPrice = this.listData.reduce((sum, item) => sum + item.totalPrice, 0);
    });
    await this.getCustomerDropdown();
    this.busy = (await this.service.GetOrderMasterById(ApiEndPoints.GetOrderMasterById, row.id)).subscribe((res:OrderResponse) => {
      const data = res.data;
      this.orderMaster = data;
      const totalPrice = this.listData.reduce((sum, item) => sum + item.totalPrice, 0);
      const genDiscount = (res.data[0].generalDiscount / 100)* totalPrice;
      let netPrice = totalPrice - genDiscount;
      const otherDiscount = res.data[0].otherDiscount>0?(res.data[0].otherDiscount/100)*(totalPrice - genDiscount):0;
      netPrice = netPrice -otherDiscount;
      this.masterData.netAmount =netPrice;
      var discount = this.comService.getDiscountByParcent(this.masterData.netAmount);
      netPrice = netPrice - (discount / 100)* netPrice;
      this.masterData.orderAmDiscount = discount;
      this.masterData.totalPrice = totalPrice;
      this.masterData.netAmount = netPrice;
      this.masterData.id = res.data[0].id;
      this.masterData.orderNumber = res.data[0].orderNo
      this.masterData.selectedCustomer = {id:res.data[0].customerId,label:res.data[0].customerName}
      this.masterData.deliveryAddress = res.data[0].deliveryAddress;
      this.masterData.deliveryInstruction = res.data[0].deliveryInstruction;
      this.masterData.estimatedDeliveryDate = res.data[0].estimatedDeliveryDate;
      this.masterData.otherDiscount = res.data[0].otherDiscount;
      this.masterData.genDiscount = res.data[0].generalDiscount;
      this.masterData.remarks = res.data[0].remarks;
      const orderDate = new Date(res.data[0].orderDate);
      this.masterData.orderDate = orderDate.toLocaleDateString(undefined, this.comService.dateFormate);
      this.masterData.selectedDiscount = {id:Number(this.DiscountOptions.find(x=>x.name== res.data[0].discountTypes)?.id),name:res.data[0].discountTypes}

    });
    this.editRowIndex = index;
    this.formData = row;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '800px',
      maxHeight: 'auto',
      title: 'Review Sales Work Order',
      showAnimate: true,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [
      ],
    });
  }
  showToast(type: any, title: string, msg: string) {
    this.msgs = [{ severity: type, summary: title, detail: msg }];
  }
  async quickRowAdded(e: any) {
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
    this.masterData.netAmount =totalPrice - (this.masterData.genDiscount / 100)* totalPrice;
    this.masterData.totalPrice = totalPrice;
    var discount = this.comService.getDiscountByParcent(this.masterData.netAmount)
    this.masterData.netAmount =this.masterData.netAmount - (discount / 100)* this.masterData.netAmount;
    this.masterData.orderAmDiscount = discount;
  }
  deleteItem(index: number,item:any) {
    const results = this.dialogService.open({
      id: 'delete-dialog',
      width: '346px',
      maxHeight: '600px',
      title: 'Delete',
      showAnimate: false,
      content: 'Are you sure you want to delete it?',
      backdropCloseable: true,
      onClose: () => {},
      buttons: [
        {
          cssClass: 'primary',
          text: 'Ok',
          disabled: false,
          handler: async ($event: Event) => {
            // if(item!=undefined && item.id!=undefined){
            //   await this.deleteMasterDetailItem(item.id);
            //   this.listData.splice(index, 1);
            //   results.modalInstance.hide();
            // }else{
            //   this.listData.splice(index, 1);
            //   results.modalInstance.hide();
            // }
            this.listData.splice(index, 1);
            results.modalInstance.hide();
            const totalPrice = this.listData.reduce((sum, item) => sum + item.totalPrice, 0);
            this.masterData.netAmount =totalPrice - (this.masterData.genDiscount / 100)* totalPrice;
            this.masterData.totalPrice = totalPrice;
            var discount = this.comService.getDiscountByParcent(this.masterData.netAmount)
            this.masterData.netAmount =this.masterData.netAmount - (discount / 100)* this.masterData.netAmount;
            this.masterData.orderAmDiscount = discount;
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
  async deleteMasterDetailItem(id:number){
    this.busy = (await this.service.deleteMasterDetailById(ApiEndPoints.DeleteMasterDetailById,id)).subscribe((res:CustomerResponse) => {
      this.customerDropdownList = res.data;
    });
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.getList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.getList();
  }

  reset() {
    this.searchForm = {
      borderType: '',
      size: 'md',
      layout: 'Select Status',
    };
    this.pager.pageIndex = 1;
    this.getList();
  }

  onSubmitted(e: any) {
    this.editForm!.modalInstance.hide();
    this.basicDataSource.splice(this.editRowIndex, 1, e);
  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
    this.editRowIndex = -1;
  }
  selectStart(value:any) {
    console.log('start', value);
  }
  selectEnd(value:any) {
    console.log('end', value);
  }
  selectRange(value:any) {
    console.log(value);
  }

 async approveOrder(item:any){
  const formData = new FormData();
  formData.append('OrderId', item.orderCode.toString());
  formData.append('Status', StringHelper.Approved.toString());
  debugger
  (await this.service.UpdateStatus(ApiEndPoints.UpdateStatusAsync, formData)).subscribe({
    next: (res: OrderResponse) => {
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
      this.getList();
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
  async rejectOrder(item:any){
    const formData = new FormData();
    formData.append('OrderId', item.orderCode.toString());
    formData.append('Status', StringHelper.Rejected.toString());
    (await this.service.UpdateStatus(ApiEndPoints.UpdateStatusAsync, formData)).subscribe({
      next: (res: OrderResponse) => {
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
        this.getList();
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
  async placeOrder(master:any){
    const masterData = await this.comService.createFormData(master);
    const products = await this.comService.createFormData(this.listData);
    // Append master data
    
    const formData = new FormData();
    debugger
var orderDate = new Date(master.orderDate);
formData.append('salesOrderMasterDto.id', master.id.toString());
formData.append('salesOrderMasterDto.OrderNo', master.orderNumber.toString());
formData.append('salesOrderMasterDto.customerId', master.selectedCustomer.id.toString());
formData.append('salesOrderMasterDto.deliveryAddress', master.deliveryAddress);
formData.append('salesOrderMasterDto.deliveryInstruction', master.deliveryInstruction);
formData.append('salesOrderMasterDto.orderDate',  orderDate.toISOString());
formData.append('salesOrderMasterDto.netAmount', master.netAmount.toString());
formData.append('salesOrderMasterDto.GeneralDiscount', master.genDiscount.toString());
//formData.append('salesOrderMasterDto.OrderAmountDiscount', master.orderAmDiscount.toString());
//formData.append('salesOrderMasterDto.DiscountTypes', master.selectedDiscount.name!=undefined?master.selectedDiscount.name.toString():'');
//formData.append('salesOrderMasterDto.OtherDiscount', master.otherDiscount!=undefined?master.otherDiscount.toString():0);
formData.append('salesOrderMasterDto.estimatedDeliveryDate', new Date(master.estimatedDeliveryDate).toISOString());
formData.append('salesOrderMasterDto.remarks', master.remarks);

// Append list data
for (let i = 0; i < this.listData.length; i++) {
const item = this.listData[i];
formData.append(`salesOrderDetailsDto[${i}].productId`, item.productId.toString());
formData.append(`salesOrderDetailsDto[${i}].productDescription`, item.productDescription);
formData.append(`salesOrderDetailsDto[${i}].quantity`, item.quantity.toString());
formData.append(`salesOrderDetailsDto[${i}].unitId`, item.unitId.toString());
formData.append(`salesOrderDetailsDto[${i}].unitPrice`, item.unitPrice.toString());
formData.append(`salesOrderDetailsDto[${i}].totalPrice`, item.totalPrice.toString());
}
(await this.service.createOrder(ApiEndPoints.UpdateSales, formData)).subscribe({
next: (res: OrderResponse) => {
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
  cancelRequest(){
    this.editForm.modalInstance.hide();
  }
}
