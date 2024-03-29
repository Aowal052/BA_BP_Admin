import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './abnormal/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'basicdata',
        loadChildren: () =>
          import('./basic-data/basic-data.module').then((m) => m.BasicDataModule),
      },
      {
        path: 'inventory',
        loadChildren: () =>
          import('./inventory/inventory.module').then((m) => m.InventoryModule),
      },
      {
        path: 'operation',
        loadChildren: () =>
          import('./operation/operation.module').then((m) => m.OperationModule),
      },
      {
        path: 'form',
        loadChildren: () =>
          import('./form/form.module').then((m) => m.FormModule),
      },
      {
        path: 'list',
        loadChildren: () =>
          import('./list/list.module').then((m) => m.ListModule),
      },
      {
        path: 'abnormal',
        loadChildren: () =>
          import('./abnormal/abnormal.module').then((m) => m.AbnormalModule),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
      },
      {
        path: 'workorder',
        loadChildren: () =>
          import('./work-order/work-order.module').then((m) => m.WorkOrderModule),
      },
      {
        path: 'supplychain',
        loadChildren: () =>
          import('./supply-chain/supply-chain.module').then((m) => m.SupplyChainModule),
      },
      {
        path: 'invoice',
        loadChildren: () =>
          import('./PDFs/pdf.module').then((m) => m.PDFModule),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
