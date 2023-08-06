import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EditableTip, FormLayout, TableWidthConfig, DialogService, MenuConfig, HelperUtils } from 'ng-devui';
import { Subscription, Subject, takeUntil, map } from 'rxjs';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { BranchResponse } from 'src/app/@core/model/BranchResponse';
import { Users, UserResponse } from 'src/app/@core/model/UserResponse';
import { UserRoleResponse, UserRoles } from 'src/app/@core/model/UserRoleResponse';
import { BranchService } from 'src/app/@core/services/branch/branch.service';
import { PersonalizeService } from 'src/app/@core/services/personalize.service';
import { ProductService } from 'src/app/@core/services/product/product.service';
import { UserService } from 'src/app/@core/services/user/user.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';
import { ThemeType } from 'src/app/@shared/models/theme';
import { productPageNotification } from 'src/assets/i18n/en-US/product';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {

  editableTip = EditableTip.btn;
  nameEditing !: boolean;
  busy !: Subscription;
  userRoleDropdown: { id?: number, name?: string }[] = [];

  public userRoleList:UserRoles[]=[];
  public res:any;

  i18nValues: any;
  toastMessage:any;
  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  listData : Users[] = [];

  headerNewForm = false;
  
  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    labelSize: 'lg',
    items: [
      {
        label: 'UserId',
        prop: 'UserId',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'First Name',
        prop: 'FirstName',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'Last Name',
        prop: 'LastName',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'Password',
        prop: 'UserPassword',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'Email',
        prop: 'Email',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'Role',
        prop: 'UserRoleId',
        type: 'select',
        options:  this.userRoleDropdown,
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
      field: 'userId',
      width: '200px',
    },
    {
      field: 'firstName',
      width: '200px',
    },
    {
      field: 'lastName',
      width: '200px',
    },
    {
      field: 'email',
      width: '200px',
    },
    {
      field: 'userRole',
      width: '200px',
    },
    
  ];
  
  defaultRowData = {
    id: '',
    FirstName: '',
    LastName: '',
    UserPassword: '',
    Email: '',
    UserRole: '',
  };
  language: string;
  selectedItem: string = '';
  isSelect : boolean = false;
  selectedId : string = '';
  private destroy$ = new Subject<void>();
  //priorities = ['Low', 'Medium', 'High'];

  constructor(
    private dialogService: DialogService,
    private service: ProductService,
    private branchService: BranchService,
    private usrservice: UserService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private personalizeService: PersonalizeService) {
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

      this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
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
    await this.getRoleList()
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
            next: () => {
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
            error: () => {
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

  async getRoleList(){
    (await this.usrservice.getRoles(ApiEndPoints.GetRole)).subscribe((response:UserRoleResponse) => {
      debugger
      this.res = response;
      if(this.res.statusCode == HttpStatusCode.Ok){
        debugger
        this.userRoleList = this.res.data;
        this.userRoleDropdown = this.userRoleList.map(item => ({ id: item.id, name: item.roleName }));
      }
    });
  }
  async getList() {
    this.busy = (await this.usrservice.getUsers(ApiEndPoints.GetUser)).subscribe((res: UserResponse) => {
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
    this.formConfig.items.find((item: { prop: string; }) => item.prop === 'UserRoleId').options = this.userRoleDropdown;
  }
  async quickRowAdded(e: any) {
    const formData = new FormData();
    debugger
      formData.append('UserId', e.UserId||'');
      formData.append('FirstName', e.FirstName||'');
      formData.append('LastName', e.LastName||'');
      formData.append('UserPassword', e.UserPassword||'');
      formData.append('Email', e.Email||'');
      formData.append('UserRoleId', e.UserRoleId.id||0);
      
      (await this.usrservice.createUser(ApiEndPoints.CreateUser, formData)).subscribe({
        next: (res: UserResponse) => {
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
  beforeEditStart = () => {
    return true;
  };

  //  beforeEditEnd = async (rowItem: any, field: any) => {
  //   debugger
  //   var data = {
  //     id:rowItem.id,
  //     key:field,
  //     value:rowItem[field]
  //   }
  //   await this.updateBranch(data);
  //   debugger;
  //   if (rowItem && rowItem[field].length < 3) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // };
  
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
      link: 'add-user',
      name: 'User List'
    }
  ];

  // async updateBranch(item:any){
  //   debugger
  //   const formData = await this.arrayToFormData(item);
  //   (await this.branchService.updateBranch(ApiEndPoints.UpdateBranch, formData)).subscribe({
  //     next: (res: BranchResponse) => {
  //       this.res = res;
  //       if (this.res.statusCode == HttpStatusCode.Ok) {
  //         this.toastMessage = [
  //           {
  //             severity: 'success',
  //             summary: productPageNotification.productPage.noticeMessage.summary,
  //             content: productPageNotification.productPage.noticeMessage.updateSuccess,
  //           },
  //         ];
  //       }
  //     },
  //     error: () => {
  //       debugger
  //       this.toastMessage = [
  //         {
  //           severity: 'error',
  //           summary: productPageNotification.productPage.noticeMessage.summary,
  //           content: productPageNotification.productPage.noticeMessage.undateFailed,
  //         },
  //       ];
  //     }
  //   });
  // }

  async arrayToFormData(array:any) {
    const formData = new FormData();
    
    for (let key in array) {
      if (array.hasOwnProperty(key)) {
        formData.append(key, array[key]);
      }
    }
    
    return formData;
  }
  navigate(item:any) {
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
            handler: () => {
              results.modalInstance.hide();
              resolve(true);
            }
          },
          {
            id: 'btn-cancel',
            cssClass: 'common',
            text: 'Cancel',
            handler: () => {
              results.modalInstance.hide();
              resolve(false);
            }
          },
        ]
      });
    });
  }
}
