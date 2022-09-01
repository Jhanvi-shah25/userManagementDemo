import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService, Request } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm : FormGroup;
  currentRole: any;

  constructor(
    private router : Router,
    private apiService : ApiService,
    private authentication : AuthenticationService,
    private toaster : ToastrService,
    private formBuilder:FormBuilder
    ) { 
    this.loginForm = this.formBuilder.group({
      email : ['',[Validators.required,Validators.email]],
      password : ['',Validators.required]
    })
  }

  ngOnInit(): void {
    console.log(this.loginForm.controls)
  }

  onSubmit(){
    if(!this.loginForm.valid){
      this.toaster.error('Please fill required fields');
    }
    else{
      let request : Request = {
        path : 'auth/login',
        data : {
          "userName" : this.loginForm.value.email,
          "password" : this.loginForm.value.password
        }
      }
      this.apiService.post(request).subscribe((response:any)=>{
        console.log('new',response)
        if(response["accessToken"]){
          localStorage.setItem('token',response["accessToken"]);
          // this.authentication.data.token = response["accessToken"];
          let data :any = {};
          this.currentRole = response["type"][0]
          console.log(this.currentRole,'current role')
          data["authDetail"] = response;
          data["token"] = response["accessToken"];

          this.authentication.setAuth(data);
          if(this.currentRole === 'Admin'){
            this.router.navigate(['/dashboard']);
          }else{
            this.router.navigate(['/user-dashboard']);
          }
          
          this.toaster.success('Login successfully');
        }
        else{
          this.toaster.error(response["message"]);
        }
      })
    }
  }

  get form(){
    return this.loginForm.controls;
  }

  get emailField(): any {
    return this.loginForm.get('email');
  }
  get passwordField(): any {
    return this.loginForm.get('password');
  }


}
