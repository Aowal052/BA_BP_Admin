import { HttpStatusCode } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, EditableTip, FormLayout, MenuConfig, TableWidthConfig } from 'ng-devui';
import { AppendToBodyDirection } from 'ng-devui/utils';
import { Subscription } from 'rxjs';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { ListDataService } from 'src/app/@core/mock/list-data.service';
import { CustomerResponse } from 'src/app/@core/model/CustomerResponse';
import { OrderResponse } from 'src/app/@core/model/OrderResponse';
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

@Component({
  selector: 'app-challan-list',
  templateUrl: './challan-list.component.html',
  styleUrls: ['./challan-list.component.scss']
})
export class ChallanListComponent implements OnInit{
  filterAreaShow = false;
  columnsLayout: FormLayout = FormLayout.Columns;
  appendToBodyDirections: AppendToBodyDirection[] = ['centerDown', 'centerUp'];
  multipleSelectConfig: any;
  selectedDate1:any;
  selectedDate2:any;
  master:any =[];
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
    challanNo:0,
    orderDate:(new Date).toDateString(),
    orderNumber:0,
    estimatedDeliveryDate: new Date,
    selectedCustomer:{id:0,label:''},
    selectedDiscount: { id: 0, name: '' },
    customerDeliveryAddress:'',
    selectedSubCustomer:{id:0,label:''},
    subCustomerName:'',
    subCustomerDeliveryAddress:'',
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
  currentDate = new Date();
  searchModel = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    fromDate: new Date(this.currentDate.getFullYear(),this.currentDate.getMonth()-1,this.currentDate.getDate()),
    toDate: new Date(),
    challanNo:'',
    selectedCustomer:{id:0,label:''},
    selectedSubCustomer:{id:0,label:''},
  }
  customerDropdownList:any[] = [];
  customerList: any[] = [];
  selectedItem: string = '';
  isSelect : boolean = false;
  selectedId : string = '';
  msgs: Array<Object> = [];
  data:any;
  subCustomerList: any[] = [];
  subCustomerDropdownList:any[] = [];
  
  StatusOptions = ['Approved', 'Rejected'];
  constructor(
    private service:OrderService,
    private challanService: DeliveryChallanService,
    private SaleInvservice:SalesInvoiceService,
    private comService: CommonService,
    private proService:ProductService,
    private dialogService: DialogService,) {}

  ngOnInit() {
    this.search(this.searchModel);
    this.getCustomerDropdown();
  }
  async genarateSubInfo(data:any){
    const customer = this.subCustomerDropdownList.find(x=>x.id == data.id);
    debugger
    await this.getSubCustomerDropdown(customer.id);
    this.masterData.customerDeliveryAddress = customer?.deliveryAddress??'';
  }
  async getSubCustomerDropdown(id: any) {
    this.searchModel.selectedSubCustomer = {id:0,label:''}
     this.busy = (await this.challanService.getChallanSubCustomerDropdown(ApiEndPoints.GetSuCustomerFoDropdown,id)).subscribe((res:SubCustomerResponse) => {
       this.subCustomerDropdownList = res.data;
       this.subCustomerList = [
        { id: 0, label: 'Select Customer' }, // Add the default option
        ...res.data.map(({ id, customerName }) => ({ id: id, label: customerName }))
      ];
     });
   }
   async search(model:any) {
    var fromData = new FormData();
    //this.searchModel.fromDate = new Date((await this.comService.dateConvertion(this.searchModel.fromDate.toDateString())).toString())
    //this.searchModel.toDate = new Date((await this.comService.dateConvertion(this.searchModel.toDate.toDateString())).toString())
    fromData.append("PageIndex",this.searchModel.pageIndex.toString());
    fromData.append("PageSize",this.searchModel.pageSize.toString());
    fromData.append("FromDate", this.searchModel.fromDate.toLocaleDateString(undefined, this.comService.dateFormate));
    fromData.append("Todate",this.searchModel.toDate.toLocaleDateString(undefined, this.comService.dateFormate));
    fromData.append("SubCustomerId",this.searchModel.selectedSubCustomer.id.toString());
    fromData.append("CustomerId",this.searchModel.selectedCustomer.id.toString());
    fromData.append("challanNo",this.searchModel.challanNo.toString());
    debugger
    this.busy = (await this.service.getSalesOrders(ApiEndPoints.GetChallanMasterList, fromData)).subscribe((res:OrderResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      this.basicDataSource = data;
      this.pager.total = res.totalCount;
    });
  }
  beforeEditStart = () => {
    return true;
  };
  
   beforeEditEnd = async (rowItem: any, field: any) => {
    if (rowItem && rowItem[field].length < 3) {
      return false;
    } else {
      return true;
    }
  };
  async getCustomerDropdown() {
    this.busy = (await this.proService.getCustomerDropdown(ApiEndPoints.GetCustomerFoDropdown)).subscribe(async (res:CustomerResponse) => {
      this.customerDropdownList = res.data;
      this.customerList = res.data.map(({ id, customerName }) => ({ id: id, label: customerName }));
    });
  }
  async getList() {
    var fromData = new FormData();
    fromData.append("PageIndex",this.searchModel.pageIndex.toString());
    fromData.append("PageSize",this.searchModel.pageSize.toString());
    this.busy = (await this.SaleInvservice.getChallanMasterListDetails(ApiEndPoints.GetChallanMasterList, fromData))
               .subscribe((res:SalesInvoiceResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      this.basicDataSource = data;
      this.pager.total = res.totalCount;
    });
  }
  async genarateMasterInfo(data:any){
    const customer = this.customerDropdownList.find(x=>x.id == data.id);
    await this.getSubCustomerDropdown(customer.id);
    this.masterData.customerDeliveryAddress = customer?.deliveryAddress??'';
  }

  async viewRow(row: any, index: number) {
    this.busy = (await this.SaleInvservice.GetChallanDetailsList(ApiEndPoints.GetChallanDetailsList, row.id))
                .subscribe((res:SalesInvoiceResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      debugger
      this.listData = data;
    });
    

    this.master = this.basicDataSource.find(x=>x.id==row.id);
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
    this.searchModel.pageIndex = e;
    this.search(this.searchModel);
  }

  onSizeChange(e: number) {
    this.searchModel.pageSize = e;
    this.search(this.searchModel);
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
onRowCheckChange(rowItem: any) {
  this.items.push(rowItem);
}
 
  cancelRequest(){
    this.editForm.modalInstance.hide();
  }

}
