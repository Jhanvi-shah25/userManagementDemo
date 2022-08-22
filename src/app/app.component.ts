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

  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) {
    if (this.authService.isLoggedIn() === true) {
      this.router.navigate(["/dashboard"]);
    }else{
      this.router.navigate(["/"]);
    }
 }
}
