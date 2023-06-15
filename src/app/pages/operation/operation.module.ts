import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationRoutingModule } from './operation-routing.module';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { OpertationComponent } from './opertation.component';
import { DynamicFormsModule } from 'src/app/@shared/components/dynamic-forms';
import { DatepickerModule, InputNumberModule, TagsInputModule, ToastModule } from 'ng-devui';
import { SharedModule } from 'src/app/@shared/shared.module';
import { FormRoutingModule } from '../form/form-routing.module';


@NgModule({
  declarations: [
    SalesOrderComponent,
    OpertationComponent
  ],
  imports: [
    CommonModule,
    OperationRoutingModule,
    DynamicFormsModule,
    ToastModule,
    SharedModule,
    FormRoutingModule,
    TagsInputModule,
    DatepickerModule,
    InputNumberModule,
  ]
})
export class OperationModule { }
