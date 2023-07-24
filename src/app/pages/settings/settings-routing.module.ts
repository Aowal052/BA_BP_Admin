import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OffersComponent } from './offers/offers.component';
import { CommissionComponent } from './commission/commission.component';
import { SettingsComponent } from './settings/settings.component';
import { ProductPriceConfigComponent } from './product-price-config/product-price-config.component';

const routes: Routes = [{
  path: '',
  component:SettingsComponent,
  children: [
    { path: 'create-offer', component: OffersComponent },
    { path: 'create-commission', component: CommissionComponent },
    { path: 'configure-product-price', component: ProductPriceConfigComponent },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
