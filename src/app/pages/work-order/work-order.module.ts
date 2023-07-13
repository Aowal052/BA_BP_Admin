import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkOrderRoutingModule } from './work-order-routing.module';
import { WorkOrderListComponent } from './work-order-list/work-order-list.component';
import { FormsModule } from '@angular/forms';
import { DatepickerModule, InputNumberModule, PaginationModule, TagsInputModule, ToastModule, TooltipModule } from 'ng-devui';
import { AdminFormModule } from 'src/app/@shared/components/admin-form';
import { SharedModule } from 'src/app/@shared/shared.module';


@NgModule({
  declarations: [
    WorkOrderListComponent
  ],
  imports: [
    CommonModule,
    WorkOrderRoutingModule,
    FormsModule,
    PaginationModule,
    AdminFormModule,
    InputNumberModule,
    DatepickerModule,
    TooltipModule,
    SharedModule,
    TagsInputModule,
    ToastModule,
  ]
})
export class WorkOrderModule { }
