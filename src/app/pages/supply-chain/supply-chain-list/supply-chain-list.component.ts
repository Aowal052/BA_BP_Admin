import { HttpStatusCode } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataTableComponent, DialogService, EditableTip, FormLayout, MenuConfig, TableWidthConfig } from 'ng-devui';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/@core/data/listData';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { StringHelper } from 'src/app/@core/helper/StringHelper';
import { ListDataService } from 'src/app/@core/mock/list-data.service';
import { CustomerResponse } from 'src/app/@core/model/CustomerResponse';
import { OrderResponse } from 'src/app/@core/model/OrderResponse';
import { Product } from 'src/app/@core/model/ProductResponse';
import { SalesInvoiceResponse } from 'src/app/@core/model/SalesInvoiceResponse';
import { CommonService } from 'src/app/@core/services/CommonService';
import { OrderService } from 'src/app/@core/services/order/order.service';
import { ProductService } from 'src/app/@core/services/product/product.service';
import { SalesInvoiceService } from 'src/app/@core/services/salesinvoice/sales-invoice.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';
import { orderPageNotification } from 'src/assets/i18n/en-US/order';

@Component({
  selector: 'app-supply-chain-list',
  templateUrl: './supply-chain-list.component.html',
  styleUrls: ['./supply-chain-list.component.scss']
})




export class SupplyChainListComponent implements OnInit {
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
      field: 'checkbox',
      width: '40px',
    },
    {
      field: 'id',
      width: '60px',
    },
    {
      field: 'Product Name',
      width: '300px',
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
      field: 'Prev Del Qnty',
      width: '150px',
    },
    {
      field: 'Del Quny',
      width: '150px',
    },
    {
      field: 'Total Price',
      width: '100px',
    },
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
      link: 'invoice-list',
      name: 'Delivery Challan Entry'
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
  listData!: any[];
  orderMaster!: any[];
  productRowDataList!: any[];
  productRowData = {
    product: '',
    quantity: 0,
    unit: {},
    unitPrice: 0,
    remainingQuantity:0,
    deliveryQuantity:0,
    totalPrice: 0,
    productId:0,
    unitId:0
  };
  productInfo?: Product;
  dropdownProductList: any[] = [];
  productList: any[] = [];
  busy!: Subscription;
  toastMessage: any;
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
  // DiscountOptions = [
  //   { id: 1, name: 'Online Discount' },
  //   { id: 2, name: 'Depot Maintanence' },
  //   { id: 3, name: 'Special Cost' },
  //   { id: 4, name: 'Eid Offer' },
  //   { id: 5, name: 'Promotional Offer' },
  // ];
  masterData = {
    id: 0,
    orderDate: (new Date).toDateString(),
    orderNumber: 0,
    estimatedDeliveryDate: new Date,
    selectedCustomer: { id: 0, label: '' },
    selectedDiscount: { id: 0, name: '' },
    totalPrice: 0,
    pdc: true,
    genDiscount: 0,
    orderAmDiscount: 0,
    otherDiscount: 0,
    netAmount: 0,
    deliveryInstruction: '',
    deliveryAddress: '',
    remarks: ''
  }
  customerDropdownList: any[] = [];
  customerList: any[] = [];
  selectedItem: string = '';
  isSelect: boolean = false;
  selectedId: string = '';
  msgs: Array<Object> = [];
  data: any;
  //@ViewChild(DataTableComponent, { static: true })
  //item!: DataTableComponent;
  //items: any[] = [];
  constructor(
    private listDataService: ListDataService,
    private service: OrderService,
    private comService: CommonService,
    private proService: ProductService,
    private dialogService: DialogService,
    private SaleInvservice: SalesInvoiceService,
    private cdr: ChangeDetectorRef,) { }

  ngOnInit() {
    this.getList();
    this.getProductList();
  }
  // changeProduct(product: any) {
  //   this.productInfo = this.dropdownProductList.find(x => x.id == product.id);
  //   this.productRowData.quantity = 1;
  //   this.productRowData.unitPrice = Number(this.productInfo?.defaultPrice) ?? 0;
  //   this.productRowData.unit = this.selectUnits.find(x => x.id == 1) ?? {};
  //   this.productRowData.totalPrice = this.productRowData.quantity * this.productRowData.unitPrice;
  // }
  search() {
    this.getList();
  }
  beforeEditStart = (rowItem: any, field: any) => {
    return true;
  };
  // modifyTotalPrice(event:any,productRow:any){
  //   if(event.id===2 && productRow.unit.id != 2)
  //   {
  //     this.productRowData.unitPrice = this.productRowData.unitPrice * 12;
  //     this.productRowData.totalPrice = this.productRowData.totalPrice * 12;
  //   }
  //   else if(event.id === 1){
  //     this.productRowData.unitPrice = Number(this.productInfo?.defaultPrice)??0;
  //     this.productRowData.totalPrice = Number(this.productInfo?.defaultPrice)??0;
  //   }
  // }
  // genarateTotalPrice(productRowData:any){
  //   this.productRowData.totalPrice = productRowData.quantity * productRowData.unitPrice;
  //   debugger
  // }
  beforeEditEnd = async (rowItem: any, field: any) => {
    //await this.updateproduct(rowItem);
    if (rowItem && rowItem[field].length < 3) {
      return false;
    } else {
      return true;
    }
  };

  async getProductList() {
    this.busy = (await this.proService.getProductDropdown(ApiEndPoints.GetProductForDropdown)).subscribe((res: OrderResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      this.dropdownProductList = data;
      this.productList = res.data.map(({ id, productName }) => ({ id: id, label: productName }));
      this.pager.total = res.totalCount;
    });
  }
  // valueChange(event:any){
  //   debugger
  //   this.selectedId = event.target.value;
  //   this.isSelect = true;
  //   this.selectedItem = event.target.options[event.target.selectedIndex].text;
  //   //this.selected = event.target.value;
  // }
  async getList() {
    this.busy = (await this.SaleInvservice.getApprovedSalesOrder(ApiEndPoints.GetApprovedSalesOrder, this.pager)).subscribe((res: SalesInvoiceResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      this.basicDataSource = data;
      debugger
      this.pager.total = res.totalCount;
    });
  }
  async getCustomerDropdown() {
    this.busy = (await this.proService.getCustomerDropdown(ApiEndPoints.GetCustomerFoDropdown)).subscribe((res: CustomerResponse) => {
      this.customerDropdownList = res.data;
      this.customerList = res.data.map(({ id, customerName }) => ({ id: id, label: customerName }));
    });
  }
  genarateTotalPrice(productRowData:any,index:number){
    debugger
    this.productRowDataList[index].totalPrice = productRowData.remainingQuantity * productRowData.unitPrice;
    debugger
  }
  async viewRow(row: any, index: number) {
    this.productRowDataList = [];
    this.items=[];
    this.busy = (await this.service.getOrderDetails(ApiEndPoints.GetDetailByIdForChallan, row.orderCode)).subscribe(async (res: OrderResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      debugger;
      this.listData = data;
      for(var i=0;i<=data.length-1;i++){
        this.productRowData = {
          product: '',
          quantity: 0,
          unit: {},
          unitPrice: 0,
          remainingQuantity:0,
          deliveryQuantity:0,
          totalPrice: 0,
          productId:0,
          unitId:0
        };
        this.productRowData.deliveryQuantity = data[i].deliveryQuantity,
        this.productRowData.product = data[i].productName,
        this.productRowData.remainingQuantity = data[i].remainingQuantity,
        this.productRowData.quantity = data[i].quantity,
        //this.productRowData[i].totalPrice = data[i].totalPrice,
        this.productRowData.unit = data[i].unitName,
        //this.productRowData[i].unitPrice = data[i].unitPrice,
        this.productRowData.productId = data[i].productId,
        this.productRowData.unitId = data[i].unitId

        this.productRowDataList.push(this.productRowData)
      }
    });
    this.busy = (await this.service.GetOrderMasterById(ApiEndPoints.GetOrderMasterById, row.id)).subscribe((res: OrderResponse) => {
      debugger
      const data = res.data;
      this.orderMaster = data;
      //const totalPrice = this.listData.reduce((sum, item) => sum + item.totalPrice, 0);
      //const genDiscount = (res.data[0].generalDiscount / 100) * totalPrice;
      //let netPrice = totalPrice - genDiscount;
      //const otherDiscount = res.data[0].otherDiscount > 0 ? (res.data[0].otherDiscount / 100) * (totalPrice - genDiscount) : 0;
      //netPrice = netPrice - otherDiscount;
      //this.masterData.netAmount = netPrice;
      var discount = this.comService.getDiscountByParcent(this.masterData.netAmount);
      //netPrice = netPrice - (discount / 100) * netPrice;
      this.masterData.orderAmDiscount = discount;
      //this.masterData.totalPrice = totalPrice;
      //this.masterData.netAmount = netPrice;
      //this.masterData.id = res.data[0].id;
      this.masterData.orderNumber = res.data[0].orderNo
      this.masterData.selectedCustomer = { id: res.data[0].customerId, label: res.data[0].customerName }
      this.masterData.deliveryAddress = res.data[0].deliveryAddress;
      this.masterData.deliveryInstruction = res.data[0].deliveryInstruction;
      this.masterData.estimatedDeliveryDate = res.data[0].estimatedDeliveryDate;
      this.masterData.otherDiscount = res.data[0].otherDiscount;
      this.masterData.genDiscount = res.data[0].generalDiscount;
      this.masterData.remarks = res.data[0].remarks;
      const orderDate = new Date(res.data[0].orderDate);
      this.masterData.orderDate = orderDate.toLocaleDateString(undefined, this.comService.dateFormate);
      // this.masterData.selectedDiscount = {id:Number(this.DiscountOptions.find(x=>x.name== res.data[0].discountTypes)?.id),name:res.data[0].discountTypes}

    });
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
      layout: 'auto',
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
  onRowCheckChange(checked: boolean, rowIndex: number, nestedIndex: string, rowItem: any) {
    rowItem.$checked = checked;
    rowItem.$halfChecked = false;
    checked?this.items.push(rowItem):this.items.splice(rowIndex,1)
  }
  onCheckAllChange(e:any) {
    e?this.items = this.productRowDataList:this.items=[];
  }
  async CreateChallan(master: any) {
    debugger
    if(this.items.length<1){
      this.msgs = [
        {
          severity: 'warn',
          summary: orderPageNotification.orderPage.createMessage.summary,
          content: orderPageNotification.orderPage.createMessage.selectDetail,
        },
      ];
      return;
    }
    const formData = new FormData();
    var orderDate = new Date(master.orderDate);
    formData.append('ChallanMasterDto.OrderNo', master.orderNumber.toString());
    formData.append('ChallanMasterDto.customerId', master.selectedCustomer.id.toString());
    formData.append('ChallanMasterDto.deliveryAddress', master.deliveryAddress);
    formData.append('ChallanMasterDto.deliveryInstruction', master.deliveryInstruction);
    formData.append('ChallanMasterDto.orderDate', orderDate.toISOString());
    formData.append('ChallanMasterDto.netAmount', master.netAmount.toString());
    formData.append('ChallanMasterDto.GeneralDiscount', master.genDiscount.toString());
    // formData.append('InvoiceMasterDto.OrderAmountDiscount', master.orderAmDiscount.toString());
    // formData.append('InvoiceMasterDto.DiscountTypes', master.selectedDiscount.name != undefined ? master.selectedDiscount.name.toString() : '');
    // formData.append('InvoiceMasterDto.OtherDiscount', master.otherDiscount != undefined ? master.otherDiscount.toString() : 0);
    formData.append('ChallanMasterDto.estimatedDeliveryDate', new Date(master.estimatedDeliveryDate).toISOString());
    formData.append('ChallanMasterDto.remarks', master.remarks);

    //Append list data
    for (let i = 0; i < this.items.length; i++) {
      debugger
      const item = this.items[i];
      formData.append(`ChallanDetailsDtos[${i}].productId`, item.productId.toString());
      //formData.append(`InvoiceDetailsDto[${i}].productDescription`, item.productDescription);
      formData.append(`ChallanDetailsDtos[${i}].quantity`, item.quantity.toString());
      formData.append(`ChallanDetailsDtos[${i}].unitId`, item.unitId.toString());
     // formData.append(`InvoiceDetailsDto[${i}].unitPrice`, item.unitPrice.toString());
      formData.append(`ChallanDetailsDtos[${i}].deliveryQuantity`, item.remainingQuantity?? 0);
      //formData.append(`InvoiceDetailsDto[${i}].totalPrice`, item.totalPrice.toString());
    }
    (await this.service.createOrder(ApiEndPoints.AddDeliveryChallan, formData)).subscribe({
      next: async (res: SalesInvoiceResponse) => {
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
        await this.getList();
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
    this.items = [];
  }
  cancelRequest() {
    this.editForm.modalInstance.hide();
    this.items = [];
  }
}
