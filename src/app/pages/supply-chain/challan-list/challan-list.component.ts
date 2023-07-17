import { HttpStatusCode } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, EditableTip, FormLayout, MenuConfig, TableWidthConfig } from 'ng-devui';
import { Subscription } from 'rxjs';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
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
  selector: 'app-challan-list',
  templateUrl: './challan-list.component.html',
  styleUrls: ['./challan-list.component.scss']
})
export class ChallanListComponent implements OnInit{
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

  editRowIndex = -1;

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    fromDate:null,
    toDate:null,
    customerId:null,
    challanNo:null,
    orderNo:null
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
  constructor(
    private listDataService: ListDataService, 
    private service:OrderService,
    private SaleInvservice:SalesInvoiceService,
    private comService: CommonService,
    private proService:ProductService,
    private dialogService: DialogService, 
    private cdr: ChangeDetectorRef,
    private router: Router,) {}

  ngOnInit() {
    this.getList();
    //this.getProductList();
  }
  changeProduct(product:any){
    this.productInfo = this.dropdownProductList.find(x=>x.id==product.id);
    this.productRowData.quantity = 1;
    this.productRowData.unitPrice = Number(this.productInfo?.defaultPrice)??0;
    this.productRowData.unit = this.selectUnits.find(x=>x.id == 1)??{};
    this.productRowData.totalPrice = this.productRowData.quantity * this.productRowData.unitPrice;
  }
  search() {
    this.getList();
  }
  beforeEditStart = (rowItem: any, field: any) => {
    return true;
  };
  
   beforeEditEnd = async (rowItem: any, field: any) => {
    //await this.updateproduct(rowItem);
    if (rowItem && rowItem[field].length < 3) {
      return false;
    } else {
      return true;
    }
  };
  
  async getList() {
    this.busy = (await this.SaleInvservice.getChallanMasterListDetails(ApiEndPoints.GetChallanMasterList, this.pager)).subscribe((res:SalesInvoiceResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      this.basicDataSource = data;
      this.pager.total = res.totalCount;
    });
  }
  async getCustomerDropdown() {
    this.busy = (await this.proService.getCustomerDropdown(ApiEndPoints.GetCustomerFoDropdown)).subscribe((res:CustomerResponse) => {
      this.customerDropdownList = res.data;
      this.customerList = res.data.map(({ id, customerName }) => ({ id: id, label: customerName }));
    });
  }
  async viewRow(row: any, index: number) {
    this.busy = (await this.service.getOrderDetails(ApiEndPoints.GetOrderDetailById, row.id)).subscribe((res:OrderResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      debugger
      this.listData = data;
      //const totalPrice = this.listData.reduce((sum, item) => sum + item.totalPrice, 0);
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
      onClose: () => {},
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
  selectStart(value:any) {
    console.log('start', value);
  }
  selectEnd(value:any) {
    console.log('end', value);
  }
  selectRange(value:any) {
    console.log(value);
  }


  
items: Array<any> = [];
onRowCheckChange(checked: boolean, rowIndex: number, nestedIndex: string, rowItem: any) {
  this.items.push(rowItem);
}
 
  cancelRequest(){
    this.editForm.modalInstance.hide();
  }

}
