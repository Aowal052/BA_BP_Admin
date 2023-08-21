import { HttpStatusCode } from '@angular/common/http';
import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, EditableTip, FormLayout, MenuConfig, SelectComponent, TableWidthConfig } from 'ng-devui';
import { Observable, Subscription, delay, map, of } from 'rxjs';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { CustomerReamingChallanQntyResponse } from 'src/app/@core/model/CustomerReamingChallanQntyResponse';
import { Customer, CustomerResponse } from 'src/app/@core/model/CustomerResponse';
import { Discount, DiscountResponse } from 'src/app/@core/model/DiscontResponse';
import { OrderResponse } from 'src/app/@core/model/OrderResponse';
import { PriecConfig, PriecConfigResponse } from 'src/app/@core/model/PriecConfigResponse';
import { Product, ProductResponse } from 'src/app/@core/model/ProductResponse';
import { CommonService } from 'src/app/@core/services/CommonService';
import { CustomerService } from 'src/app/@core/services/customer/customer.service';
import { OrderService } from 'src/app/@core/services/order/order.service';
import { ProductService } from 'src/app/@core/services/product/product.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';
import { DFormData } from 'src/app/@shared/components/dynamic-forms';
import { orderPageNotification } from 'src/assets/i18n/en-US/order';

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
    orderDate:new Date,
    estimatedDeliveryDate: new Date,
    selectedCustomer:{},
    selectedDiscount:{},
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
  productRowData = {
    product: {id:0,label:''},
    quantity: 0,
    unit: {id:0,label:''},
    unitPrice: 0,
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
  //discountTypes = ['Online Discount', 'Eid Discount', 'Special Discount'];
  formItems: DFormData = {};
  selectedDate2 = new Date;
  toastMessage:any;
  busy !: Subscription;
  data:any;

  discountListData : any[] = [];
  discountInfo?:Discount;
  dropdownDiscountList:any[] = [];
  discountList: any[] = [];
  priceConfigInfo!:PriecConfig;
  priceConfigList:any[] = [];

  listData : any[] = [];
  productInfo!:Product;
  productList: any[] = [];
  customerInfo!:Customer;
  customerList: any[] = [];
  dropdownProductList:any[] = [];
  customerDropdownList:any[] = [];
  startDate = new Date();
  datePicker2: any;
  endDate = null;
  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  @ViewChild('tabInput')
  tabInput!: ElementRef;
  editableTip = EditableTip.btn;
  constructor(
    private renderer: Renderer2,
    private dialogService: DialogService,
    private service: OrderService,
    private proService: ProductService,
    private custService: CustomerService,
    private router: Router,
    private comService:CommonService){}
  async ngOnInit() {
    await this.getProductDropdown();
    await this.getDiscountDropdown();
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


  @ViewChild('productNameDropdown') productNameDropdown!: SelectComponent;


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.quickRowAdded(this.productRowData);
      this.productNameDropdown.toggle();
    }
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
  async getProductDropdown() {
    this.busy = (await this.proService.getProductDropdown(ApiEndPoints.GetProductForDropdown)).subscribe((res:ProductResponse) => {
      this.dropdownProductList = res.data;
      this.productList = res.data.map(({ id, productName,shortName,reamingOpeningQuantity }) => ({ id: id, label: productName + "("+reamingOpeningQuantity+")",shortName:shortName??'test' }));
    });
  }
  onSelectObject = (term: string) => {
    debugger
    return of(
      this.productList
        .map((option, index) => ({ id: index, option: option }))
        .filter((item) => item.option.shortName.toLowerCase().indexOf(term.toLowerCase()) !== -1)
    );
  };
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
      formData.append('salesOrderMasterDto.GeneralDiscount', master.genDiscount.toString());
      //formData.append('salesOrderMasterDto.OrderAmountDiscount', master.orderAmDiscount.toString());
      //formData.append('salesOrderMasterDto.DiscountTypes', master.selectedDiscount.name.toString());
      //formData.append('salesOrderMasterDto.OtherDiscount', master.otherDiscount.toString());
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
    debugger;
    const customer = this.customerDropdownList.find(x=>x.id == data.id);
    await this.CustomerReamingChallanQnty(data);
    const totalPrice = this.listData.reduce((sum, item) => sum + item.totalPrice, 0);
    this.masterData.netAmount =totalPrice - (this.masterData.genDiscount / 100)* totalPrice;
    this.masterData.totalPrice = totalPrice;
    this.busy = (await this.custService.getCustomerById(ApiEndPoints.GetCustomerById,data.id)).subscribe((res:CustomerResponse) => {
      this.customerInfo = res.data[0];
      
      const totalPrice = this.listData.reduce((sum, item) => sum + item.totalPrice, 0);
      this.masterData.netAmount =totalPrice - (this.customerInfo.defaultDiscount / 100)* totalPrice;
      this.masterData.totalPrice = totalPrice;
      this.masterData.genDiscount = this.customerInfo.defaultDiscount;
      //var discount = this.comService.getDiscountByParcent(this.masterData.netAmount)
      //this.masterData.netAmount =this.masterData.netAmount - (discount / 100)* this.masterData.netAmount;
      //this.masterData.orderAmDiscount = discount;
    });

  }

  async CustomerReamingChallanQnty(data:any){
    debugger
    var fromData = new FormData();
    fromData.append("CustomerId", data.id.toString());
    this.busy = (await this.service.CustomerReamingChallanQnty(ApiEndPoints.GetCustomerReamingChallanQnty, fromData)).subscribe((res: CustomerReamingChallanQntyResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      debugger
      this.quickRowAddedCustomerReamingChallanQnty(data);
      this.priceConfigInfo =data;
    });
  }

  async quickRowAddedCustomerReamingChallanQnty(e: any) {
    debugger;
    for (let i = 0; i < e.length; i++) {
      const item = e[i];
      e.unitName = e[i].unitName;
      e.productName = e[i].productName;
      e.unitId = e[i].unitId;
      e.productId = e[i].productId;
      e.quantity = e[i].quantity;
      e.unitPrice = e[i].unitPrice;
      e.totalPrice = e[i].totalPrice;
      debugger;

      // Check if product.id already exists in this.listData
      const productExists = this.listData.some((item) => item.productId === e.productId);
    
      if (productExists) {
        this.showToast('error', 'Error', 'Your product alredy is in the list.');
        return;
      }
    
      const newData = { ...e };
      this.listData.unshift(newData);
      
    }
   
  }

  async getCustomerDropdown() {
    this.busy = (await this.proService.getCustomerDropdown(ApiEndPoints.GetCustomerFoDropdown)).subscribe((res:CustomerResponse) => {
      this.customerDropdownList = res.data;
      debugger
      this.customerList = res.data.map(({ id, customerName }) => ({ id: id, label: customerName }));
    });
  }

  async getDiscountDropdown() {
    this.busy = (await this.proService.getDiscountDropdown(ApiEndPoints.GetDiscountList)).subscribe((res:DiscountResponse) => {
      this.dropdownDiscountList = res.data;
      debugger
      this.discountList = res.data.map(({ id, discountName }) => ({ id: id, label: discountName }));
    });
  }


  updateFormConfigOptions() {
    debugger
    //this.formConfig.items.find((item: { prop: string; }) => item.prop === 'category').options = this.categoryDropdown;
  }

  changeProduct(product:any){
    debugger
    this.productInfo = this.dropdownProductList.find(x=>x.id==product.id);
    const unit = this.selectUnits.find(x=>x.id==this.productInfo.activeUnitId);
    this.productRowData.quantity = 1;
    this.productRowData.unit = {id:Number(unit?.id),label:unit?.label??''};
    this.productRowData.unitPrice = this.productRowData.unit.id==1?Number(this.productInfo?.dozenPrice):Number(this.productInfo?.piecePrice)
    this.productRowData.totalPrice = this.productRowData.quantity * this.productRowData.unitPrice;
  }
  
  changeDiscount(discount:any){
     this.discountInfo = this.dropdownDiscountList.find( x=>x.id == discount.id);
     this.discountRowData.discountAmnt = 1;
     debugger;
     this.discountRowData.discountType = this.discountInfo?.discountType ?? '';
     
  }


  async genarateTotalPrice(productRowData:any){
    debugger
    var fromData = new FormData();
    fromData.append("Quantity", this.productRowData.quantity.toString());
    fromData.append("UnitId", this.productRowData.unit.id.toString());
    fromData.append("ProductId", this.productRowData.product.id.toString());
    this.busy = (await this.service.GetPriceRangeConfigsByQnty(ApiEndPoints.GetPriceRangeConfigsByQntyAsync, fromData)).subscribe((res: PriecConfigResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      this.priceConfigInfo =data;
      debugger
      this.productRowData.unitPrice = data.priceRangeConfigs.unitPrice;
      this.productRowData.totalPrice = data.priceRangeConfigs.unitPrice * this.productRowData.quantity;
    });
  }
  

  genarateUnitTotalPrice(productRowData:any){
    this.productRowData.totalPrice = productRowData.quantity * productRowData.unitPrice;
    debugger
  }

  async modifyTotalPrice(event:any,productRow:any){
    debugger
    var fromData = new FormData();
    fromData.append("Quantity", productRow.quantity.toString());
    fromData.append("UnitId", event.id.toString());
    fromData.append("ProductId", productRow.product.id.toString());
    this.busy = (await this.service.GetPriceRangeConfigsByQnty(ApiEndPoints.GetPriceRangeConfigsByQntyAsync, fromData)).subscribe((res: PriecConfigResponse) => {
      const data = JSON.parse(JSON.stringify(res.data));
      this.priceConfigInfo =data.priceRangeConfigs;
      debugger
      if(data.priceRangeConfigs != null)
      {
        this.productRowData.unitPrice = data.priceRangeConfigs.unitPrice;
        this.productRowData.totalPrice = data.priceRangeConfigs.unitPrice * this.productRowData.quantity;
      }
      else{
        this.productRowData.unitPrice  = 0;
        this.productRowData.totalPrice = 0;
      }
    });
    // debugger
    // if(event.id===1 && productRow.unit.id != 1)
    // {
    //   this.productRowData.unitPrice = Number(this.productInfo?.dozenPrice)??0;
    //   this.productRowData.totalPrice = Number(Number(this.productInfo?.dozenPrice) * this.productRowData.quantity)??0;
    // }
    // else if(event.id === 2){
    //   this.productRowData.unitPrice = Number(this.productInfo?.piecePrice??this.productInfo?.defaultPrice)??0;
    //   this.productRowData.totalPrice = Number(Number(this.productInfo?.piecePrice) * this.productRowData.quantity??(Number(this.productInfo?.defaultPrice) * Number(this.productInfo?.piecePrice)))??0;
    // }
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

  async quickRowAdded(e: any) {
    debugger;
    if(e.unit.id==0||e.product.id == 0||e.quantity==0){
      this.showToast('error', 'Error', 'You must Select product with required Quantity.');
      return;
    }
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
