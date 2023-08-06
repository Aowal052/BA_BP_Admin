import { HttpStatusCode } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { number } from 'echarts';
import { EditableTip, FormLayout, TableWidthConfig, BreadCrumbService, DialogService, MenuConfig, HelperUtils } from 'ng-devui';
import { I18nService } from 'ng-devui/i18n';
import { Subscription, Subject, takeUntil, map } from 'rxjs';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { User } from 'src/app/@core/model/AuthResponse';
import { Branch, BranchResponse } from 'src/app/@core/model/BranchResponse';
import { Category, CategoryResponse } from 'src/app/@core/model/CategoryResponse';
import { Customer, CustomerResponse } from 'src/app/@core/model/CustomerResponse';
import { Product, ProductResponse } from 'src/app/@core/model/ProductResponse';
import { UserResponse, Users } from 'src/app/@core/model/UserResponse';
import { BranchService } from 'src/app/@core/services/branch/branch.service';
import { CategoryService } from 'src/app/@core/services/category/CategoryService';
import { CustomerService } from 'src/app/@core/services/customer/customer.service';
import { PersonalizeService } from 'src/app/@core/services/personalize.service';
import { ProductService } from 'src/app/@core/services/product/product.service';
import { UserService } from 'src/app/@core/services/user/user.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';
import { ThemeType } from 'src/app/@shared/models/theme';
import { productPageNotification } from 'src/assets/i18n/en-US/product';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent {
  editableTip = EditableTip.btn;
  nameEditing !: boolean;
  busy !: Subscription;
  userDropdown: { id?: number, name?: string }[] = [];

  public usersList:Users[]=[];
  public res:any;

  i18nValues: any;
  toastMessage:any;
  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  listData : Branch[] = [];

  headerNewForm = false;
  
  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    labelSize: 'lg',
    items: [
      {
        label: 'Branch Name',
        prop: 'branchName',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'Address',
        prop: 'branchAddress',
        type: 'input',
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'Manager',
        prop: 'branchManager',
        type: 'select',
        options:  this.userDropdown,
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
      width: '70px',
    },
    {
      field: 'branchName',
      width: '200px',
    },
    {
      field: 'branchAddress',
      width: '200px',
    },
    {
      field: 'branchManager',
      width: '200px',
    },
    
  ];
  
  defaultRowData = {
    id: '',
    branchName: '',
    branchAddress: '',
    category: '',
  };
  language: string;
  selectedItem: string = '';
  isSelect : boolean = false;
  selectedId : string = '';
  private destroy$ = new Subject<void>();
  //priorities = ['Low', 'Medium', 'High'];

  constructor(
    private breadCrumbService: BreadCrumbService,
    private dialogService: DialogService,
    private service: ProductService,
    private branchService: BranchService,
    private usrservice: UserService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private router: Router,
    private i18n: I18nService,
    private personalizeService: PersonalizeService,
    @Inject(CategoryService) private catservice: CategoryService) {
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
    await this.getUserList()
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
            await this.deleteProduct(index);
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
  async deleteProduct(id:number){
    debugger
    (await this.service.deleteProduct(ApiEndPoints.DeleteProducts, id))
          .subscribe({
            next: (res:ProductResponse) => {
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
    this.busy = (await this.branchService.getBranchList(ApiEndPoints.GetBranch, this.pager)).subscribe((res: BranchResponse) => {
      res.$expandConfig = { expand: false };
      debugger
      this.listData = res.data;
      this.pager.total = res.totalCount;
      debugger
    });
  }



  valueChange(event:any){
    debugger
    this.selectedId = event.target.value;
    this.isSelect = true;
    this.selectedItem = event.target.options[event.target.selectedIndex].text;
  }
  // Define the elseBlock property
  get elseBlock(): boolean {
    return !this.isSelect;
  }
  async getUserList(){
    (await this.usrservice.getUsers(ApiEndPoints.GetUser)).subscribe((response:UserResponse) => {
      debugger
      this.res = response;
      if(this.res.statusCode == HttpStatusCode.Ok){
        this.usersList = this.res.data;
        this.userDropdown = this.usersList.map(item => ({ id: item.id, name: item.firstName + item.lastName }));
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
    this.formConfig.items.find((item: { prop: string; }) => item.prop === 'branchManager').options = this.userDropdown;
  }
  async quickRowAdded(e: any) {
    const formData = new FormData();
    debugger
      formData.append('BranchName', e.branchName||'');
      formData.append('BranchAddress', e.branchAddress||'');
      formData.append('UserId', e.branchManager.id||0);
      
      (await this.branchService.createBranch(ApiEndPoints.CreateBranch, formData)).subscribe({
        next: (res: BranchResponse) => {
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
        error: () => {
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
    await this.updateBranch(data);
    debugger;
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
      name: 'Setting'
    },
    {
      linkType: 'routerLink',
      link: 'branch',
      name: 'Branch'
    }
  ];

  async updateBranch(item:any){
    debugger
    const formData = await this.arrayToFormData(item);
    (await this.branchService.updateBranch(ApiEndPoints.UpdateBranch, formData)).subscribe({
      next: (res: BranchResponse) => {
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
      error: () => {
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
