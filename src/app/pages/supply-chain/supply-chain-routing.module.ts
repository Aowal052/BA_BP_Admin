import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplyChainComponent } from './supply-chain.component';
import { SupplyChainListComponent } from './supply-chain-list/supply-chain-list.component';
import { ChallanListComponent } from './challan-list/challan-list.component';
import { GatePassCreateComponent } from './gate-pass-create/gate-pass-create.component';
import { DirectChallanComponent } from './direct-challan/direct-challan.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceCreateDataListComponent } from './invoice-create-data-list/invoice-create-data-list.component';
import { SalesReturnComponent } from './sales-return/sales-return.component';
import { SalesReturnListComponent } from './sales-return-list/sales-return-list.component';

const routes: Routes = [{
  path: '',
  component:SupplyChainComponent,
  children: [
    { path: 'supply-chain-list', component: SupplyChainListComponent },
    { path: 'direct-challan', component: DirectChallanComponent },
    { path: 'challan-list', component: ChallanListComponent },
    { path: 'gate-pass-create', component: GatePassCreateComponent },
    { path: 'create-invoice', component: CreateInvoiceComponent },
    { path: 'invoice-list', component: InvoiceListComponent },
    { path: 'invoice-create-data-list', component: InvoiceCreateDataListComponent },
    { path: 'sales-return', component: SalesReturnComponent },
    { path: 'sales-return-list', component: SalesReturnListComponent },
    
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplyChainRoutingModule { }
