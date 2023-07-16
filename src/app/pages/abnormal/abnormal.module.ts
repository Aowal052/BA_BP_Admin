import { NgModule } from '@angular/core';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AbnormalComponent } from './abnormal.component';
import { SharedModule } from 'src/app/@shared/shared.module';
import { AbnormalRoutingModule } from './abnormal-routing.module';
import { SalesInvoiceComponent } from './sales-invoice/sales-invoice.component';

@NgModule({
  declarations: [NotFoundComponent, ForbiddenComponent, ServerErrorComponent, AbnormalComponent, SalesInvoiceComponent],
  imports: [SharedModule, AbnormalRoutingModule],
})
export class AbnormalModule {}
