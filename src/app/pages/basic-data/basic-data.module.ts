import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicDataRoutingModule } from './basic-data-routing.module';
import { QuantityWisePriceConfigComponent } from './quantity-wise-price-config/quantity-wise-price-config.component';
import { ToastModule, TagsInputModule, DatepickerModule, InputNumberModule, PaginationModule } from 'ng-devui';
import { AdminFormModule } from 'src/app/@shared/components/admin-form';
import { DynamicFormsModule } from 'src/app/@shared/components/dynamic-forms';
import { SharedModule } from 'src/app/@shared/shared.module';
import { FormRoutingModule } from '../form/form-routing.module';


@NgModule({
  declarations: [
    QuantityWisePriceConfigComponent
  ],
  imports: [
    CommonModule,
    BasicDataRoutingModule,
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
export class BasicDataModule { }
