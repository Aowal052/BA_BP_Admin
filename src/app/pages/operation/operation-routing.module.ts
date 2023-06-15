import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { OpertationComponent } from './opertation.component';

const routes: Routes = [{
  path: '',
  component: OpertationComponent,
  children: [
    { path: 'create-sales', component: SalesOrderComponent },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationRoutingModule { }
