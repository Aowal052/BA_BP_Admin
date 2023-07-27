import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { InventoryComponent } from './inventory.component';
import { ListCategoryComponent } from './category/list-category/list-category.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import { ListProductComponent } from './product/list-product/list-product.component';
import { SharedModule } from 'src/app/@shared/shared.module';
import { AdminFormModule } from "../../@shared/components/admin-form/admin-form.module";
import { DatepickerModule, PaginationModule, TagsInputModule, ToastModule } from 'ng-devui';
import { CustomerComponent } from './customer/customer.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { SubCustomerComponent } from './sub-customer/sub-customer.component';


@NgModule({
    declarations: [
        AddCategoryComponent,
        InventoryComponent,
        ListCategoryComponent,
        AddProductComponent,
        ListProductComponent,
        CustomerComponent,
        SubCategoryComponent,
        SubCustomerComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        InventoryRoutingModule,
        AdminFormModule,
        DatepickerModule,
        PaginationModule,
        TagsInputModule,
        ToastModule
    ]
})
export class InventoryModule { }
