import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {BsModalRef,BsModalService} from 'ngx-bootstrap/modal';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  modalRef!: BsModalRef;
  changePasswordForm : FormGroup;
  constructor(private modalService : BsModalService,private formBuilder : FormBuilder,private router:Router) { 
    this.changePasswordForm = this.formBuilder.group({
      oldPwd : ['',Validators.required],
      newPwd : ['',Validators.required],
      confirmPwd : ['',Validators.required]
    })
  }

  ngOnInit(): void {
    $('#change-password').click();
  }


  public openModalChangePassword(changePassword:TemplateRef<any>){
    this.modalRef = this.modalService.show(changePassword,
      Object.assign({}, { class: 'gray modal-lg' }) )
  }

  onSubmit(){
    console.log(this.changePasswordForm.value);
  }

  cancel(){
    this.modalRef.hide();
    this.changePasswordForm.reset();
    this.router.navigate(['/dashboard']);
  }

  get form(){
    return this.changePasswordForm.controls;
  }

}
