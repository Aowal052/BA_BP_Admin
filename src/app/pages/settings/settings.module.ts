import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { CommissionComponent } from './commission/commission.component';
import { OffersComponent } from './offers/offers.component';
import { SettingsComponent } from './settings/settings.component';
import { AdminFormModule } from 'src/app/@shared/components/admin-form';
import { DatepickerModule, InputNumberModule, PaginationModule, TagsInputModule, ToastModule } from 'ng-devui';
import { DynamicFormsModule } from 'src/app/@shared/components/dynamic-forms';
import { SharedModule } from 'src/app/@shared/shared.module';
import { FormRoutingModule } from '../form/form-routing.module';
import { ProductPriceConfigComponent } from './product-price-config/product-price-config.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { BranchComponent } from './branch/branch.component';
import { CreateMenuComponent } from './create-menu/create-menu.component';
import { CreateModuleComponent } from './create-module/create-module.component';


@NgModule({
  declarations: [
    CommissionComponent,
    OffersComponent,
    SettingsComponent,
    ProductPriceConfigComponent,
    VehicleComponent,
    BranchComponent,
    CreateMenuComponent,
    CreateModuleComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    DynamicFormsModule,
    ToastModule,
    SharedModule,
    FormRoutingModule,
    TagsInputModule,
    DatepickerModule,
    InputNumberModule,
    AdminFormModule,
    PaginationModule,
  ]
})
export class SettingsModule { }
