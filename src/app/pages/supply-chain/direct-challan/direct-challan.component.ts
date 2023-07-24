import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, EditableTip, FormLayout, MenuConfig, TableWidthConfig } from 'ng-devui';
import { Observable, Subscription, delay, map, of } from 'rxjs';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { Branch, BranchResponse } from 'src/app/@core/model/BranchResponse';
import { Customer, CustomerResponse } from 'src/app/@core/model/CustomerResponse';
import { DeliveryChallanResponse } from 'src/app/@core/model/DeliveryChallanResponse';
import { Discount, DiscountResponse } from 'src/app/@core/model/DiscontResponse';
import { OrderResponse } from 'src/app/@core/model/OrderResponse';
import { Product, ProductResponse } from 'src/app/@core/model/ProductResponse';
import { SubCustomer, SubCustomerResponse } from 'src/app/@core/model/SubCustomerResponse';
import { CommonService } from 'src/app/@core/services/CommonService';
import { CustomerService } from 'src/app/@core/services/customer/customer.service';
import { DeliveryChallanService } from 'src/app/@core/services/deliveryhallan/delivery-challan.service';
import { OrderService } from 'src/app/@core/services/order/order.service';
import { ProductService } from 'src/app/@core/services/product/product.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';
import { DFormData } from 'src/app/@shared/components/dynamic-forms';
import { orderPageNotification } from 'src/assets/i18n/en-US/order';

@Component({
  selector: 'app-direct-challan',
  templateUrl: './direct-challan.component.html',
  styleUrls: ['./direct-challan.component.scss']
})
export class DirectChallanComponent implements OnInit{
  

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
      link: 'direcrt-challan',
      name: 'Direct Challan Create'
    }
  ];

  DiscountOptions = [
    { id: '1', name: 'Online Discount' },
    { id: '2', name: 'Depot Maintanence' },
    { id: '3', name: 'Special Cost' },
    { id: '4', name: 'Eid Offer' },
    { id: '5', name: 'Promotional Offer' },
  ];

  Location = [
    { id: '1', name: 'Main Location' },
    { id: '2', name: 'Other Location' },
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

  //Customer Master Data
  masterData = {
    challanDate:new Date,
    selectedCustomer:{},
    customerDeliveryAddress:'',
    selectedDiscount:{},
    selectedSubCustomer:{},
    subCustomerName:'',
    subCustomerDeliveryAddress:'',
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


  /// Product Data
  listData : any[] = [];
  productInfo?:Product;
  productList: any[] = [];
  dropdownProductList:any[] = [];


  /// Coustomer Data
  customerInfo!:Customer;
  customerList: any[] = [];
  customerDropdownList:any[] = [];

  /// SubCoustomer Data
  subCustomerInfo!:SubCustomer;
  subCustomerList: any[] = [];
  subCustomerDropdownList:any[] = [];

  /// Branch Data
  branchInfo!:Branch;
  branchList: any[] = [];
  branchDropdownList:any[] = [];

  editableTip = EditableTip.btn;


  constructor(
    private dialogService: DialogService,
    private service: OrderService,
    private proService: ProductService,
    private custService: CustomerService,
    private challanService: DeliveryChallanService,
    private router: Router,
    private comService:CommonService){}

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

  async getCustomerDropdown() {
    this.busy = (await this.proService.getCustomerDropdown(ApiEndPoints.GetCustomerFoDropdown)).subscribe(async (res:CustomerResponse) => {
      this.customerDropdownList = res.data;
      
      debugger
      this.customerList = res.data.map(({ id, customerName }) => ({ id: id, label: customerName }));
    });
  }
  async getSubCustomerDropdown(id: any) {
   // const customer = this.customerDropdownList.find(x=>x.id == data.id);
    this.busy = (await this.challanService.getChallanSubCustomerDropdown(ApiEndPoints.GetSuCustomerFoDropdown,id)).subscribe((res:SubCustomerResponse) => {
      this.subCustomerDropdownList = res.data;
      debugger
      this.subCustomerList = res.data.map(({ id, customerName }) => ({ id: id, label: customerName }));
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
    const masterData = this.createFormData(master);
    const products = this.createFormData(this.listData);
    debugger
    // Append master data
    const formData = new FormData();
      formData.append('ChallanMasterDto.ChallanDate', master.challanDate.toISOString());
      formData.append('ChallanMasterDto.customerId', master.selectedCustomer.id.toString());
      formData.append('ChallanMasterDto.SubCustomerId', master.selectedSubCustomer.id.toString());
      formData.append('ChallanMasterDto.BranchId', master.selectedBranch.id.toString());
      formData.append('ChallanMasterDto.deliveryAddress', master.customerDeliveryAddress);
      formData.append('ChallanMasterDto.deliveryInstruction', master.deliveryInstruction);
      formData.append('ChallanMasterDto.remarks', master.remarks);

      // Append list data
      for (let i = 0; i < this.listData.length; i++) {
        const item = this.listData[i];
        formData.append(`ChallanDetailsDtos[${i}].productId`, item.productId.toString());
        formData.append(`ChallanDetailsDtos[${i}].productDescription`, item.productDescription);
        formData.append(`ChallanDetailsDtos[${i}].quantity`, item.quantity.toString());
        formData.append(`ChallanDetailsDtos[${i}].unitId`, item.unitId.toString());
      
      }
      (await this.challanService.createDirectChallan(ApiEndPoints.AddDeliveryChallan, formData)).subscribe({
        next: (res: DeliveryChallanResponse) => {
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
  
  

  async genarateSubInfo(data:any){
    const subCoustomer = this.subCustomerDropdownList.find(x=>x.id == data.id);
    this.masterData.customerDeliveryAddress = subCoustomer?.deliveryAddress??'';
  }
  async genarateMasterInfo(data:any){
    const customer = this.customerDropdownList.find(x=>x.id == data.id);
    await this.getSubCustomerDropdown(customer.id);
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

}
