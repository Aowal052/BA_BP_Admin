import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormLayout, TableWidthConfig, MenuConfig, EditableTip, DialogService } from 'ng-devui';
import { AppendToBodyDirection } from 'ng-devui/utils';
import { Subscription } from 'rxjs';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
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
import { SalesReturnService } from 'src/app/@core/services/salesreturn/sales-return.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';

@Component({
  selector: 'app-sales-return-list',
  templateUrl: './sales-return-list.component.html',
  styleUrls: ['./sales-return-list.component.scss']
})
export class SalesReturnListComponent {

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
      link: 'sales-return-list',
      name: 'Sales Return List'
    }
  ];

  basicDataSource: any[] = [];

 
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
    returnNo:'',
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
    private salesReturnService: SalesReturnService,
    private challanService: DeliveryChallanService,
    private SaleInvservice:SalesInvoiceService,
    private comService: CommonService,
    private proService:ProductService,
    private dialogService: DialogService,) {}

  ngOnInit() {
    this.search(this.searchModel);
    this.getCustomerDropdown();
  }
 
   async search(model:any) {
    var fromData = new FormData();
    fromData.append("PageNumber",this.searchModel.pageIndex.toString());
    fromData.append("PageSize",this.searchModel.pageSize.toString());
    fromData.append("FromDate", this.searchModel.fromDate.toLocaleDateString(undefined, this.comService.dateFormate));
    fromData.append("Todate",this.searchModel.toDate.toLocaleDateString(undefined, this.comService.dateFormate));
    fromData.append("CustomerId",this.searchModel.selectedCustomer.id.toString());
    fromData.append("ReturnNo",this.searchModel.returnNo.toString());
    debugger
    this.busy = (await this.salesReturnService.getSalesReturnMasterList(ApiEndPoints.GetSalesReturnMasterList, fromData))
                .subscribe((res:SalesInvoiceResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      debugger
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
    this.busy = (await this.salesReturnService.getSalesReturnMasterList(ApiEndPoints.GetSalesReturnMasterList, fromData))
               .subscribe((res:SalesInvoiceResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      this.basicDataSource = data;
      this.pager.total = res.totalCount;
    });
  }
  async genarateMasterInfo(data:any){
    const customer = this.customerDropdownList.find(x=>x.id == data.id);
    //await this.getSubCustomerDropdown(customer.id);
    this.masterData.customerDeliveryAddress = customer?.deliveryAddress??'';
  }

  async viewRow(row: any, index: number) {
    this.busy = (await this.salesReturnService.GetSalesReturnDetailsList(ApiEndPoints.GetSalesReturnDetailsList, row.id))
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
