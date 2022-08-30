import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUsersComponent } from './components/add-users/add-users/add-users.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { LoginComponent } from './components/login/login/login.component';
import { TaskDashboardComponent } from './components/task-dashboard/task-dashboard.component';
import { TaskComponent } from './components/task/task.component';
import { AuthguardGuard } from './guards/authguard.guard';

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'dashboard',component : DashboardComponent,canActivate : [AuthguardGuard]},
  {path:'addUsers',component:AddUsersComponent},
  {path:'addUsers/:id',component:AddUsersComponent},
  {path:'taskDashboard',component:TaskDashboardComponent},
  {path:'addTask',component:TaskComponent},
  {path:'addTask/:id',component:TaskComponent},
  {path:'change-password',component:ChangePasswordComponent},
  {path:'edit-profile',component:EditProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
