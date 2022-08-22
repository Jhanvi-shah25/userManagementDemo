import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, retry, tap, throwError } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http:HttpClient,private authenticationService:AuthenticationService,private router:Router,private toaster:ToastrService) { }

  BASE_URL :string = "http://localhost:3000/";

  get(request: Request) {
    return this.http.get(this.BASE_URL + request["path"], {
        headers: this.getHeader(),
      })
      .pipe(
        tap((result:any) => {
          if (result["accessToken"]) {
            let data = this.authenticationService.getAuthDetail();
            data = {
              ...data,
              token: result["accessToken"],
            };
            this.authenticationService.setAuth(data);
          }
        }),
        retry(1),
        catchError(this.handleError.bind(this))
      )
  }

  handleError(error:HttpErrorResponse){
    let errorMessage = ""
    errorMessage = error.error.message;
    this.toaster.error(errorMessage);
    return throwError(errorMessage);
  }

  post(request: Request): Observable<any[]> {
    return this.http
      .post<any[]>(this.BASE_URL + request["path"], request["data"], {
        headers: this.getHeader(),
      })
      .pipe(
        map((result:any) => {
          if (result["accessToken"]) {
            let data = this.authenticationService.getAuthDetail();
            data = {
              ...data,
              token: result["accessToken"],
            };
            this.authenticationService.setAuth(data);
          }
          return result;
        }),
        retry(1),
        catchError(this.handleError.bind(this))
      );
  }

  getHeader(){
    const token = this.authenticationService.getToken();
    let header : HttpHeaders = new HttpHeaders({});
    if(this.authenticationService.getToken()){
      header = header.append("Access-Control-Allow-Origin","*");
      header = header.append('Authorization', 'bearer ' + token);
      // header = header.append('TOKEN',token);
      header = header.set('Content-Type','application/json')
    }
    return header;
  }

  patch(request:Request){
    return this.http.patch(this.BASE_URL + request["path"],request["data"],{
      headers : this.getHeader()
    });
  }

  delete(request: Request) {
    return this.http.delete(this.BASE_URL + request["path"], {
      headers: this.getHeader(),
    });
    
  }
}
export interface Request{
  path : string,
  data? : any
}
