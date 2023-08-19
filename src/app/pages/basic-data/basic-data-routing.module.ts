import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuantityWisePriceConfigComponent } from './quantity-wise-price-config/quantity-wise-price-config.component';
import { BasicDataComponent } from './basic-data.component';

const routes: Routes = [{
  path: '',
  component:BasicDataComponent,
  children: [
    { path: 'quantity-wise-product-price', component: QuantityWisePriceConfigComponent },
  ],
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicDataRoutingModule { }
