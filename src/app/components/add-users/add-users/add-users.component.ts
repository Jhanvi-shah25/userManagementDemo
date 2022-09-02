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
  url: string = "";
  userId : string = "";
  allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
  isImg: any;

  constructor( private formBuilder: FormBuilder,
    private router: Router,
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
    console.log('user single list',userSingleList,userSingleList["profileUrl"])
    let s = new String(userSingleList["profileUrl"]);
    if(userSingleList["profileUrl"]!=null && s.length >=3){
      this.isImg = true;
    }
    else{
      this.isImg = false;
    }
    if(!userSingleList["profileUrl"]){
      this.isImg = false;
      userSingleList["profileUrl"] = userSingleList["firstName"][0].toUpperCase() + '' + userSingleList["lastName"][0].toUpperCase();
    }
    if(this.isImg){
      this.url = "http://localhost:3000/users/view/" + userSingleList["profileUrl"];
    }
    else{
      this.url = userSingleList["profileUrl"];
    }
    console.log(this.isImg,this.url,userSingleList.profileUrl)
    this.addUserForm.patchValue({
      firstName : userSingleList.firstName,
      lastName : userSingleList.lastName,
      gender : userSingleList.gender,
      email : userSingleList.email,
      password : userSingleList.password,
      profileUrl : userSingleList.profileUrl
    })
  }


  onSubmit(){
    console.log(this.url,'llll',this.addUserForm.value.profileUrl)
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
        "profileUrl" : this.addUserForm.value.profileUrl,
        "type" : "User"
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
        if(response["status"]["statusCode"] === 201 || response["status"]["statusCode"] === 200){
          this.toaster.success(response["status"]["message"]);
          this.router.navigate(['/dashboard']);
        }
        else{
          this.toaster.error("Invalid credentials!");
        }
      })
    }
  }

  get form(){
    return this.addUserForm.controls;
  }

  onUpload(file:string) {
    this.apiService.upload(file).subscribe(
        (res: any) => {
            if (typeof (res) === 'object' && res["status"]["code"]==='OK') {
                this.url = res["data"]["filename"];
                this.addUserForm.patchValue({
                      profileUrl: res["data"]["filename"]
                })
                this.isImg = true;
                if(this.isImg){
                  this.url = "http://localhost:3000/users/view/" + this.addUserForm.value.profileUrl
                }
                else{
                  this.url = "";  
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

  onSelectFile(event:any) {
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

  delete(userId : string){
    console.log('url',this.url,userId)
    let request : Request = {
      path : 'users/delete-profile/' + userId
    }
    this.apiService.get(request).subscribe((response:any)=>{
      console.log(response);
      if(response["statusCode"] === 200){
        this.isImg = false;
        this.url = "";
        this.addUserForm.value.profileUrl = "";
        this.toaster.success(response["message"]);
      }else{
        this.toaster.error("Invalid url");
      }
    })
  }

}




