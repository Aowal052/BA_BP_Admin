import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OffersComponent } from './offers/offers.component';
import { CommissionComponent } from './commission/commission.component';
import { SettingsComponent } from './settings/settings.component';
import { ProductPriceConfigComponent } from './product-price-config/product-price-config.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { BranchComponent } from './branch/branch.component';
import { CreateMenuComponent } from './create-menu/create-menu.component';
import { CreateModuleComponent } from './create-module/create-module.component';

const routes: Routes = [{
  path: '',
  component:SettingsComponent,
  children: [
    { path: 'create-offer', component: OffersComponent },
    { path: 'create-commission', component: CommissionComponent },
    { path: 'configure-product-price', component: ProductPriceConfigComponent },
    { path: 'vehicle', component: VehicleComponent },
    { path: 'branch', component: BranchComponent },
    { path: 'create-module', component: CreateModuleComponent },
    { path: 'create-menu', component: CreateMenuComponent },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
