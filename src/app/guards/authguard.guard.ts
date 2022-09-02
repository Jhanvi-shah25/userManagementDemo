import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardGuard implements CanActivate {

  admin :any;
  constructor(private authenticationService : AuthenticationService,private router : Router){

  }

  //Check user is authenticated or not
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // console.log('in auth guard',this.authenticationService.data,this.authenticationService['data'],this.authenticationService['data']['authDetail'])
      // if(this.authenticationService['data']['authDetail']['type'][0] === 'Admin'){
      //   this.admin = true;
      // }else{
      //   this.admin = false;
      // }
      if(!this.authenticationService.isAuthenticated()){
        this.router.navigate(['/']);
        return false;
      }   
      return true;
  }
}
