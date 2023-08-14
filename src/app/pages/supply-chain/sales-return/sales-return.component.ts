import { HttpStatusCode } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuConfig, TableWidthConfig, FormLayout, EditableTip, DialogService } from 'ng-devui';
import { Subscription, Observable, of, delay, map } from 'rxjs';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { Branch, BranchResponse } from 'src/app/@core/model/BranchResponse';
import { Customer, CustomerResponse } from 'src/app/@core/model/CustomerResponse';
import { Product, ProductResponse } from 'src/app/@core/model/ProductResponse';
import { SalesInvoiceResponse } from 'src/app/@core/model/SalesInvoiceResponse';
import { DeliveryChallanService } from 'src/app/@core/services/deliveryhallan/delivery-challan.service';
import { ProductService } from 'src/app/@core/services/product/product.service';
import { SalesReturnService } from 'src/app/@core/services/salesreturn/sales-return.service';
import { DFormData } from 'src/app/@shared/components/dynamic-forms';
import { orderPageNotification } from 'src/assets/i18n/en-US/order';

@Component({
  selector: 'app-sales-return',
  templateUrl: './sales-return.component.html',
  styleUrls: ['./sales-return.component.scss']
})
export class SalesReturnComponent implements OnInit{
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
      name: 'Supply Chain'
    },
    {
      linkType: 'routerLink',
      link: 'sales-return',
      name: 'Sales Return'
    }
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
  formData = {
    selectValue: this.selectOptions[1],
    multipleSelectValue: [],
    radioValue: {},
  };

  //Customer Master Data
  masterData = {
    challanDate:new Date,
    selectedCustomer:{},
    customerDeliveryAddress:'',
    selectedBranch:{},
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

  //Product Detail Data
  productRowData = {
    product: '',
    quantity: 0,
    unit: {},
    unitPrice: 0,
    totalPrice: 0,
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


  /// Product Data
  listData : any[] = [];
  productInfo?:Product;
  productList: any[] = [];
  dropdownProductList:any[] = [];


  /// Coustomer Data
  customerInfo!:Customer;
  customerList: any[] = [];
  customerDropdownList:any[] = [];


  /// Branch Data
  branchInfo!:Branch;
  branchList: any[] = [];
  branchDropdownList:any[] = [];

  editableTip = EditableTip.btn;


  constructor(
    private dialogService: DialogService,
    private proService: ProductService,
    private salerReturnService: SalesReturnService,
    private challanService: DeliveryChallanService,
    private router: Router){}

  async ngOnInit() {
    await this.getProductDropdown();
    await this.getCustomerDropdown();
    await this.getBranchDropdown();
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

  async changeGenDisVal(event:boolean){
    if(!event){
      this.masterData.genDiscount = 8;
      await this.genarateMasterInfo(this.customerList);
    }
    else if(event){
      this.masterData.genDiscount = 5;
      await this.genarateMasterInfo(this.customerList);
    }
  }

  addOtherDiscount(val:number){
    this.masterData.netAmount = this.masterData.netAmount - (val/100)*this.masterData.netAmount;
    this.active = true;
  }

  // Key press enter
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.quickRowAdded(this.productRowData);
     
    }
  }
  async getCustomerDropdown() {
    this.busy = (await this.proService.getCustomerDropdown(ApiEndPoints.GetCustomerFoDropdown)).subscribe(async (res:CustomerResponse) => {
      this.customerDropdownList = res.data;
      
      debugger
      this.customerList = res.data.map(({ id, customerName }) => ({ id: id, label: customerName }));
    });
  }
  

  async getBranchDropdown() {
     this.busy = (await this.challanService.getBranchDropdown(ApiEndPoints.GetBranchList)).subscribe((res:BranchResponse) => {
       this.branchDropdownList = res.data;
       debugger
       this.branchList = res.data.map(({ id, branchName }) => ({ id: id, label: branchName }));
     });
   }
  async placeOrder(master:any){
    debugger
    // Append master data
    const formData = new FormData();
      formData.append('ReturnMasterDto.ReturnDate', master.challanDate.toISOString());
      formData.append('ReturnMasterDto.CustomerId', master.selectedCustomer.id.toString());
      formData.append('ReturnMasterDto.BranchId', master.selectedBranch.id.toString());
      formData.append('ReturnMasterDto.deliveryAddress', master.customerDeliveryAddress??'');
      formData.append('ReturnMasterDto.deliveryInstruction', master.deliveryInstruction??'');
      formData.append('ReturnMasterDto.remarks', master.remarks??'');

      // Append list data
      for (let i = 0; i < this.listData.length; i++) {
        const item = this.listData[i];
        formData.append(`ReturnDetailsDtos[${i}].productId`, item.productId.toString());
        formData.append(`ReturnDetailsDtos[${i}].returnQuantity`, item.quantity.toString());
        formData.append(`ReturnDetailsDtos[${i}].unitId`, item.unitId.toString());
        formData.append(`ReturnDetailsDtos[${i}].unitPrice`, item.unitPrice.toString());
      }
      (await this.salerReturnService.createSalesReturn(ApiEndPoints.CreateSalesReturn, formData)).subscribe({
        next: (res: SalesInvoiceResponse) => {
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
            this.router.navigate(['/pages', 'supplychain', 'sales-return-list']);
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
  
  
  async genarateMasterInfo(data:any){
    const customer = this.customerDropdownList.find(x=>x.id == data.id);
    this.masterData.customerDeliveryAddress = customer?.deliveryAddress??'';
  }


  async getProductDropdown() {
    this.busy = (await this.proService.getProductDropdown(ApiEndPoints.GetProductForDropdown)).subscribe((res:ProductResponse) => {
      this.dropdownProductList = res.data;
      this.productList = res.data.map(({ id, productName }) => ({ id: id, label: productName }));
    });
  }

  updateFormConfigOptions() {
    debugger
    //this.formConfig.items.find((item: { prop: string; }) => item.prop === 'category').options = this.categoryDropdown;
  }

  changeProduct(product:any){
    debugger;
    this.productInfo = this.dropdownProductList.find(x=>x.id==product.id);
    this.productRowData.quantity = 1;
    this.productRowData.unitPrice = Number(this.productInfo?.defaultPrice)??0;
    this.productRowData.unit = this.selectUnits.find(x=>x.id == 2)??{};
    this.productRowData.totalPrice = this.productRowData.quantity * this.productRowData.unitPrice;
  }



  genarateTotalPrice(productRowData:any){
    this.productRowData.totalPrice = productRowData.quantity * productRowData.unitPrice;
    debugger
  }

  modifyTotalPrice(event:any,productRow:any){
    debugger;
    if(event.id===1 && productRow.unit.id != 1)
    {
      this.productRowData.unitPrice = this.productRowData.unitPrice * 12;
      this.productRowData.totalPrice = this.productRowData.totalPrice * 12;
    }
    else if(event.id === 2){
      this.productRowData.unitPrice = Number(this.productInfo?.defaultPrice)??0;
      this.productRowData.totalPrice = Number(this.productInfo?.defaultPrice)??0;
    }
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
          map(() => 'success'),
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

  async quickRowAdded(e: any) {
    debugger;
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
  }



  quickRowCancel() {
    this.headerNewForm = false;
  }
  beforeEditStart = (rowItem: any, field: any) => {
    debugger
    return true;
  };

  beforeEditEnd = async (rowItem: any, field: any) => {
    debugger
    var data = {
      id:rowItem.id,
      key:field,
      value:rowItem[field]
    }
    //await this.updatecategory(data);
    if (rowItem && rowItem[field].length < 1) {
      return false;
    } else {
      rowItem.totalPrice = rowItem.quantity*rowItem.unitPrice;
      return true;
    }
  };

  deleteRow(index: number) {
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
            this.listData.splice(index, 1);
            const totalPrice = this.listData.reduce((sum, item) => sum + item.totalPrice, 0);
            this.masterData.totalPrice = totalPrice;
            this.masterData.netAmount =totalPrice - (this.masterData.genDiscount / 100)* totalPrice;
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
            this.listData.splice(index, 1);
            const totalPrice = this.listData.reduce((sum, item) => sum + item.totalPrice, 0);
            this.masterData.totalPrice = totalPrice;
            this.masterData.netAmount =totalPrice - (this.masterData.genDiscount / 100)* totalPrice;
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
startDate:any;
  
  getDay(num: number, str = '-') {
    const day = new Date();
    const nowTime = day.getTime();
    const ms = 24 * 3600 * 1000 * num;
    day.setTime(Math.floor(nowTime + ms));
    const oYear = day.getFullYear();
    let oMoth = (day.getMonth() + 1).toString();
    if (oMoth.length <= 1) { oMoth = '0' + oMoth; }
    let oDay = day.getDate().toString();
    if (oDay.length <= 1) { oDay = '0' + oDay; }
    return oYear + str + oMoth + str + oDay;
  }

  getNextWeekday(num: number, str = '-') {
    const day = this.startDate;
    const nowTime = day.getTime();
    const ms = 24 * 3600 * 1000 * num;
    day.setTime(Math.floor(nowTime + ms));
    const oYear = day.getFullYear();
    let oMoth = (day.getMonth() + 1).toString();
    if (oMoth.length <= 1) { oMoth = '0' + oMoth; }
    let oDay = day.getDate().toString();
    if (oDay.length <= 1) { oDay = '0' + oDay; }
    return oYear + str + oMoth + str + oDay;
  }
}
