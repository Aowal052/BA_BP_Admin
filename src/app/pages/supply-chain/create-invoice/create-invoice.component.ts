import { HttpStatusCode } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, EditableTip, FormLayout, MenuConfig, TableWidthConfig } from 'ng-devui';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/@core/data/listData';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { ListDataService } from 'src/app/@core/mock/list-data.service';
import { GatePassResponse } from 'src/app/@core/model/GatePassResponse';
import { Product } from 'src/app/@core/model/ProductResponse';
import { SalesInvoiceResponse } from 'src/app/@core/model/SalesInvoiceResponse';
import { CommonService } from 'src/app/@core/services/CommonService';
import { GatePassService } from 'src/app/@core/services/gatepass/gate-pass.service';
import { OrderService } from 'src/app/@core/services/order/order.service';
import { ProductService } from 'src/app/@core/services/product/product.service';
import { SalesInvoiceService } from 'src/app/@core/services/salesinvoice/sales-invoice.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';
import { orderPageNotification } from 'src/assets/i18n/en-US/order';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit{

  filterAreaShow = false;
  columnsLayout: FormLayout = FormLayout.Columns;
  multipleSelectConfig: any;
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
      field: 'Order Qnty',
      width: '100px',
    },
    {
      field: 'Unit',
      width: '100px',
    },
    {
      field: 'Unit Rate',
      width: '100px',
    },
    {
      field: 'Delivery Quny',
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
    challanNo:0,
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
  }

  search() {
    this.getList();
  }
  beforeEditStart = (rowItem: any, field: any) => {
    return true;
  };
  
   beforeEditEnd = async (rowItem: any, field: any) => {
    if (rowItem && rowItem[field].length < 3) {
      return false;
    } else {
      return true;
    }
  };
  
  async getList() {
    debugger;
    this.busy = (await this.SaleInvservice.getChallanMasterListDetails(ApiEndPoints.GetChallanMasterList, this.pager))
               .subscribe((res:SalesInvoiceResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      this.basicDataSource = data;
      this.pager.total = res.totalCount;
    });
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
    debugger
    rowItem.$checked = checked;
    rowItem.$halfChecked = false;
    
    checked?this.items.push(rowItem):this.items.splice(rowIndex,1)
  }
  async placeOrder(){
    debugger;
  
      localStorage.setItem('myData', JSON.stringify(this.items));
    //
    this.router.navigate(['/pages', 'supplychain', 'invoice-create-data-list']); 
   
      
  }
  cancelRequest(){
    this.editForm.modalInstance.hide();
  }
}
