import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn : boolean =false;
  admin : boolean = false;
  profileUrl : string = "";
  
  constructor(private authenticationService:AuthenticationService) {
    if (this.authenticationService['data']['authDetail'] && this.authenticationService['data']['authDetail']['type'][0] === 'Admin') {
      this.admin = true;
    }
    else{
      this.admin =false;
    }
   }

  ngOnInit(): void {
    this.isLoggedIn = this.authenticationService.isLoggedIn();
    console.log(this.authenticationService['data']['authDetail'])
    this.profileUrl = "http://localhost:3000/users/view/" + this.authenticationService['data']['authDetail']["profileUrl"];
  }

  logOut(){
    this.authenticationService.logOut();
    window.location.reload();
  }

}
