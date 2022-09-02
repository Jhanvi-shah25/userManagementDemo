import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from './encryption.service';
const AUTH = "authDetail";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public data: AuthData = new AuthData();
  encrypt : any;

  constructor(public router: Router,public encryptionService:EncryptionService) {
    if (localStorage.getItem(AUTH) != null){
      let decrypt = this.encryptionService.decrypt(localStorage.getItem(AUTH) || '{}');
      this.data =JSON.parse(decrypt);
    }else{
      localStorage.clear();
    }
  }

  getToken(){
    if (localStorage.getItem(AUTH) != null){
      let decrypt = this.encryptionService.decrypt(localStorage.getItem(AUTH) || '{}');
      this.data =JSON.parse(decrypt);
    }
    return this.data.token;
  }

  getAuthDetail(){
    if (localStorage.getItem(AUTH) != null){
      let decrypt = this.encryptionService.decrypt(localStorage.getItem(AUTH) || '{}');
      this.data =JSON.parse(decrypt);
    }
    return this.data;
  }

  setAuth(data:AuthData){
    console.log('set auth data',data)
    this.data = data;
    localStorage.removeItem(AUTH);
    this.encrypt = this.encryptionService.encrypt(JSON.stringify(data))
    localStorage.setItem(AUTH, this.encrypt);
    let decrypt = this.encryptionService.decrypt(localStorage.getItem(AUTH) || '{}');
    this.data =JSON.parse(decrypt);
    this.getAuthDetail();
  }

  isAuthenticated() {
    if (localStorage.getItem(AUTH) != null){
      let decrypt = this.encryptionService.decrypt(localStorage.getItem(AUTH) || '{}');
      this.data =JSON.parse(decrypt);
    }
    return this.isLoggedIn();
  }

  isLoggedIn(){
    return localStorage.getItem('token') !== null;
  }

  logOut(){
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
export class AuthData{
  token: string = "";
  authDetail:any
}

