import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService, Request } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {

  addUserForm: FormGroup;
  newUserData : string[] = [];
  singleUserList = {};
  userId : string = "";

  constructor( private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private activateRoute : ActivatedRoute,
    private toaster:ToastrService,
    private apiService:ApiService) {
    this.addUserForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender : ['',Validators.required],
      email : ['',[Validators.required,Validators.email]],
      password: ['', Validators.required],
  });
   }

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId(){
    this.activateRoute.paramMap.subscribe((data : Params)=>{
      if(data['params'].id){
        this.userId = data["params"].id;
        this.getsingleUserList(this.userId);
      }
      else{
        this.userId = "";
      }
    })
  }

  getsingleUserList(userId : string){
    console.log(userId);
    let request : Request = {
      path : 'users/get/' + userId
    }
    this.apiService.get(request).subscribe((response:any)=>{
      this.singleUserList = response;
      this.editUserField(this.singleUserList);
    })
  }

  editUserField(userSingleList : any){
    this.addUserForm.patchValue({
      firstName : userSingleList.firstName,
      lastName : userSingleList.lastName,
      gender : userSingleList.gender,
      email : userSingleList.email,
      password : userSingleList.password
    })
  }


  onSubmit(){
    if(!this.addUserForm.valid){
      this.toaster.error('Please fill required fields');
    }
    else{
      let request : any = {};
      let objData = {
        "firstName" : this.addUserForm.value.firstName,
        "lastName" : this.addUserForm.value.lastName,
        "gender" : this.addUserForm.value.gender,
        "email" : this.addUserForm.value.email,
        "password" : this.addUserForm.value.password,
        "isActive" : true
      }
      if(!this.userId){
        request = {
          path : 'users/create',
          data : objData
        }
      }
      else{
        request = {
          path : 'users/update/' + this.userId,
          data :objData
        }
      }
      this.apiService.post(request).subscribe((response:any)=>{
        console.log('response',response);
        if(response["statusCode"] === 201 || response["statusCode"] === 200){
          this.toaster.success(response["message"]);
          this.router.navigate(['/dashboard']);
        }
        else{
          this.toaster.error(response["message"]);
        }
      })
    }
  }


}
