import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplyChainComponent } from './supply-chain.component';
import { SupplyChainListComponent } from './supply-chain-list/supply-chain-list.component';

const routes: Routes = [{
  path: '',
  component:SupplyChainComponent,
  children: [
    { path: 'supply-chain-list', component: SupplyChainListComponent },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplyChainRoutingModule { }
