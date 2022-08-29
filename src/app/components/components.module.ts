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

@NgModule({
  declarations: [
    AddUsersComponent,
    DashboardComponent,
    HeaderComponent,
    LoginComponent,
    TaskComponent,
    TaskDashboardComponent
  ],
  imports: [
      MatMenuModule,
      ReactiveFormsModule,
      FormsModule,
      DataTablesModule,
      BrowserAnimationsModule,
      RouterModule
  ],
})
export class ComponentsModule { }
