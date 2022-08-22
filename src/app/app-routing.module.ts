import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUsersComponent } from './add-users/add-users/add-users.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { AuthguardGuard } from './guards/authguard.guard';
import { LoginComponent } from './login/login/login.component';

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'dashboard',component:DashboardComponent,canActivate : [AuthguardGuard]},
  {path:'addUsers',component:AddUsersComponent},
  {path:'addUsers/:id',component:AddUsersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
