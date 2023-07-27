import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormLayout } from 'ng-devui';
import { Subscription, of } from 'rxjs';
import { ApiEndPoints } from 'src/app/@core/helper/ApiEndPoints';
import { OrderResponse } from 'src/app/@core/model/OrderResponse';
import { Product, ProductResponse } from 'src/app/@core/model/ProductResponse';
import { CommonService } from 'src/app/@core/services/CommonService';
import { ProductService } from 'src/app/@core/services/product/product.service';
import { orderPageNotification } from 'src/assets/i18n/en-US/order';

@Component({
  selector: 'app-product-price-config',
  templateUrl: './product-price-config.component.html',
  styleUrls: ['./product-price-config.component.scss']
})
export class ProductPriceConfigComponent {
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
  constructor(
    private router: Router,
    private proService: ProductService,
    private comService:CommonService){}
  async ngOnInit() {
    await this.GetProductList();
  }

  async GetProductList(){
    this.busy = (await this.proService.getProductDropdown(ApiEndPoints.GetProductForDropdown)).subscribe((res:ProductResponse) => {
      this.products = res.data;
      this.productlist = res.data.map(({ id, productName,shortName }) => ({ id: id, label: productName,shortName:shortName??'test' }));
    });
  }
  async getPriceInfo(e:any){
    const product = this.products.find(x=>x.id == e.id);
    this.productPriceData.piecePrice = product.piecePrice??product.defaultPrice;
    this.productPriceData.dozenPrice = product.dozenPrice;
    await this.GetProductList();
  }
  onSelectObject = (term: string) => {
    debugger
    return of(
      this.productlist
        .map((option, index) => ({ id: index, option: option }))
        .filter((item) => item.option.shortName.toLowerCase().indexOf(term.toLowerCase()) !== -1)
    );
  };
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
