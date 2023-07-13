import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkOrderComponent } from './work-order.component';
import { WorkOrderListComponent } from './work-order-list/work-order-list.component';

const routes: Routes = [{
  path: '',
  component:WorkOrderComponent,
  children: [
    { path: 'work-orders', component: WorkOrderListComponent },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkOrderRoutingModule { }
