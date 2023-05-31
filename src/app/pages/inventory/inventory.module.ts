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
import { DatepickerModule, PaginationModule, TagsInputModule } from 'ng-devui';


@NgModule({
    declarations: [
        AddCategoryComponent,
        InventoryComponent,
        ListCategoryComponent,
        AddProductComponent,
        ListProductComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        InventoryRoutingModule,
        AdminFormModule,
        DatepickerModule,
        PaginationModule,
        TagsInputModule,
    ]
})
export class InventoryModule { }
