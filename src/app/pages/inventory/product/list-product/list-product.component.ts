import { HttpStatusCode } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { number } from 'echarts';
import { BreadCrumbService, DialogService, MenuConfig, HelperUtils, EditableTip, TableWidthConfig, FormLayout, ToastService } from 'ng-devui';
import { I18nService } from 'ng-devui/i18n';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { Item } from 'src/app/@core/data/listData';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { ListDataService } from 'src/app/@core/mock/list-data.service';
import { Category, CategoryResponse } from 'src/app/@core/model/CategoryResponse';
import { Product, ProductResponse } from 'src/app/@core/model/ProductResponse';
import { CategoryService } from 'src/app/@core/services/category/CategoryService';
import { PersonalizeService } from 'src/app/@core/services/personalize.service';
import { ProductService } from 'src/app/@core/services/product/product.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';
import { ThemeType } from 'src/app/@shared/models/theme';
import { productPageNotification } from 'src/assets/i18n/en-US/product';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit{
  editableTip = EditableTip.btn;
  nameEditing !: boolean;
  busy !: Subscription;
  categoryDropdown: { id?: number, name?: string }[] = [];
  unitDropdown: { id?: number, label?: string }[] = [];

  public category:Category[]=[];
  public res:any;

  i18nValues: any;
  toastMessage:any;
  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };
  selectUnits = [
    {
      id: 2,
      name: 'Pcs',
    },
    {
      id: 1,
      name: 'Dzn',
    }
  ];
  listData : Product[] = [];

  headerNewForm = false;
  
  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    labelSize: 'lg',
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
        label: 'Default Unit',
        prop: 'dUnit',
        type: 'select',
        search:'searchFn',
        options:this.selectUnits,
      },
      {
        label: 'Category',
        prop: 'category',
        type: 'select',
        options:  this.categoryDropdown,
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'product Code',
        prop: 'productCode',
        type: 'input',
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'Short Name',
        prop: 'shortName',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true }],
        },
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
        label: 'Piece price',
        prop: 'piecePrice',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true,type:number }],
        },
      },
      {
        label: 'Dozen price',
        prop: 'dozenPrice',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true,type:number }],
        },
      },
      {
        label: 'Openning Quantity',
        prop: 'OpeningQuantity',
        type: 'input',
        required: true,
        rule: {
          validators: [{ required: true,type:number }],
        },
      }
    ],
  };
  tableWidthConfig: TableWidthConfig[] = [
    {
      field: 'id',
      width: '80px',
    },
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
      width: '150px',
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
      field: 'Status',
      width: '100px',
    },
    {
      field: 'Actions',
      width: '200px',
    },
  ];
  
  defaultRowData = {
    id: '',
    productName: '',
    productCode: '',
    category: '',
    defaultUnit: '',
    description: '',
    generaleDiscount: '',
    price: 0,
  };
  language: string;
  selectedItem: string = '';
  isSelect : boolean = false;
  selectedId : string = '';
  keyword = '';
  private destroy$ = new Subject<void>();
  animate = true;

  constructor(
    private breadCrumbService: BreadCrumbService,
    private dialogService: DialogService,
    private service: ProductService,
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
    await this.getCategory()
  }
  async changeStatus(rowItem:any,field:string){
    debugger
    var data = {
      id:rowItem.id,
      key:field,
      value:rowItem.status=="Active"?false:true
    }
    await this.updateproduct(data);
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
    this.busy = (await this.service.getProducts(ApiEndPoints.GetProducts, this.pager)).subscribe((res:ProductResponse) => {
      res.$expandConfig = { expand: false };
      this.listData = res.data;
      debugger
      this.pager.total = res.totalCount;
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

  async getCategory(){
    (await this.catservice.getCategory(ApiEndPoints.GetCategoryDroppdown,this.pager)).subscribe((response:CategoryResponse) => {
      debugger
      this.res = response;
      if(this.res.statusCode == HttpStatusCode.Ok){
        this.category = this.res.data;
        this.categoryDropdown = this.category.map(item => ({ id: item.id, name: item.name }));
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
  async onSearch(e:any){
    if(e=='' || e==null){
      this.getList();
    }
    const formData = new FormData();
    formData.append('Keyword', e||'');
    formData.append('PageNumber', this.pager.pageIndex.toString());
    formData.append('PageSize', this.pager.pageSize.toString());
    debugger
    this.busy = (await this.service.updateProduct(ApiEndPoints.SearchProduct, formData)).subscribe({
      next: (res: ProductResponse) => {
        res.$expandConfig = { expand: false };
        this.listData = res.data;
        this.pager.total = res.totalCount;
      },
      error: (error) => {
        debugger
        this.toastMessage = [
          {
            severity: 'error',
            summary: productPageNotification.productPage.createMessage.summary,
            content: 'Invalid Product Info',
          },
        ];
      }
    });
  }

  updateFormConfigOptions() {
    debugger
    this.formConfig.items.find((item: { prop: string; }) => item.prop === 'category').options = this.categoryDropdown;
    this.formConfig.items.find((item: { prop: string; }) => item.prop === 'dUnit').options = this.selectUnits;
  }
  async quickRowAdded(e: any) {
    const formData = new FormData();
      formData.append('ProductCode', e.productCode||'');
      formData.append('ProductName', e.productName||'');
      formData.append('PiecePrice', e.piecePrice||'');
      formData.append('DozenPrice', e.dozenPrice||'');
      formData.append('CategoryId', e.category.id||'');
      formData.append('Description', e.description || '');
      formData.append('ShortName', e.shortName || '');
      formData.append('ActiveUnitId', e.dUnit.id || '');
      (await this.service.updateProduct(ApiEndPoints.AddProduct, formData)).subscribe({
        next: (res: ProductResponse) => {
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
              content: 'Invalid Product Info',
            },
          ];
        }
      });
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
    await this.updateproduct(data);
    if (rowItem && rowItem[field].length < 2) {
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

  async updateproduct(item:any){
    debugger
    const formData = await this.arrayToFormData(item);
    (await this.service.updateProduct(ApiEndPoints.UpdateProduct, formData)).subscribe({
      next: async (res: ProductResponse) => {
        this.res = res;
        if (this.res.statusCode == HttpStatusCode.Ok) {
      await this.getList();
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
