import { ThisReceiver } from '@angular/compiler';
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
  format:any;
  url: string = "";
  link : any;
  userId : string = "";
  allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
  isImg: any;
  shortLink: string = "";
  loading: boolean = false; // Flag variable
  file: any = null; // Variable to store file

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
      profileUrl : [null]
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
      password : userSingleList.password,
      profileUrl : this.url
    })
  }


  onSubmit(){
    console.log(this.addUserForm.controls)
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
        "isActive" : true,
        "profileUrl" : this.addUserForm.value.profileUrl
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

  get form(){
    return this.addUserForm.controls;
  }

  profileGo(file: string) {
    console.log(this.addUserForm.value)
    let data = new FormData();
    data.append("file", file);
    console.log(file,data)
    let obj = {
      name : ""
    }
    let imgRequest = {
      path: 'users/upload',
      data : data
    }
    console.log('dd',data)
    this.apiService.post(imgRequest)
      .subscribe((resp: any) => {
        console.log('res',resp)
        // if (resp['status']['code'] == "OK") {
        //   this.addUserForm.patchValue({
        //     profileUrl: resp['data']['id']
        //   })
        //   this.isImg = true
        //   if (this.isImg) {
        //     this.url =
        //       'auth/file/view?fileKey=' + this.addUserForm.value.logo;
        //   }
        //   this.toaster.success(resp['status']['description']);
        // }
        // else {
        //   this.toaster.error(resp['status']['description']);
        // }
      })
  }

  onUpload(file:string) {
    this.loading = !this.loading;
    console.log(this.file);
    this.apiService.upload(file).subscribe(
        (res: any) => {
            if (typeof (event) === 'object' && res["status"]["code"]==='OK') {
                // Short link via api response
                this.shortLink = res.link;
                this.url = res["data"]["filename"];
                this.addUserForm.patchValue({
                      profileUrl: res["data"]["filename"]
                })
                this.isImg = true;
                if(this.isImg){
                  this.url = "http://localhost:3000/users/view/" + this.addUserForm.value.profileUrl
                }
                this.toaster.success(res["status"]["message"]);
            }else{
              this.toaster.error('Invalid');
            }
      }
    );
  }

  getUploadPhoto(){
    let request : Request = {
      path : 'users/view/' + this.url
    }
    this.apiService.getUpload(request).subscribe((response:any)=>{
      console.log('get upload',response)
    })
  }

  onSelectFile1(event:any) {
    if (event.target.files && event.target.files[0]) {
      if (this.allowed_types.indexOf(event.target.files[0].type) == -1) {
        this.toaster.error('Only JPG , JPEG or PNG images are allowed.');
        return false;
      }
      if (event.target.files[0].size > 1 * 1024 * 1024) {
        this.toaster.error('Maximum 1MB size allowed');
        return false;
      }
      else {
        this.onUpload(event.target.files[0])
      }
    }
  }


}




