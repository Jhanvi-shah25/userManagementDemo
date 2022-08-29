import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn : boolean =false;
  constructor(private authenticationService:AuthenticationService) {

   }

  ngOnInit(): void {
    this.isLoggedIn = this.authenticationService.isLoggedIn();
  }

  logOut(){
    this.authenticationService.logOut();
  }

}
