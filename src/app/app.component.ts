import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './services/api.service';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'testProject';
  admin : boolean = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) {
    console.log('see',this.authService.data,this.authService['data'],this.authService['data']['authDetail'])
    if (this.authService.isLoggedIn() === true) {
      this.router.navigate(["/dashboard"]);
    }else{
      this.router.navigate(["/"]);
    }
 }
}
