import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { InventoryComponent } from './inventory.component';
import { ListCategoryComponent } from './category/list-category/list-category.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import { ListProductComponent } from './product/list-product/list-product.component';
import { CustomerComponent } from './customer/customer.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { SubCustomerComponent } from './sub-customer/sub-customer.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
    children: [
      { path: 'add-category', component: AddCategoryComponent },
      { path: 'list-category', component: ListCategoryComponent },
      { path: 'sub-category', component: SubCategoryComponent },
      { path: 'add-product', component: AddProductComponent },
      { path: 'list-product', component: ListProductComponent },
      { path: 'customer', component: CustomerComponent },
      { path: 'sub-customer', component: SubCustomerComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
