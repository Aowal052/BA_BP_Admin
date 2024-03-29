import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceComponent } from './invoice/invoice.component';

const routes: Routes = [{
  path: '',
  component: InvoiceComponent,
  children: [
    { path: 'invoice', component: InvoiceComponent },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PDFRoutingModule { }
