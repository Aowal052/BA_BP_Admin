import { HttpStatusCode } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { BreadCrumbService, DialogService, EditableTip, FormLayout, HelperUtils, MenuConfig, TableWidthConfig } from 'ng-devui';
import { I18nService } from 'ng-devui/i18n';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { CommissionResponse } from 'src/app/@core/model/CommissionResponse';
import { Customer, CustomerResponse } from 'src/app/@core/model/CustomerResponse';
import { UserResponse, Users } from 'src/app/@core/model/UserResponse';
import { CommissionService } from 'src/app/@core/services/commission/commission.service';
import { CustomerService } from 'src/app/@core/services/customer/customer.service';
import { PersonalizeService } from 'src/app/@core/services/personalize.service';
import { UserService } from 'src/app/@core/services/user/user.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';
import { ThemeType } from 'src/app/@shared/models/theme';
import { productPageNotification } from 'src/assets/i18n/en-US/product';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss']
})
export class CommissionComponent {
  editableTip = EditableTip.btn;
  nameEditing !: boolean;
  busy !: Subscription;
  percentDropdown = [
    {
      id: 1,
      name: 'Percent',
    },
    {
      id: 2,
      name: 'Neumaric',
    }
  ];
  //percentDropdown: { id?: number, name?: string }[] = [];
  //categoryDropdown: { id?: number, name?: string }[] = [];

  public category:Users[]=[];
  public res:any;

  i18nValues: any;
  toastMessage:any;
  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  listData : Customer[] = [];

  headerNewForm = false;
  
  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    labelSize: 'sm',
    items: [
      {
        label: 'Discount  Name',
        prop: 'DiscountName',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      
      {
        label: 'Discount Type',
        prop: 'DiscountType',
        type: 'select',
        options:  this.percentDropdown,
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      
    ],
  };
  tableWidthConfig: TableWidthConfig[] = [
    {
      field: 'id',
      width: '100px',
    },
    {
      field: 'discountName',
      width: '100px',
    },
    {
      field: 'discountType',
      width: '100px',
    },
  ];
  
  defaultRowData = {
    id: '',
    DiscountName: '',
    DiscountType: '',
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
    private commissionService: CommissionService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private router: Router,
    private i18n: I18nService,
    private personalizeService: PersonalizeService,
    @Inject(UserService) private usrservice: UserService) {
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
    
    this.getList();
   
  }

  onEditEnd(rowItem: any, field: any) {
    if (rowItem && rowItem[field].length < 3) {
      return false;
    } else {
      return true;
    }
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
    (await this.service.deleteCustomer(ApiEndPoints.DeleteCustomer, id))
          .subscribe({
            next: (res:CustomerResponse) => {
              if (this.res.statusCode == HttpStatusCode.Ok) {
                this.getList();
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

  async getList() {
    debugger;
    this.busy = (await this.commissionService.getCommission(ApiEndPoints.GetDiscountList)).subscribe((res:CommissionResponse) => {
      res.$expandConfig = { expand: false };
      this.listData = res.data;
      debugger
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
    this.formConfig.items.find((item: { prop: string; }) => item.prop === 'DiscountType').options = this.percentDropdown;
  }
  async quickRowAdded(e: any) {
    const formData = new FormData();
    debugger
      formData.append('DiscountName', e.DiscountName||'');
      formData.append('DiscountType', e.DiscountType.name||'');
      (await this.commissionService.createCommission(ApiEndPoints.GetDiscountCreate, formData)).subscribe({
        next: (res: CustomerResponse) => {
          this.res = res;
          if (this.res.statusCode == HttpStatusCode.Ok) {
            this.headerNewForm = false;
            this.getList();
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
      name: 'Settings'
    },
    {
      linkType: 'routerLink',
      link: 'create-commission',
      name: 'Discount'
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
