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

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent {
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

  listData : Product[] = [];

  headerNewForm = false;
  tableWidthConfig: TableWidthConfig[] = [
    {
      field: 'productName',
      width: '200px',
    },
    {
      field: 'productCode',
      width: '100px',
    },
    {
      field: 'category',
      width: '100px',
    },
    {
      field: 'description',
      width: '100px',
    },
    {
      field: 'price',
      width: '100px',
    },
    {
      field: 'timeline',
      width: '100px',
    },
    {
      field: 'Actions',
      width: '100px',
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
        label: 'category',
        prop: 'category',
        type: 'select',
        options:  ['Low', 'Medium', 'High'],
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'product Code',
        prop: 'product Code',
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
  defaultRowData = {
    id: '',
    productName: '',
    productCode: 'Low',
    category: '',
    description: '',
    defaultPrice: 'Stuck',
  };
  

  priorities = ['Low', 'Medium', 'High'];

  constructor(
    private breadCrumbService: BreadCrumbService,
    private dialogService: DialogService,
    private service: ProductService,
    @Inject(CategoryService) private catservice: CategoryService) { }
  async ngOnInit(): Promise<void> {
    this.getList();
    await this.getCategory()
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
              this.getList();
            },
            error: (err) => {
              Swal.fire('Cancelled', this.res.message , 'error');
            }
          })
  }
  async getList() {
    this.busy = (await this.listDataService.getProducts(ApiEndPoints.GetProducts, this.pager)).subscribe((res:ProductResponse) => {
      
      res.$expandConfig = { expand: false };
      this.listData = res.data;
      this.pager.total = res.totalCount;
    });
  }

  valueChange(event:any){
    debugger
    console.log("selected value",event.target.value );
    //this.selected = event.target.value;
  }

  async getCategory(){
    (await this.catservice.getCategory(ApiEndPoints.GetCategoryDroppdown)).subscribe((response:CategoryResponse) => {
      debugger
      this.res = response;
      if(this.res.statusCode == HttpStatusCode.Ok){
        this.category = this.res.data;
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

  newRow() {
    this.headerNewForm = true;
  }

  quickRowAdded(e: any) {
    debugger
    const newData = { ...e };
    this.listData.unshift(newData);
    this.headerNewForm = false;
  }

  quickRowCancel() {
    this.headerNewForm = false;
  }
  beforeEditStart = (rowItem: any, field: any) => {
    return true;
  };

  beforeEditEnd = (rowItem: any, field: any) => {
    if (rowItem && rowItem) {
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
      link: 'list-product',
      name: 'Product List'
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
