import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService, Request } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  usersList : any = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private apiService:ApiService,private toaster : ToastrService,private router : Router,private authenticationService:AuthenticationService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
    this.getAllUsers();
  }

  editUserInformation(userId : string){
    this.router.navigate(['/addUsers/' + userId])
  }

  getAllUsers(){
    let request : Request = {
      path : 'users/getAll'
    }
    this.apiService.get(request).subscribe((response:any)=>{
      this.usersList = response;
      this.dtTrigger.next('');
    })
  }

  navigateToAddUserPage(){
    this.router.navigate(['/addUsers']);
  }

  deleteUser(userId : string){
    let request : Request = {
      path : 'users/delete/' + userId
    }
    this.apiService.delete(request).subscribe((response:any)=>{
      if(response["statusCode"] === 200){
        this.toaster.success(response["message"]);
        this.getAllUsers();
      }
      else{
        this.toaster.error(response["message"]);
      }
    })
  }

  logOut(){
    this.authenticationService.logOut()
  }

}