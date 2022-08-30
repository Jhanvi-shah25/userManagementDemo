import { NgModule } from '@angular/core';
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

@NgModule({
  declarations: [
    AddUsersComponent,
    DashboardComponent,
    HeaderComponent,
    LoginComponent,
    TaskComponent,
    TaskDashboardComponent,
    ChangePasswordComponent,
    EditProfileComponent
  ],
  imports: [
      MatMenuModule,
      ReactiveFormsModule,
      FormsModule,
      DataTablesModule,
      BrowserAnimationsModule,
      RouterModule,
      ModalModule.forRoot()
  ],
})
export class ComponentsModule { }
