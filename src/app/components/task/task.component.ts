import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService, Request } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  taskForm: FormGroup;
  taskData : string[] = [];
  singleTaskList = {};
  taskId : string = "";

  constructor( private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private activateRoute : ActivatedRoute,
    private toaster:ToastrService,
    private apiService:ApiService) {
    this.taskForm = this.formBuilder.group({
      taskName: ['', Validators.required],
      taskDescription: ['', Validators.required],
  });
   }

  ngOnInit(): void {
    this.getTaskId();
    console.log(this.taskForm.controls)
  }

  getTaskId(){
    this.activateRoute.paramMap.subscribe((data : Params)=>{
      if(data['params'].id){
        this.taskId = data["params"].id;
        this.getSingleTaskList(this.taskId);
      }
      else{
        this.taskId = "";
      }
    })
  }

  getSingleTaskList(taskid : string){
    console.log(taskid);
    let request : Request = {
      path : 'task/getSingleTask/' + taskid
    }
    this.apiService.get(request).subscribe((response:any)=>{
      this.singleTaskList = response;
      this.editTaskData(this.singleTaskList);
    })
  }

  editTaskData(singleTaskList : any){
    this.taskForm.patchValue({
      taskName : singleTaskList.taskName,
      taskDescription : singleTaskList.taskDescription,
    })
  }


  onSubmit(){
    console.log(this.taskForm.controls)
    if(!this.taskForm.valid){
      this.toaster.error('Please fill required fields');
    }
    else{
      let request : any = {};
      let objData = {
        "taskName" : this.taskForm.value.taskName,
        "taskDescription" : this.taskForm.value.taskDescription,
      }
      if(!this.taskId){
        request = {
          path : 'task/add-task',
          data : objData
        }
      }
      else{
        request = {
          path : 'task/updateTask/' + this.taskId,
          data :objData
        }
      }
      this.apiService.post(request).subscribe((response:any)=>{
        console.log('response',response);
        if(response["statusCode"] === 201 || response["statusCode"] === 200){
          this.toaster.success(response["message"]);
          this.router.navigate(['/taskDashboard']);
        }
        else{
          this.toaster.error(response["message"]);
        }
      })
    }
  }

  get form(){
    return this.taskForm.controls;
  }



}
