import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplyChainComponent } from './supply-chain.component';
import { SupplyChainListComponent } from './supply-chain-list/supply-chain-list.component';
import { ChallanListComponent } from './challan-list/challan-list.component';
import { GatePassCreateComponent } from './gate-pass-create/gate-pass-create.component';
import { DirectChallanComponent } from './direct-challan/direct-challan.component';

const routes: Routes = [{
  path: '',
  component:SupplyChainComponent,
  children: [
    { path: 'supply-chain-list', component: SupplyChainListComponent },
    { path: 'direct-challan', component: DirectChallanComponent },
    { path: 'challan-list', component: ChallanListComponent },
    { path: 'gate-pass-create', component: GatePassCreateComponent },
    
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplyChainRoutingModule { }
