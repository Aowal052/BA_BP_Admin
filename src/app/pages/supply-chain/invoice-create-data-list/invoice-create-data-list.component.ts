import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { number } from 'echarts';
import { DialogService, EditableTip, FormLayout, MenuConfig, TableWidthConfig } from 'ng-devui';
import { Observable, Subscription, delay, map, of } from 'rxjs';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { Customer, CustomerResponse } from 'src/app/@core/model/CustomerResponse';
import { Discount, DiscountResponse } from 'src/app/@core/model/DiscontResponse';
import { InvoiceResponse } from 'src/app/@core/model/InvoiceResponse';
import { OrderResponse } from 'src/app/@core/model/OrderResponse';
import { Product, ProductResponse } from 'src/app/@core/model/ProductResponse';
import { CommonService } from 'src/app/@core/services/CommonService';
import { CustomerService } from 'src/app/@core/services/customer/customer.service';
import { InvoiceService } from 'src/app/@core/services/invoice/invoice.service';
import { OrderService } from 'src/app/@core/services/order/order.service';
import { ProductService } from 'src/app/@core/services/product/product.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';
import { DFormData } from 'src/app/@shared/components/dynamic-forms';
import { orderPageNotification } from 'src/assets/i18n/en-US/order';

@Component({
  selector: 'app-invoice-create-data-list',
  templateUrl: './invoice-create-data-list.component.html',
  styleUrls: ['./invoice-create-data-list.component.scss']
})
export class InvoiceCreateDataListComponent {
  projectFormData = {
    projectName: '',
    projectOwner: null,
    projectExecutor: null,
    projectLabels: [],
    projectCycleTime: [null, null],
    isPublic: true,
    projectExerciseDate: [{ id: '1', label: 'Mon' }],
  };
  breadItem: Array<MenuConfig> = [
    {
      linkType: 'hrefLink',
      link: '',
      name: 'Home'
    },
    {
      linkType: 'routerLink',
      link: './home',
      name: 'Operation'
    },
    {
      linkType: 'routerLink',
      link: 'create-sales',
      name: 'Create Order'
    }
  ];

  DiscountOptions = [
    { id: '1', name: 'Online Discount' },
    { id: '2', name: 'Depot Maintanence' },
    { id: '3', name: 'Special Cost' },
    { id: '4', name: 'Eid Offer' },
    { id: '5', name: 'Promotional Offer' },
  ];
  labelList = [
    {
      id: 1,
      label: 'OpenSource',
    },
    {
      id: 2,
      label: 'Admin',
    },
    {
      id: 3,
      label: 'DevUI',
    },
  ];

  securityValue = [
    {
      name: 'Public',
    },
    {
      name: 'Only member visible',
    },
  ];
  multipleSelectConfig: any;
  checkboxOptions = [
    { id: '1', label: 'Mon', checked: true },
    { id: '2', label: 'Tue' },
    { id: '3', label: 'Wed' },
    { id: '4', label: 'Thur' },
    { id: '5', label: 'Fri' },
    { id: '6', label: 'Sat' },
    { id: '0', label: 'Sun' },
  ];
  addedLabelList = [];
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
  radioOptions = [
    {
      id: 7,
      label: 'Public',
    },
    {
      id: 8,
      label: 'Only members visible',
    },
    {
      id: 9,
      label: 'private',
    },
  ];
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
  tableWidthConfig: TableWidthConfig[] = [
    {
      field: 'productName',
      width: '100px',
    },
    {
      field: 'Quantity',
      width: '200px',
    },
    {
      field: 'Unit',
      width: '200px',
    },
    {
      field: 'price',
      width: '150px',
    },
    {
      field: 'Actions',
      width: '150px',
    },
  ];
  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    labelSize: 'sm',
    items: [
      {
        label: 'product Name',
        prop: 'productName',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'product Code',
        prop: 'productCode',
        type: 'input',
      },
      {
        label: 'description',
        prop: 'description',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'price',
        prop: 'price',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
    ],
  };
  formData = {
    selectValue: this.selectOptions[1],
    multipleSelectValue: [],
    radioValue: {},
  };
  masterData = {
    selectedCustomer:{},
    genDiscount:0,
    orderAmDiscount:0,
    otherDiscount:0,
    netAmount:0,
    deliveryInstruction:'',
    deliveryAddress:'',
    remarks:''
  }
  invoiceMasterData = {
    selectedCustomer: { id: 0, label: '' },
    genDiscount:0,
    orderAmDiscount:0,
    otherDiscount:0,
    netAmount:0,
    challanNo:'',
    address:'',
    defaultDiscount:0,
    remarks:''
  }
  productRowData = {
    productId: 0,
    product: '',
    delQuantity: 0,
    unit: {},
    unitId:0,
    totalPrice: 0,

  };

