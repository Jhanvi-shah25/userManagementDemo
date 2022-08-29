import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService, Request } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-task-dashboard',
  templateUrl: './task-dashboard.component.html',
  styleUrls: ['./task-dashboard.component.scss']
})
export class TaskDashboardComponent implements OnInit {

  tasksList : any = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private apiService:ApiService,private toaster : ToastrService,private router : Router,private authenticationService:AuthenticationService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
    this.getAllTask();
  }

  editTaskInformation(taskId : string){
    this.router.navigate(['/addTask/' + taskId])
  }

  getAllTask(){
    let request : Request = {
      path : 'task/getAll'
    }
    this.apiService.get(request).subscribe((response:any)=>{
      this.tasksList = response;
      this.dtTrigger.next('');
    })
  }

  navigateToAddTask(){
    this.router.navigate(['/addTask']);
  }

  removeTask(taskId : string){
    console.log(taskId)
    let request : Request = {
      path : 'task/removeTask/' + taskId
    }
    this.apiService.delete(request).subscribe((response:any)=>{
      if(response["statusCode"] === 200){
        this.toaster.success(response["message"]);
        this.getAllTask();
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
