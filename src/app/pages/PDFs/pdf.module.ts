import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PDFRoutingModule } from './pdf-routing.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { FormsModule } from '@angular/forms';
import { DatepickerModule, InputNumberModule, PaginationModule, TagsInputModule, ToastModule, TooltipModule } from 'ng-devui';
import { AdminFormModule } from 'src/app/@shared/components/admin-form';
import { SharedModule } from 'src/app/@shared/shared.module';


@NgModule({
  declarations: [
    InvoiceComponent
  ],
  imports: [
    CommonModule,
    PDFRoutingModule,
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
export class PDFModule { }
