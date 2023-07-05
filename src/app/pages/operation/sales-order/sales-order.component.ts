import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, EditableTip, FormLayout, MenuConfig, TableWidthConfig } from 'ng-devui';
import { Observable, Subscription, delay, map, of } from 'rxjs';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { CustomerResponse } from 'src/app/@core/model/CustomerResponse';
import { OrderResponse } from 'src/app/@core/model/OrderResponse';
import { Product, ProductResponse } from 'src/app/@core/model/ProductResponse';
import { OrderService } from 'src/app/@core/services/order/order.service';
import { ProductService } from 'src/app/@core/services/product/product.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';
import { DFormData } from 'src/app/@shared/components/dynamic-forms';
import { orderPageNotification } from 'src/assets/i18n/en-US/order';
import { productPageNotification } from 'src/assets/i18n/en-US/product';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.scss']
})
export class SalesOrderComponent {

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

  OwnerOptions = [
    { id: '1', name: 'Owner1' },
    { id: '2', name: 'Owner2' },
    { id: '3', name: 'Owner3' },
    { id: '4', name: 'Owner4' },
  ];
  ExecutorOptions = [
    { id: '1', name: 'Executor1' },
    { id: '2', name: 'Executor2' },
    { id: '3', name: 'Executor3' },
    { id: '4', name: 'Executor4' },
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
      id: 1,
      label: 'Pcs',
    },
    {
      id: 2,
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
    orderDate:new Date,
    estimatedDeliveryDate: new Date,
    selectedCustomer:{},
    totalPrice: 0,
    pdc:true,
    genDiscount:8,
    otherDiscount:0,
    netAmount:0,
    deliveryInstruction:'',
    deliveryAddress:'',
    remarks:''
  }
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
  existProjectNames = ['123', '123456', 'DevUI'];
  formItems: DFormData = {};
  selectedDate2 = new Date;
  toastMessage:any;
  busy !: Subscription;
  data:any;
  listData : any[] = [];
  productInfo?:Product;
  productList: any[] = [];
  customerList: any[] = [];
  dropdownProductList:any[] = [];
  customerDropdownList:any[] = [];
  editableTip = EditableTip.btn;
  constructor(
    private dialogService: DialogService,
    private service: OrderService,
    private proService: ProductService,
    private router: Router,){}
  async ngOnInit() {
    await this.getProductDropdown();
    await this.getCustomerDropdown();
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
      this.masterData.genDiscount = 5;
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

  async placeOrder(master:any){
    const masterData = this.createFormData(master);
    const products = this.createFormData(this.listData);
    debugger
    // Append master data
    const formData = new FormData();
      formData.append('salesOrderMasterDto.customerId', master.selectedCustomer.id.toString());
      formData.append('salesOrderMasterDto.deliveryAddress', master.deliveryAddress);
      formData.append('salesOrderMasterDto.deliveryInstruction', master.deliveryInstruction);
      formData.append('salesOrderMasterDto.orderDate', master.orderDate.toISOString());
      formData.append('salesOrderMasterDto.netAmount', master.netAmount.toString());
      formData.append('salesOrderMasterDto.basicDiscount', master.genDiscount.toString());
      formData.append('salesOrderMasterDto.otherDiscount', master.otherDiscount.toString());
      formData.append('salesOrderMasterDto.estimatedDeliveryDate', master.estimatedDeliveryDate.toISOString());
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
      (await this.service.createOrder(ApiEndPoints.CreateSales, formData)).subscribe({
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
            this.router.navigate(['/pages', 'user', 'center']);
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
    const totalPrice = this.listData.reduce((sum, item) => sum + item.totalPrice, 0);
    this.masterData.netAmount =totalPrice - (this.masterData.genDiscount / 100)* totalPrice;
    this.masterData.totalPrice = totalPrice;
    debugger

  }
  async getCustomerDropdown() {
    this.busy = (await this.proService.getCustomerDropdown(ApiEndPoints.GetCustomerFoDropdown)).subscribe((res:CustomerResponse) => {
      this.customerDropdownList = res.data;
      this.customerList = res.data.map(({ id, customerName }) => ({ id: id, label: customerName }));;
    });
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
    this.productInfo = this.dropdownProductList.find(x=>x.id==product.id);
    this.productRowData.quantity = 1;
    this.productRowData.unitPrice = Number(this.productInfo?.defaultPrice)??0;
    this.productRowData.unit = this.selectUnits.find(x=>x.id == 1)??{};
    this.productRowData.totalPrice = this.productRowData.quantity * this.productRowData.unitPrice;
  }

  genarateTotalPrice(productRowData:any){
    this.productRowData.totalPrice = productRowData.quantity * productRowData.unitPrice;
    debugger
  }

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
  checkName(value: string) {
    let res = true;
    if (this.existProjectNames.indexOf(value) !== -1) {
      res = false;
    }
    return of(res).pipe(delay(500));
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
    const totalPrice = this.listData.reduce((sum, item) => sum + item.totalPrice, 0);
    this.masterData.netAmount =totalPrice - (this.masterData.genDiscount / 100)* totalPrice;
    this.masterData.totalPrice = totalPrice;
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
}
