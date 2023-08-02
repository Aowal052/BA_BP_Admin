import { HttpStatusCode } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { number } from 'echarts';
import { BreadCrumbService, DialogService, EditableTip, FormLayout, MenuConfig, TableWidthConfig } from 'ng-devui';
import { I18nService } from 'ng-devui/i18n';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { Category, CategoryResponse } from 'src/app/@core/model/CategoryResponse';
import { CommonService } from 'src/app/@core/services/CommonService';
import { CategoryService } from 'src/app/@core/services/category/CategoryService';
import { FormConfig } from 'src/app/@shared/components/admin-form';
import { productPageNotification } from 'src/assets/i18n/en-US/product';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent {
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
      link: 'list-product',
      name: 'Product List'
    }
  ];

  toastMessage:any;
  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };
  editableTip = EditableTip.btn;
  nameEditing !: boolean;
  busy !: Subscription;
  public listData :Category[]=[];
  categoryDropdown: { id?: number, name?: string }[] = [];
  headerNewForm = false;

  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    labelSize: 'lg',
    items: [
      {
        label: 'category',
        prop: 'category',
        type: 'select',
        options:  this.categoryDropdown,
        innerWidth:100,
        outerWidth:200,
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'Sub Category Name',
        prop: 'subCategoryName',
        type: 'input',
        innerWidth:100,
        outerWidth:200,
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      }
    ],
  };
  tableWidthConfig: TableWidthConfig[] = [
    
    {
      field: 'id',
      width: '100px',
    },
    {
      field: 'categoryName',
      width: '400px',
    },
    {
      field: 'subCategoryName',
      width: '400px',
    },
    {
      field: 'Actions',
      width: '100px',
    },
  ];
  
  defaultRowData = {
    id: '',
    subCategoryName: '',
    category: '',
  };
  language: string;
  selectedItem: string = '';
  isSelect : boolean = false;
  selectedId : string = '';
  i18nValues: any;


  public subCategory:any[]=[];
  public category:Category[]=[];
  public res:any;
  private destroy$ = new Subject<void>();

  constructor(
    private breadCrumbService: BreadCrumbService,
    private dialogService: DialogService,
    private service: CategoryService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private router: Router,
    private i18n: I18nService,
    @Inject(CategoryService) private catservice: CategoryService,
    @Inject(CommonService) private conService: CommonService) {
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
    await this.getSubCategory();
    await this.getCategory()
  }
  async getSubCategory(){
    (await this.catservice.getCategory(ApiEndPoints.GetSubCategory,this.pager)).subscribe((response:CategoryResponse) => {
      debugger
      this.res = response;
      if(this.res.statusCode == HttpStatusCode.Ok){
        this.subCategory = this.res.data;
        this.pager.total = response.totalCount;
      }
    });
  }
  async getCategory(){
    (await this.catservice.getCategory(ApiEndPoints.GetForPagination,this.pager)).subscribe((response:CategoryResponse) => {
      debugger
      this.res = response;
      if(this.res.statusCode == HttpStatusCode.Ok){
        this.category = this.res.data;
        this.categoryDropdown = this.category.map(item => ({ id: item.id, name: item.name }));
      }
    });
  }
  async quickRowAdded(e: any) {
    debugger
    const formData = new FormData();
      formData.append('CategoryId', e.category.id||'');
      formData.append('SubCategoryName', e.subCategoryName||'');
      (await this.service.addCategory(ApiEndPoints.AddSubCategory, formData)).subscribe({
        next: async (res: CategoryResponse) => {
          this.res = res;
          if (this.res.statusCode == HttpStatusCode.Ok) {
            this.headerNewForm = false;
            this.toastMessage = [
              {
                severity: 'success',
                summary: productPageNotification.productPage.createMessage.summary,
                content: productPageNotification.productPage.createMessage.addSuccess,
              },
            ];
            await this.getSubCategory();
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
  onPageChange(e: number) {
    this.pager.pageIndex = e;
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
  }
  beforeEditStart = (rowItem: any, field: any) => {
    return true;
  };

   beforeEditEnd = async (rowItem: any, field: any) => {
    debugger
    var data = {
      id:rowItem.subCategoryId,
      SubCategoryName:rowItem[field]
    }
    await this.updateSubCategory(data);
    if (rowItem && rowItem[field].length < 3) {
      return false;
    } else {
      return true;
    }
  };
  async updateSubCategory(item:any){
    const formData = new FormData();
      formData.append('Id', item.id||'');
      formData.append('SubCategoryName', item.SubCategoryName||'');
    (await this.service.updateCategory(ApiEndPoints.UpdateSubCategory, formData)).subscribe({
      next: (res: CategoryResponse) => {
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
  valueChange(event:any){
    debugger
    this.selectedId = event.target.value;
    this.isSelect = true;
    this.selectedItem = event.target.options[event.target.selectedIndex].text;
    //this.selected = event.target.value;
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
            await this.deleteSubCategory(index);
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
  async deleteSubCategory(id:number){
    debugger
    (await this.service.deleteCategory(ApiEndPoints.DeleteSubCategory, id))
          .subscribe({
            next: async (res:CategoryResponse) => {
              if (this.res.statusCode == HttpStatusCode.Ok) {
                await this.getSubCategory();
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
  async newRow() {
    this.headerNewForm = true;
    this.updateFormConfigOptions();
  }
  updateFormConfigOptions() {
    debugger
    this.formConfig.items.find((item: { prop: string; }) => item.prop === 'category').options = this.categoryDropdown;
  }
}
