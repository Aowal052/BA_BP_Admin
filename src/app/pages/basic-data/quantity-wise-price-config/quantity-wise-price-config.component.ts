import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormLayout } from 'ng-devui';
import { Subscription, of } from 'rxjs';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { OrderResponse } from 'src/app/@core/model/OrderResponse';
import { ProductResponse } from 'src/app/@core/model/ProductResponse';
import { CommonService } from 'src/app/@core/services/CommonService';
import { ProductService } from 'src/app/@core/services/product/product.service';
import { orderPageNotification } from 'src/assets/i18n/en-US/order';

@Component({
  selector: 'app-quantity-wise-price-config',
  templateUrl: './quantity-wise-price-config.component.html',
  styleUrls: ['./quantity-wise-price-config.component.scss']
})
export class QuantityWisePriceConfigComponent {
  multipleSelectConfig: any;
  busy !: Subscription;
  layout = FormLayout.Horizontal;
  productlist: any[] = [];
  products: any[] = [];
  productPriceData = {
    product: {id:0,label:''},
    piecePrice: 0,
    dozenPrice: 0,

  };
  toastMessage: any;
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
  formData = {
    selectUnit: {id:0,label:''},
    selectProduct: {id:0,label:''},
    applicableDate: new Date(),
    unitPrice:0,
    toQuantity:0,
    fromQuantity:0
  };
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
  checkboxOptions = [
    { id: '1', label: 'Mon', checked: true },
    { id: '2', label: 'Tue' },
    { id: '3', label: 'Wed' },
    { id: '4', label: 'Thur' },
    { id: '5', label: 'Fri' },
    { id: '6', label: 'Sat' },
    { id: '0', label: 'Sun' },
  ];

  columnsLayout: FormLayout = FormLayout.Columns;

  labelList = [
    {
      id: 1,
      label: 'OpenSource',
    },
    {
      id: 2,
      label: 'DevOps',
    },
    {
      id: 3,
      label: 'SoftWare',
    },
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
  constructor(
    private router: Router,
    private proService: ProductService,
    private comService:CommonService){}
  async ngOnInit() {
    this.multipleSelectConfig = {
      key: 'multipleSelect',
      label: 'Options(Multiple selection with delete)',
      isSearch: true,
      multiple: 'true',
      labelization: { enable: true, labelMaxWidth: '120px' },
      options: this.selectOptions,
    };
    await this.GetProductList();
  }

  async GetProductList(){
    this.busy = (await this.proService.getProductDropdown(ApiEndPoints.GetProductForDropdown)).subscribe((res:ProductResponse) => {
      this.products = res.data;
      this.productlist = res.data.map(({ id, productName,shortName }) => ({ id: id, label: productName,shortName:shortName??'test' }));
    });
  }
  async getPriceInfo(e:any){
    debugger
    const product = this.products.find(x=>x.id == e.id);
    const unit = this.selectUnits.find(x=>x.id==product.activeUnitId);
    this.formData.selectUnit = {id:Number(unit?.id),label:unit?.label??''};
    this.formData.unitPrice = this.formData.selectUnit.id==1?Number(product.dozenPrice):Number(product.piecePrice)
    await this.GetProductList();
  }
  onSelectObject = (term: string) => {
    return of(
      this.productlist
        .map((option, index) => ({ id: index, option: option }))
        .filter((item) => item.option.shortName.toLowerCase().indexOf(term.toLowerCase()) !== -1)
    );
  };
  data:any;
  async placeOrder(config:any){
    debugger
    if(config.fromQuantity==0||config.toQuantity==0||config.selectProduct.id==0||config.selectUnit.id==0){
      this.toastMessage = [
        {
          severity: 'warn',
          summary: orderPageNotification.orderPage.createMessage.summary,
          content: "Fillup mandatory field",
        },
      ];
      return;
    }
    const formData = new FormData();
      formData.append('ApplicableFrom', config.applicableDate.toISOString());
      formData.append('FromQuantity', config.fromQuantity.toString());
      formData.append('ToQuantity', config.toQuantity.toString());
      formData.append('ProductId', config.selectProduct.id.toString());
      formData.append('UnitId', config.selectUnit.id.toString());
      formData.append('UnitPrice', config.unitPrice.toString());

      (await this.proService.updateProduct(ApiEndPoints.CreateQuantityWisePriceConfig, formData)).subscribe({
        next: (res: OrderResponse) => {
          debugger
          this.data = res;
          if (this.data.statusCode == HttpStatusCode.Ok) {
            this.toastMessage = [
              {
                severity: 'success',
                summary: orderPageNotification.orderPage.createMessage.summary,
                content: orderPageNotification.orderPage.createMessage.addSuccess,
              },
            ];
            this.formData = {
              selectUnit: {id:0,label:''},
              selectProduct: {id:0,label:''},
              applicableDate: new Date(),
              unitPrice:0,
              toQuantity:0,
              fromQuantity:0
            };
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
  async UpdatePrice(priceInfo:any){
    const formData = new FormData();
    formData.append('ProductId', this.productPriceData.product.id.toString());
    formData.append('PiecePrice',this.productPriceData.piecePrice.toString());
    formData.append('DozenPrice', this.productPriceData.dozenPrice.toString());
    (await this.proService.updatePrice(ApiEndPoints.UpdateProductPrice, formData)).subscribe({
      next: async (res: OrderResponse) => {
        if (res.statusCode == HttpStatusCode.Ok) {
          this.productPriceData = {
            product: {id:0,label:''},
            piecePrice: 0,
            dozenPrice: 0,
        
          };
          this.toastMessage = [
            {
              severity: 'success',
              summary: orderPageNotification.orderPage.createMessage.summary,
              content: orderPageNotification.orderPage.createMessage.addSuccess,
            },
          ];
          await this.GetProductList();
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
}
