import { HttpStatusCode } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { BreadCrumbService, DialogService, MenuConfig, HelperUtils, EditableTip, TableWidthConfig, FormLayout } from 'ng-devui';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/@core/data/listData';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { ListDataService } from 'src/app/@core/mock/list-data.service';
import { Category, CategoryResponse } from 'src/app/@core/model/CategoryResponse';
import { Product, ProductResponse } from 'src/app/@core/model/ProductResponse';
import { CategoryService } from 'src/app/@core/services/category/CategoryService';
import { ProductService } from 'src/app/@core/services/product/product.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';
import { categoryNotification } from 'src/assets/i18n/en-US/category';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})
export class ListCategoryComponent {
  editableTip = EditableTip.btn;
  nameEditing !: boolean;
  busy !: Subscription;

  public category:any;
  public res:any;

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  toastMessage:any;
  listData : Product[] = [];

  headerNewForm = false;
  tableWidthConfig: TableWidthConfig[] = [
    {
      field: 'name',
      width: '300px',
    },
    {
      field: 'Actions',
      width: '400px',
    },
  ];
  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    labelSize: 'lg',
    items: [
      {
        label: 'category Name',
        prop: 'categoryName',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      }
    ],
  };
  defaultRowData = {
    id: '',
    categoryName: ''
  };
  

  priorities = ['Low', 'Medium', 'High'];

  constructor(
    private breadCrumbService: BreadCrumbService,
    private dialogService: DialogService,
    private listDataService: ProductService,
    @Inject(CategoryService) private catservice: CategoryService) { }
  async ngOnInit(): Promise<void> {
    await this.getCategory()
  }

  onEditEnd(rowItem: any, field: any) {
    rowItem[field] = false;
  }
  deleteRow(index: number) {
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
            await this.deleteCategory(index);
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

  async deleteCategory(id:number){
    debugger
    (await this.catservice.deleteCategory(ApiEndPoints.DeleteCategory, id))
          .subscribe({
            next: (res:CategoryResponse) => {
              debugger
              if (res.statusCode == HttpStatusCode.Ok) {
                this.getCategory();
                this.toastMessage = [
                  {
                    severity: 'success',
                    summary: categoryNotification.categoryPage.deleteMessage.summary,
                    content: categoryNotification.categoryPage.deleteMessage.deleteSuccess,
                  },
                ];
              }
            },
            error: (err) => {
              this.toastMessage = [
                {
                  severity: 'error',
                  summary: categoryNotification.categoryPage.deleteMessage.summary,
                  content: categoryNotification.categoryPage.deleteMessage.deleteFailed,
                },
              ];
            }
          })
  }

  async getCategory(){
    (await this.catservice.getCategory(ApiEndPoints.GetForPagination, this.pager)).subscribe((response:CategoryResponse) => {
      this.res = response;
      if(this.res.statusCode == HttpStatusCode.Ok){
        this.category = this.res.data;
        this.pager.total = this.res.totalCount;
      }
    });
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.getCategory();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.getCategory();
  }

  newRow() {
    this.headerNewForm = true;
  }

  async quickRowAdded(e: any) {
    debugger
    const formData = new FormData();
      formData.append('Name', e.categoryName||'');
      (await this.catservice.addCategory(ApiEndPoints.AddCategory, formData)).subscribe({
        next: (res: CategoryResponse) => {
          this.res = res;
          if (this.res.statusCode == HttpStatusCode.Ok) {
            this.headerNewForm = false;
            this.getCategory();
            this.toastMessage = [
              {
                severity: 'success',
                summary: categoryNotification.categoryPage.createMessage.summary,
                content: categoryNotification.categoryPage.createMessage.addSuccess,
              },
            ];
          }
        },
        error: (error) => {
          debugger
          this.toastMessage = [
            {
              severity: 'error',
              summary: categoryNotification.categoryPage.createMessage.summary,
              content: categoryNotification.categoryPage.createMessage.addFailed,
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
    await this.updatecategory(rowItem);
    if (rowItem && rowItem[field].length < 3) {
      return false;
    } else {
      return true;
    }
  };

  async updatecategory(item:any){
    const formData = await this.arrayToFormData(item);
    (await this.catservice.updateCategory(ApiEndPoints.UpdateCategory, formData)).subscribe({
      next: (res: CategoryResponse) => {
        this.res = res;
        if (this.res.statusCode == HttpStatusCode.Ok) {
          this.toastMessage = [
            {
              severity: 'success',
              summary: categoryNotification.categoryPage.noticeMessage.summary,
              content: categoryNotification.categoryPage.noticeMessage.updateSuccess,
            },
          ];
        }
      },
      error: (error) => {
        debugger
        this.toastMessage = [
          {
            severity: 'error',
            summary: categoryNotification.categoryPage.noticeMessage.summary,
            content: categoryNotification.categoryPage.noticeMessage.undateFailed,
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
      link: 'add-category',
      name: 'Category List'
    }
  ];

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
