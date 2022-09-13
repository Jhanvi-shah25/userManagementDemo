import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from './services/api.service';
import { AuthenticationService } from './services/authentication.service';
import { ChatService } from './services/chat.service';

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
    private chatService:ChatService
  ) {
    console.log('see',this.authService.data,this.authService['data'],this.authService['data']['authDetail'])
    
      if (this.authService['data']['authDetail'] && this.authService['data']['authDetail']['type'][0] === 'Admin') {
        this.admin = true;
      }
      else{
        this.admin =false;
      }
    
    if (this.authService.isLoggedIn() === true && this.admin) {
      this.router.navigate(["/dashboard"]);
    }else{
      this.router.navigate(["/"]);
    }

    // this.router.events.subscribe((evt) => {
    //   console.log(evt,'evt');
    //   if (this.authService['data']['authDetail'] && this.authService['data']['authDetail']['type'][0] === 'Admin') {
    //     this.admin = true;
    //   }
    //   else{
    //     this.admin =false;
    //   }
  
    //   console.log(router.url,this.admin,router,router.url === '/dashboard')
    //   if ((router.url === '/dashboard' || router.url === '/addUsers' || router.url === '/taskDashboard' || router.url === '/addTask') && this.admin === false) {
    //     this.router.navigate(["/"]);
    //   }
    //   if (!(evt instanceof NavigationEnd)) {
    //     return;
    //   }
    //   window.scrollTo(0, 0)
    // });
 }


}
