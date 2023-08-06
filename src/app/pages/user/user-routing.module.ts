import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import { UserCenterComponent } from './user-center/user-center.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { AddUserComponent } from './add-user/add-user.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: 'add-user', component: AddUserComponent },
      { path: 'center', component: UserCenterComponent },
      { path: 'settings', component: UserSettingsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
