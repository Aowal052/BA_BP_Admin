import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import { UserCenterComponent } from './user-center/user-center.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { SharedModule } from 'src/app/@shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { TagsInputModule, SplitterModule, PaginationModule, DatepickerModule, ToastModule } from 'ng-devui';
import { BasicSettingsComponent } from './user-settings/basic-settings/basic-settings.component';
import { SecuritySettingsComponent } from './user-settings/security-settings/security-settings.component';
import { MessageNotificationComponent } from './user-settings/message-notification/message-notification.component';
import { AdminFormModule } from 'src/app/@shared/components/admin-form';
import { AddUserComponent } from './add-user/add-user.component';

@NgModule({
  declarations: [
    UserComponent,
    UserCenterComponent,
    UserSettingsComponent,
    BasicSettingsComponent,
    SecuritySettingsComponent,
    MessageNotificationComponent,
    AddUserComponent,
  ],
  imports: [SharedModule, UserRoutingModule, TagsInputModule, SplitterModule,
    AdminFormModule,PaginationModule,DatepickerModule,ToastModule],
})
export class UserModule {}
