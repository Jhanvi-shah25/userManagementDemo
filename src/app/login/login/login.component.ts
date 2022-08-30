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
        if(response["accessToken"]){
          localStorage.setItem('token',response["accessToken"]);
          this.authentication.data.token = response["accessToken"];
          this.router.navigate(['/dashboard']);
          this.toaster.success('Login successfully');
        }
        else{
          this.toaster.error(response["message"]);
        }
      })
    }
  }


}