  discountRowData = {
    discount: '',
    discountType: '',
    discountAmnt: 0,
  };

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
  active = false;
  headerNewForm = false;
  columnsLayout: FormLayout = FormLayout.Columns;
  msgs: Array<Object> = [];
 
  formItems: DFormData = {};
  selectedDate2 = new Date;
  toastMessage:any;
  busy !: Subscription;
  data:any;
  productRowDataList!: any[];
  discountListData : any[] = [];
  discountInfo?:Discount;
  dropdownDiscountList:any[] = [];
  discountList: any[] = [];
  invoiceMaster!:any[];
  listData : any[] = [];
  netPriceinfo = [{
    netTotal:0
  }];
  productInfo?:Product;
  productList: any[] = [];
  customerInfo!:Customer;
  customerList: any[] = [];
  dropdownProductList:any[] = [];
  customerDropdownList:any[] = [];

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  editableTip = EditableTip.btn;
  constructor(
    private dialogService: DialogService,
    private service: OrderService,
    private InvoiceService: InvoiceService,
    private proService: ProductService,
    private custService: CustomerService,
    private router: Router,
    private comService:CommonService){}
  async ngOnInit() {
    await this.getDiscountDropdown();
    await this.viewRow();
    this.multipleSelectConfig = {
      key: 'multipleSelect',
      label: 'Options(Multiple selection with delete)',
      isSearch: true,
      multiple: 'true',
      labelization: { enable: true, labelMaxWidth: '120px' },
      options: this.selectOptions,
    };
  }

  async newRow() {
    this.headerNewForm = true;
    this.updateFormConfigOptions();
  }


  async placeOrder(master:any){

    debugger
    // Append master data
    const formData = new FormData();
      formData.append('InvoiceMasterDto.customerId', this.invoiceMasterData.selectedCustomer.id.toString());
      formData.append('InvoiceMasterDto.ChallanNo', this.invoiceMasterData.challanNo);
      formData.append('InvoiceMasterDto.NetAmount', this.netPriceinfo[0].netTotal.toString());

      // Append list data
      for (let i = 0; i < this.listData.length; i++) {
        const item = this.listData[i];
        formData.append(`InvoiceDetailsDtos[${i}].productId`, item.productId.toString());
        formData.append(`InvoiceDetailsDtos[${i}].quantity`, item.deliveryQuantity.toString());
        formData.append(`InvoiceDetailsDtos[${i}].unitId`, item.unitId.toString());
        formData.append(`InvoiceDetailsDtos[${i}].totalPrice`, item.deliveryPrice.toString());
      }

      // Append Discount Data data
      for (let i = 0; i < this.discountListData.length; i++) {
        const item = this.discountListData[i];
        formData.append(`SalesOrderDiscountDtos[${i}].discountId`, item.discountId.toString());
        formData.append(`SalesOrderDiscountDtos[${i}].discountAmount`, item.discountAmnt.toString());
       
      }

      (await this.InvoiceService.createInvoice(ApiEndPoints.CreateInvoice, formData)).subscribe({
        next: (res: OrderResponse) => {
          debugger
          this.data = res;
          if (this.data.statusCode == HttpStatusCode.Ok) {
            this.headerNewForm = false;
            this.toastMessage = [
              {
                severity: 'success',
                summary: orderPageNotification.orderPage.createMessage.summary,
                content: orderPageNotification.orderPage.createMessage.addSuccess,
              },
            ];
            this.router.navigate(['/pages', 'supplychain', 'invoice-list']);
          }
        },
        error: (error) => {
          debugger
          this.toastMessage = [
            {
              severity: 'error',
              summary: orderPageNotification.orderPage.createMessage.summary,
              content: error.error.error,
            },
          ];
        }
      });
      
  }

  convertObjectKeysToCamelCase(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(this.convertObjectKeysToCamelCase);
    }

    const camelCaseObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        camelCaseObj[camelCaseKey] = this.convertObjectKeysToCamelCase(value);
      }
    }

    return camelCaseObj;
  }

  createFormData(arrayData: any[]): FormData {
    const formData = new FormData();
  
    // Check if arrayData is an array
    if (Array.isArray(arrayData)) {
      // Append the array data to the FormData
      arrayData.forEach((item: any, index: number) => {
        const itemKey = `arrayData[${index}]`;
        const convertedItem = this.convertObjectKeysToCamelCase(item);
  
        for (const key in convertedItem) {
          const value = convertedItem[key];
          const fieldKey = `${itemKey}.${key}`;
  
          formData.append(fieldKey, value);
        }
      });
    }
  
    return formData;
  }
  
  async getDiscountDropdown() {
    this.busy = (await this.proService.getDiscountDropdown(ApiEndPoints.GetDiscountList)).subscribe((res:DiscountResponse) => {
      this.dropdownDiscountList = res.data;
      debugger
      this.discountList = res.data.map(({ id, discountName,discountType }) => ({ id: id, label: discountName, discountType:discountType }));
    });
  }



  updateFormConfigOptions() {
    debugger
  }
  changeDiscount(discount:any){
     this.discountInfo = this.dropdownDiscountList.find( x=>x.id == discount.id);
     this.discountRowData.discountAmnt = 1;
     debugger;
     this.discountRowData.discountType = this.discountInfo?.discountType ?? '';
     
  }


  getValue(value:any) {
    console.log(value);
  }

  validateDate(value: any): Observable<any | null> {
    let message = null;
    for (const item of value) {
      if (item.id === '2') {
        message = {
          'en-us': 'The task queue on the current execution day (Tuesday) is full.',
        };
      }
    }
    return of(message).pipe(delay(300));
  }
 
  submitProjectForm({ valid }: any) {
    if (valid) {
      of(this.formItems)
        .pipe(
          map((val) => 'success'),
          delay(500)
        )
        .subscribe((res) => {
          if (res === 'success') {
            this.showToast('success', 'Success', 'Registration succeeded.');
          }
        });
    } else {
      this.showToast('error', 'Error', 'Check whether all validation items pass.');
    }
  }
  showToast(type: any, title: string, msg: string) {
    this.msgs = [{ severity: type, summary: title, detail: msg }];
  }

  async quickRowAddedDiscount(e: any) {
    debugger;
    e.discountName = e.discount.label;
    e.discountType = e.discount.discountType;
    e.discountAmnt = e.discountAmnt;
    e.discountId = e.discount.id;
    // Check if product.id already exists in this.listData
    const discountExists = this.discountListData.some((item) => item.discountId === e.discountId);
  
    if (discountExists) {
      this.showToast('error', 'Error', 'Your discount alredy is in the list.');
      return;
    }
    debugger
    this.netPriceinfo[0].netTotal = e.discountType == 'Percent'?  (this.netPriceinfo[0].netTotal - (this.netPriceinfo[0].netTotal * e.discountAmnt)/100):(this.netPriceinfo[0].netTotal -  e.discountAmnt);
  
    const newData = { ...e };
    this.discountListData.unshift(newData);
  }

  deleteRowDiscount(index: number) {
    debugger
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
          handler: () => {
            const depricatedData = this.discountListData[index];
            this.discountListData.splice(index, 1);
            //const totalPrice =this.listData.reduce((total,item)=>total+item.deliveryPrice,0);
            
            this.netPriceinfo[0].netTotal =this.listData.reduce((total,item)=>total+item.deliveryPrice,0)
            this.discountListData = this.discountListData.reverse();
            this.discountListData.forEach(discount => {
              this.netPriceinfo[0].netTotal  = discount.discountType =="Percent" ? (this.netPriceinfo[0].netTotal - (this.netPriceinfo[0].netTotal * discount.discountAmnt)/100):(this.netPriceinfo[0].netTotal -  parseFloat(discount.discountAmnt));
            });
            
            results.modalInstance.hide();
          },
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: 'Cancel',
          handler: () => {
            results.modalInstance.hide();
          },
        },
      ],
    });
  }

  quickRowCancel() {
    this.headerNewForm = false;
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

  
  retrievedItem: any;
  invoiceIds: Array<any> = [];
  async viewRow() {
    
   debugger;
    this.retrievedItem = JSON.parse(localStorage.getItem('CustomerList')??'');
    
    var formdata = new FormData();
    for(var i=0;i<=this.retrievedItem .length-1;i++){
      formdata.append(`MasterId[${i}]`,this.retrievedItem[i].id.toString());
    }
      
    this.invoiceMasterData.selectedCustomer.label = this.retrievedItem[0].customerName;
    this.invoiceMasterData.challanNo = this.retrievedItem.map((item: { challanNo: any; }) => item.challanNo).join(', ');
    this.invoiceMasterData.address = this.retrievedItem[0].customerAddress;
    this.invoiceMasterData.defaultDiscount = this.retrievedItem[0].generalDiscount;
    this.invoiceMasterData.selectedCustomer.id = this.retrievedItem[0].customerId;
    this.busy = (await this.InvoiceService.getInvoiceDetailCreateById(ApiEndPoints.GetInvoiceDetailCreateById, formdata))
               .subscribe(async (res: InvoiceResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      debugger;
      this.listData = data;
      this.netPriceinfo[0].netTotal = this.listData.reduce((total,item)=>total+item.deliveryPrice,0);

       this.netPriceinfo[0].netTotal  = this.netPriceinfo[0].netTotal- (this.netPriceinfo[0].netTotal * this.retrievedItem[0].generalDiscount) / 100
    });
  }
}
