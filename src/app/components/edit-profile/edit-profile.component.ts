import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BsModalRef,BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ApiService, Request } from 'src/app/services/api.service';
import * as $ from 'jquery';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  modalRef!: BsModalRef;
  editUserProfileForm!: FormGroup;
  newUserData : string[] = [];
  singleUserList = {};
  url: string = "";
  userId : string = "";
  allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
  isImg: any;
  currentUser : any;
  admin:boolean = false;
  token : string ="";
  currentRole : string =""




  constructor(private modalService : BsModalService,private formBuilder : FormBuilder,
    private router: Router,
    private activateRoute : ActivatedRoute,
    private toaster:ToastrService,
    private apiService:ApiService,
    private authService : AuthenticationService) {
    this.editUserProfileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender : ['',Validators.required],
      email : ['',[Validators.required,Validators.email]],
      password: ['', Validators.required],
      profileUrl : [null]
    })

    if (this.authService['data']['authDetail'] && this.authService['data']['authDetail']['type'][0] === 'Admin') {
      this.admin = true;
    }
    else{
      this.admin =false;
    }
   }

  openModalEditProfile(editProfile : TemplateRef<any>){
    this.modalRef = this.modalService.show(editProfile,
      Object.assign({} , {class: 'gray modal-lg'}))
  }

  ngOnInit(): void {
    this.getCurrentUser();
    $("#editprofile").click();
    // this.getUserId();
  }

  getCurrentUser(){
    this.currentUser = this.authService.getAuthDetail()["authDetail"];
    this.userId = this.currentUser["_id"];
    console.log(this.userId)
    this.getsingleUserList(this.userId);
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
    console.log('user single list',userSingleList)
    let s = new String(userSingleList["profileUrl"]);
    if(userSingleList["profileUrl"]!=null && s.length >=3){
      this.isImg = true;
    }else{
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
    console.log(this.isImg,this.url)
    this.editUserProfileForm.patchValue({
      firstName : userSingleList.firstName,
      lastName : userSingleList.lastName,
      gender : userSingleList.gender,
      email : userSingleList.email,
      password : userSingleList.password,
      profileUrl : userSingleList.profileUrl
    })
  }


  onSubmit(){
    console.log('lll1111',this.editUserProfileForm.controls,this.editUserProfileForm.value,this.url,'llll',this.editUserProfileForm.value.profileUrl)
    if(!this.editUserProfileForm.valid){
      this.toaster.error('Please fill required fields');
    }
    else{
      let request : any = {};
      let objData = {
        "firstName" : this.editUserProfileForm.value.firstName,
        "lastName" : this.editUserProfileForm.value.lastName,
        "gender" : this.editUserProfileForm.value.gender,
        "email" : this.editUserProfileForm.value.email,
        "password" : this.editUserProfileForm.value.password,
        "isActive" : true,
        "profileUrl" : this.editUserProfileForm.value.profileUrl
      }
        request = {
          path : 'users/update/' + this.userId,
          data :objData
        }
      this.apiService.post(request).subscribe((response:any)=>{
        console.log('response',response);
        if(response["status"]["statusCode"] === 200){
          this.toaster.success(response["status"]["message"]);
          let data = this.authService.getAuthDetail();
          data["authDetail"]["profileUrl"] = response["data"]["profileUrl"];
          this.authService.setAuth(data);
          console.log(data,'data from edit prof',data["authDetail"]["profileUrl"])
          this.modalRef.hide();
          if(this.admin){
            this.router.navigate(['/dashboard']);
          }else{
            this.router.navigate(['/user-dashboard']);
          }
        }
        else{
          this.toaster.error(response["status"]["message"]);
        }
      })
    }
  }

  get form(){
    return this.editUserProfileForm.controls;
  }

  onUpload(file:string) {
    this.apiService.upload(file).subscribe((res: any) => {
      if (typeof (res) === 'object' && res["status"]["code"]==='OK') 
      {
        this.url = res["data"]["filename"];
        this.editUserProfileForm.patchValue(
          {
            profileUrl: res["data"]["filename"]
          })
        this.isImg = true;
        if(this.isImg)
        {
          this.url = "http://localhost:3000/users/view/" + this.editUserProfileForm.value.profileUrl
        }
        else
        {
          this.url = "";
        }
        this.toaster.success(res["status"]["message"]);
      }
      else
      {
        this.toaster.error('Invalid');
      }
    });
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
        this.editUserProfileForm.value.profileUrl = "";
        this.toaster.success(response["message"]);
      }else{
        this.toaster.error("Invalid url");
      }
    })
  }
  cancel(){
    this.modalRef.hide();
    this.editUserProfileForm.reset();
    if(this.admin)
    {
      this.router.navigate(['/dashboard']);
    }
    else{
      this.router.navigate(['/user-dashboard']);
    }
  }
}
