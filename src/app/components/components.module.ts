import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { AddUsersComponent } from './add-users/add-users/add-users.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { HeaderComponent } from './header/header/header.component';
import { LoginComponent } from './login/login/login.component';
import { TaskComponent } from './task/task.component';
import { TaskDashboardComponent } from './task-dashboard/task-dashboard.component';
import { MatMenuModule } from '@angular/material/menu';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AssigntaskComponent } from './assigntask/assigntask.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule }  from '@angular/material/card';
import { ItemComponent } from './item/item.component';
import { ChatComponent } from './chat/chat.component';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
    AddUsersComponent,
    DashboardComponent,
    HeaderComponent,
    LoginComponent,
    TaskComponent,
    TaskDashboardComponent,
    ChangePasswordComponent,
    EditProfileComponent,
    UserDashboardComponent,
    AssigntaskComponent,
    ItemComponent,
    ChatComponent,
  ],
  imports: [
      MatMenuModule,
      ReactiveFormsModule,
      FormsModule,
      DataTablesModule,
      BrowserModule,
      DragDropModule,
      BrowserAnimationsModule,
      RouterModule,
      MatCardModule,
      ModalModule.forRoot(),
      MatExpansionModule
  ],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
