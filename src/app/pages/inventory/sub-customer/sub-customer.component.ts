import { HttpStatusCode } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { BreadCrumbService, DialogService, EditableTip, FormLayout, HelperUtils, MenuConfig, TableWidthConfig } from 'ng-devui';
import { I18nService } from 'ng-devui/i18n';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { Customer, CustomerResponse } from 'src/app/@core/model/CustomerResponse';
import { Product } from 'src/app/@core/model/ProductResponse';
import { UserResponse, Users } from 'src/app/@core/model/UserResponse';
import { CustomerService } from 'src/app/@core/services/customer/customer.service';
import { PersonalizeService } from 'src/app/@core/services/personalize.service';
import { UserService } from 'src/app/@core/services/user/user.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';
import { ThemeType } from 'src/app/@shared/models/theme';
import { productPageNotification } from 'src/assets/i18n/en-US/product';

@Component({
  selector: 'app-sub-customer',
  templateUrl: './sub-customer.component.html',
  styleUrls: ['./sub-customer.component.scss']
})
export class SubCustomerComponent {
  editableTip = EditableTip.btn;
  nameEditing !: boolean;
  busy !: Subscription;
  userDropdown: { id?: number, name?: string }[] = [];

  public category:Customer[]=[];
  public res:any;

  i18nValues: any;
  toastMessage:any;
  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  listData : Customer[] = [];
  subCustomer:any[] = [];

  headerNewForm = false;
  
  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    labelSize: 'lg',
    items: [
      {
        label: 'Master Customer',
        prop: 'masterCustomer',
        placeholder:'Select Master Customer',
        type: 'select',
        options:  this.userDropdown,
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'Sub Customer Name',
        prop: 'subCustomerName',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'address',
        prop: 'address',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'Delivery Address',
        prop: 'delieryAddress',
        type: 'input',
      },
      {
        label: 'Bin Number',
        prop: 'bin',
        type: 'input',
      },
      {
        label: 'Billing Address',
        prop: 'billingAddress',
        type: 'input',
      },
      {
        label: 'NID Number',
        prop: 'nid',
        type: 'input',
      },
      {
        label: 'ContactPerson',
        prop: 'contactPerson',
        type: 'input',
        
      },
      {
        label: 'CpDesignation',
        prop: 'CpDesignation',
        type: 'input',
      },
      {
        label: 'CpDepartment',
        prop: 'CpDepartment',
        type: 'input',
        
      },
      {
        label: 'CpMobile',
        prop: 'CpMobile',
        type: 'input',
        
      },
      {
        label: 'CpEmail',
        prop: 'CpEmail',
        type: 'input',
      },
    ],
  };
  tableWidthConfig: TableWidthConfig[] = [
    {
      field: 'CustomerName',
      width: '100px',
    },
    {
      field: 'Address',
      width: '100px',
    },
    {
      field: 'ContactPerson',
      width: '100px',
    },
    {
      field: 'CpMobile',
      width: '100px',
    },
    {
      field: 'CreditLimit',
      width: '100px',
    },
    {
      field: 'OpeningAmount',
      width: '100px',
    },
    {
      field: 'Actions',
      width: '100px',
    },
  ];
  
  defaultRowData = {
    id: '',
    CustomerName: '',
    Address: '',
    BillingAddress: '',
    DeliveryAddress: '',
    BinNo: 0,
    TinNo: '',
    NidNo: '',
    ContactPerson: '',
    CpDesignation: '',
    CpDepartment: '',
    CpMobile: 0,
    CpEmail: '',
    OpeningAmount: '',
    CustomerType: '',
    KeyAccountManager: '',
    CreditLimit: 0,
  };
  language: string;
  selectedItem: string = '';
  isSelect : boolean = false;
  selectedId : string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private breadCrumbService: BreadCrumbService,
    private dialogService: DialogService,
    private service: CustomerService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private router: Router,
    private i18n: I18nService,
    private personalizeService: PersonalizeService,
    @Inject(UserService) private usrservice: UserService,
    @Inject(CustomerService) private cusservice: CustomerService) {
      this.language = this.translate.currentLang;
     }
  async ngOnInit(): Promise<void> {
    this.translate
      .get('productPage')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.i18nValues = res;
        
        this.i18nValues = this.translate.instant('productPage');
      });

      this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe((event: TranslationChangeEvent) => {
        this.i18nValues = this.translate.instant('productPage');
      });
      this.personalizeService.setRefTheme(ThemeType.Default);

       // oauth
    this.route.queryParams.pipe(map((param) => param.code)).subscribe((code) => {
      if (code && code.length > 0) {
        setTimeout(() => {
          this.toastMessage = [
            {
              severity: 'success',
              content: this.i18nValues['callbackMessage'],
            },
          ];
        });
      }
    });
    
    await this.getList();
    await this.getSubCustomer();
  }

  async onEditEnd(rowItem: any, field: any) {
    debugger
    var data = {
      id:rowItem.id,
      key:field,
      value:rowItem[field]
    }
    await this.UpdateSubCustomer(data);
    if (rowItem && rowItem[field].length < 3) {
      return false;
    } else {
      return true;
    }
  }
  async UpdateSubCustomer(item:any){
    debugger
    const formData = await this.arrayToFormData(item);
    (await this.service.updateCustomer(ApiEndPoints.UpdateSubCustomer, formData)).subscribe({
      next: (res: CustomerResponse) => {
        this.res = res;
        if (this.res.statusCode == HttpStatusCode.Ok) {
          this.toastMessage = [
            {
              severity: 'success',
              summary: productPageNotification.productPage.noticeMessage.summary,
              content: productPageNotification.productPage.noticeMessage.updateSuccess,
            },
          ];
        }
      },
      error: (error) => {
        debugger
        this.toastMessage = [
          {
            severity: 'error',
            summary: productPageNotification.productPage.noticeMessage.summary,
            content: productPageNotification.productPage.noticeMessage.undateFailed,
          },
        ];
      }
    });
  }

  async deleteRow(index: number) {
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
          handler: async () => {
            await this.deleteCustomer(index);
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
  async deleteCustomer(id:number){
    debugger
    (await this.service.deleteCustomer(ApiEndPoints.DeleteSubCustomer, id))
          .subscribe({
            next: (res:CustomerResponse) => {
              if (res.statusCode == HttpStatusCode.Ok) {
                this.getSubCustomer();
                this.toastMessage = [
                  {
                    severity: 'success',
                    summary: productPageNotification.productPage.deleteMessage.summary,
                    content: productPageNotification.productPage.deleteMessage.deleteSuccess,
                  },
                ];
              }
            },
            error: (err) => {
              this.toastMessage = [
                {
                  severity: 'error',
                  summary: productPageNotification.productPage.deleteMessage.summary,
                  content: productPageNotification.productPage.deleteMessage.deleteFailed,
                },
              ];
            }
          })
  }
  async getSubCustomer() {
    this.busy = (await this.service.getCustomers(ApiEndPoints.GetSubCustomers, this.pager)).subscribe((res:CustomerResponse) => {
      res.$expandConfig = { expand: false };
      this.subCustomer = res.data;
      this.pager.total = res.totalCount;
    });
  }
  async getList() {
    this.busy = (await this.service.getCustomers(ApiEndPoints.GetCustomers, this.pager)).subscribe((res:CustomerResponse) => {
      res.$expandConfig = { expand: false };
      this.listData = res.data;
      this.userDropdown = this.listData.map(item => ({ id: item.id, name: item.customerName }));
    });
  }

  valueChange(event:any){
    debugger
    this.selectedId = event.target.value;
    this.isSelect = true;
    this.selectedItem = event.target.options[event.target.selectedIndex].text;
    //this.selected = event.target.value;
  }
  // Define the elseBlock property
  get elseBlock(): boolean {
    return !this.isSelect;
  }

  async getCustomerDropdown(){
    (await this.cusservice.getCustomerDropdown(ApiEndPoints.GetCustomers)).subscribe((response:CustomerResponse) => {
      debugger
      this.res = response;
      if(this.res.statusCode == HttpStatusCode.Ok){
        this.category = this.res.data;
        this.userDropdown = this.category.map(item => ({ id: item.id, name: item.customerName }));
      }
    });
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.getList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.getList();
  }

  async newRow() {
    this.headerNewForm = true;
    this.updateFormConfigOptions();
  }

  updateFormConfigOptions() {
    debugger
    this.formConfig.items.find((item: { prop: string; }) => item.prop === 'masterCustomer').options = this.userDropdown;
  }
  async quickRowAdded(e: any) {
    const formData = new FormData();
    debugger
      formData.append('CustomerName', e.subCustomerName||'');
      formData.append('Address', e.address||'');
      formData.append('BillingAddress', e.billingAddress||'');
      formData.append('DeliveryAddress', e.delieryAddress||'');
      formData.append('CustomerId', e.masterCustomer.id||0);
      formData.append('BinNo', e.bin || '');
      formData.append('TinNo', e.tin || '');
      formData.append('NidNo', e.nid || '');
      formData.append('ContactPerson', e.contactPerson || '');
      formData.append('CpDesignation', e.CpDesignation || '');
      formData.append('CpDepartment', e.CpDepartment || '');
      formData.append('CpMobile', e.CpMobile || '');
      formData.append('CpEmail', e.CpEmail || '');
      (await this.service.createCustomer(ApiEndPoints.CreateSubCustomer, formData)).subscribe({
        next: (res: CustomerResponse) => {
          this.res = res;
          if (this.res.statusCode == HttpStatusCode.Ok) {
            this.headerNewForm = false;
            this.getSubCustomer();
            this.toastMessage = [
              {
                severity: 'success',
                summary: productPageNotification.productPage.createMessage.summary,
                content: productPageNotification.productPage.createMessage.addSuccess,
              },
            ];
          }
        },
        error: (error) => {
          debugger
          this.toastMessage = [
            {
              severity: 'error',
              summary: productPageNotification.productPage.createMessage.summary,
              content: productPageNotification.productPage.createMessage.addFailed,
            },
          ];
        }
      });
  }

  quickRowCancel() {
    this.headerNewForm = false;
  }
  beforeEditStart = (rowItem: any, field: any) => {
    return true;
  };

   beforeEditEnd = async (rowItem: any, field: any) => {
    debugger
    var data = {
      id:rowItem.id,
      key:field,
      value:rowItem[field]
    }
    await this.UpdateSubCustomer(data);
    if (rowItem && rowItem[field].length < 3) {
      return false;
    } else {
      return true;
    }
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
      name: 'Inventory'
    },
    {
      linkType: 'routerLink',
      link: 'customer',
      name: 'Customer'
    }
  ];

  async arrayToFormData(array:any) {
    const formData = new FormData();
    
    for (let key in array) {
      if (array.hasOwnProperty(key)) {
        formData.append(key, array[key]);
      }
    }
    
    return formData;
  }
  navigate(event: MouseEvent, item:any) {
    debugger
    this.canNavigate(item).then((can) => {
      if (!can) {
        return;
      }
      if(item.linkType === 'routerLink') {
        //this.breadCrumbService.navigateTo(event, item);
        HelperUtils.jumpOuterUrl(item.link, '_self');
      } else {
        HelperUtils.jumpOuterUrl(item.link, '_self');
      }
    });
  }

  canNavigate(item:any) {
    return new Promise((resolve) => {
      const results = this.dialogService.open({
        id: 'dialog-service',
        width: '300px',
        zIndex: 1050,
        maxHeight: '600px',
        title: 'Router?',
        content: `Are you sure to Router to ${item.name}?`,
        backdropCloseable: false,
        dialogtype: 'standard',
        buttons: [
          {
            cssClass: 'stress',
            text: 'Ok',
            handler: ($event: Event) => {
              results.modalInstance.hide();
              resolve(true);
            }
          },
          {
            id: 'btn-cancel',
            cssClass: 'common',
            text: 'Cancel',
            handler: ($event: Event) => {
              results.modalInstance.hide();
              resolve(false);
            }
          },
        ]
      });
    });
  }
}
