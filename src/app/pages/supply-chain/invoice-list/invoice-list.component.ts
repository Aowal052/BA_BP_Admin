import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { CustomerService } from 'src/app/@core/services/customer/customer.service';
import { DeliveryChallanService } from 'src/app/@core/services/deliveryhallan/delivery-challan.service';
import { OrderService } from 'src/app/@core/services/order/order.service';
import { ProductService } from 'src/app/@core/services/product/product.service';
import { SalesInvoiceService } from 'src/app/@core/services/salesinvoice/sales-invoice.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit{
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
      link: 'invoice-list',
      name: 'Invoice List'
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
  discount !:any[];
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
  
  @ViewChild('pdfContent') pdfContent!: ElementRef;
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
  datePicker2:any;
  subCustomerList: any[] = [];
  subCustomerDropdownList:any[] = [];
  disabled = true;
  currentDate = new Date();
  searchModel = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    fromDate: new Date(this.currentDate.getFullYear(),this.currentDate.getMonth()-1,this.currentDate.getDate()),
    toDate: new Date(),
    challanNo:'',
    invoiceNo:'',
    selectedCustomer:{id:0,label:''},
    selectedSubCustomer:{id:0,label:''},
  }
  StatusOptions = ['Approved', 'Rejected'];
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
  netPriceinfo = [{
    netTotal:0,
    netPriceInText:''
  }];
  appendToBodyDirections: AppendToBodyDirection[] = ['centerDown', 'centerUp'];
  constructor(
    private listDataService: ListDataService, 
    private cusService:CustomerService,
    private challanService:DeliveryChallanService,
    private comService: CommonService,
    private SaleInvservice:SalesInvoiceService,
    private dialogService: DialogService, 
    private cdr: ChangeDetectorRef,
    private router: Router,) {}

    ngOnInit() {
      this.getList();
      this.getCustomerDropdown();
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
    async getCustomerDropdown() {
      this.busy = (await this.cusService.getCustomerDropdown(ApiEndPoints.GetCustomerFoDropdown)).subscribe(async (res:CustomerResponse) => {
        this.customerDropdownList = res.data;
        this.customerList = res.data.map(({ id, customerName }) => ({ id: id, label: customerName }));
      });
    }
    async genarateMasterInfo(data:any){
      const customer = this.customerDropdownList.find(x=>x.id == data.id);
      await this.getSubCustomerDropdown(customer.id);
      this.masterData.customerDeliveryAddress = customer?.deliveryAddress??'';
    }
    async getSubCustomerDropdown(id: any) {
      debugger
       this.busy = (await this.challanService.getChallanSubCustomerDropdown(ApiEndPoints.GetSuCustomerFoDropdown,id)).subscribe((res:SubCustomerResponse) => {
         this.subCustomerDropdownList = res.data;
         this.subCustomerList = res.data.map(({ id, customerName }) => ({ id: id, label: customerName }));
       });
     }
    getValue(value:any) {
      console.log(value);
    }
    async getList() {
      debugger
      var formData = new FormData();
      formData.append("PageIndex",this.searchModel.pageIndex.toString());
      formData.append("PageSize",this.searchModel.pageSize.toString());
      formData.append("FromDate", this.searchModel.fromDate.toLocaleDateString(undefined, this.comService.dateFormate));
      formData.append("Todate",this.searchModel.toDate.toLocaleDateString(undefined, this.comService.dateFormate));
      formData.append("SubCustomerId",this.searchModel.selectedSubCustomer.id.toString());
      formData.append("CustomerId",this.searchModel.selectedCustomer.id.toString());
      formData.append("challanNo",this.searchModel.challanNo.toString());
      formData.append("InvoiceNo",this.searchModel.invoiceNo.toString());

      this.busy = (await this.SaleInvservice.getChallanMasterListDetails(ApiEndPoints.GetInvoiceMaster, formData))
                 .subscribe((res:SalesInvoiceResponse) => {
        const data = JSON.parse(JSON.stringify(res.data));
        this.basicDataSource = data;
        this.pager.total = res.totalCount;
      });
    }
    async genarateSubInfo(data:any){
      const customer = this.customerDropdownList.find(x=>x.id == data.id);
      debugger
      await this.getSubCustomerDropdown(customer.id);
      this.masterData.customerDeliveryAddress = customer?.deliveryAddress??'';
    }
    async viewRow(row: any, index: number) {
      this.busy = (await this.SaleInvservice.GetChallanDetailsList(ApiEndPoints.GetInvoiceDetails, row.id))
                  .subscribe((res:SalesInvoiceResponse) => {
        const data = JSON.parse(JSON.stringify(res.data));
        debugger
        this.listData = data;
        this.netPriceinfo[0].netTotal =this.listData.reduce((total,item)=>total+item.totalPrice,0)
        this.netPriceinfo[0].netTotal  = this.netPriceinfo[0].netTotal - (this.netPriceinfo[0].netTotal * this.basicDataSource[0].generalDiscount)/100;
      });
      this.busy = (await this.SaleInvservice.GetChallanDetailsList(ApiEndPoints.GetDiscountByInvoiceId, this.basicDataSource[0].id))
                  .subscribe(async (res:SalesInvoiceResponse) => {
        const data = JSON.parse(JSON.stringify(res.data));
        this.discount = data;
      
        this.discount.forEach(discount => {
          this.netPriceinfo[0].netTotal  = discount.discountType =="Percent" ? (this.netPriceinfo[0].netTotal - (this.netPriceinfo[0].netTotal * discount.discountValue)/100):(this.netPriceinfo[0].netTotal -  parseFloat(discount.discountValue));
        });
      });
      debugger
      this.netPriceinfo[0].netPriceInText = await this.comService.convertNumberToText(this.netPriceinfo[0].netTotal)
      this.master = this.basicDataSource.find(x=>x.id==row.id);
      this.editRowIndex = index;
      this.formData = row;
      this.editForm = this.dialogService.open({
        id: 'edit-dialog',
        width: '1000px',
        maxHeight: 'auto',
        title: 'Sales Invoice',
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
      this.getList();
    }
  
    onSizeChange(e: number) {
      this.searchModel.pageSize = e;
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
    // calculateTotalPrice(rowItem: any): number {
    //   debugger
    //   return rowItem.reduce((total:number, item:any) => total + item.totalPrice, 0);
    // }
  
    
  items: Array<any> = [];
  onRowCheckChange(checked: boolean, rowIndex: number, nestedIndex: string, rowItem: any) {
    this.items.push(rowItem);
  }
   
    cancelRequest(){
      this.editForm.modalInstance.hide();
    }
    generatePDF(): void {
      const DATA: any = document.getElementById('pdfContent');
      const scale = 5; // Increase the scale factor for higher resolution

      html2canvas(DATA, { scale: scale }).then((canvas) => {
        const fileWidth = 208;
        const fileHeight = (canvas.height * fileWidth) / canvas.width;
        const FILEURI = canvas.toDataURL('image/png');
        const PDF = new jsPDF('p', 'mm', 'a4');
        // Calculate the horizontal centering position
        const xPos = 10;//(PDF.internal.pageSize.getWidth() - fileWidth) / 2;

        // Calculate the vertical position (no top margin)
        const yPos =  10//(PDF.internal.pageSize.getHeight() - fileHeight) / 2;
        PDF.addImage(FILEURI, 'PNG', xPos, yPos, fileWidth, fileHeight);
        PDF.save('angular-demo.pdf');
      });
    }
}



