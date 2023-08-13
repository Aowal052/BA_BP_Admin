import { NgModule } from '@angular/core';
import { DialogService, BackTopModule } from 'ng-devui';
import { SharedModule } from '../@shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { DaLayoutModule } from '../@shared/layouts/da-layout';
import { WorkOrderComponent } from './work-order/work-order.component';
import { SupplyChainComponent } from './supply-chain/supply-chain.component';
import { BasicDataComponent } from './basic-data/basic-data.component';

@NgModule({
  imports: [PagesRoutingModule, SharedModule, BackTopModule, DaLayoutModule],
  declarations: [PagesComponent, WorkOrderComponent, SupplyChainComponent, BasicDataComponent],
  providers: [DialogService],
})
export class PagesModule {}
