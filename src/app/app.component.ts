import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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
    // console.log('see',this.authService.data,this.authService['data'],this.authService['data']['authDetail'])
    // if (this.authService.isLoggedIn() === true) {
    //   this.router.navigate(["/dashboard"]);
    // }else{
    //   this.router.navigate(["/"]);
    // }


    //try
    this.router.events.subscribe((evt) => {

      console.log('see1',this.authService.data,this.authService['data'],this.authService['data']['authDetail'])
      if (this.authService['data']['authDetail'] && this.authService['data']['authDetail']['type'][0] === 'Admin') {
        console.log('yes admin true')
        this.admin = true;
      }
      else{
        console.log('as a user')
        this.admin =false;
      }
      if ((router.url == '/dashboard' || router.url == '/addUsers' || router.url == '/taskDashboard' || router.url == '/addTask') && this.admin == false) {
        this.router.navigate(['/'])
      }
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
 }
}
