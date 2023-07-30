import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplyChainRoutingModule } from './supply-chain-routing.module';
import { FormsModule } from '@angular/forms';
import { DatepickerModule, InputNumberModule, PaginationModule, TagsInputModule, ToastModule, TooltipModule } from 'ng-devui';
import { AdminFormModule } from 'src/app/@shared/components/admin-form';
import { SharedModule } from 'src/app/@shared/shared.module';
import { SupplyChainListComponent } from './supply-chain-list/supply-chain-list.component';
import { ChallanListComponent } from './challan-list/challan-list.component';
import { GatePassCreateComponent } from './gate-pass-create/gate-pass-create.component';
import { DirectChallanComponent } from './direct-challan/direct-challan.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceCreateDataListComponent } from './invoice-create-data-list/invoice-create-data-list.component';


@NgModule({
  declarations: [
    SupplyChainListComponent,
    ChallanListComponent,
    GatePassCreateComponent,
    DirectChallanComponent,
    CreateInvoiceComponent,
    InvoiceListComponent,
    InvoiceCreateDataListComponent
  ],
  imports: [
    CommonModule,
    SupplyChainRoutingModule,
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
export class SupplyChainModule { }
