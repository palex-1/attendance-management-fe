import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { TranslateService } from '@ngx-translate/core';
import { Router } from "@angular/router";
import { BackgroundThemingService } from 'src/app/util/theming/background-theming.service';
import { AuthService } from 'src/app/model/services/auth/auth.service';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { ignoreElements } from 'rxjs/operators';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { StandardErrorCode } from 'src/app/util/standard-error-code';




@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  username: string;
  password: string;
  private loginError : boolean = false;
  private connectionError : boolean = false;
  private tooManyAuthenticationRequestPerAccount: boolean = false;

  areCurrentRequestingAuthentication: boolean = false;

  constructor(private translate : TranslateService, private router: Router,
                private auth: AuthService, private themingSrv: BackgroundThemingService,
                  private exceptionHandler: ChainExceptionHandler
                    ) { }

  ngOnInit() {
    this.themingSrv.setStandardColouredBackground();
    this.loginError = false;
    this.areCurrentRequestingAuthentication = false;
    this.hideAllErrors();
  }


  showLoginError() : boolean{
    return this.loginError;
  }

  showConnectionError() : boolean{
    return this.connectionError;
  }

  showTooManyAuthenticationErrorPerAccount(): boolean{
    return this.tooManyAuthenticationRequestPerAccount;
  }


  authenticate(form: NgForm){
    if(form.valid){
      this.executeAuthentication();
    }else{
      this.showOnlyLoginError();
    }
  }

  goToForgotPasswordPage(){
    if(this.areCurrentRequestingAuthentication){
      return;
    }
    this.router.navigateByUrl("/forgotPassword");
  }
  

  private executeAuthentication(){
        if(this.areCurrentRequestingAuthentication){
          return;
        }
        this.hideAllErrors();
        this.areCurrentRequestingAuthentication = true;
        this.auth.authenticate(this.username, this.password)
        .subscribe(
                (res: HttpResponse<GenericResponse<any>>) =>{
                  this.manageSuccessfullLogin(res);
                  this.areCurrentRequestingAuthentication = false;
                  this.password = null; //clear password from memory
                },
                err=>{
                  this.manageLoginError(err);
                  this.areCurrentRequestingAuthentication = false;
                }
            );
  }

  private manageSuccessfullLogin(res: HttpResponse<GenericResponse<any>>){
    let token: string = res.headers.get(environment.AUTH_HEADER);
    if(token==null || token.trim().length==0){
      this.showOnlyLoginError();
      return;
    }
    
    if(res.body.subcode==StandardErrorCode.TWO_FA_REQUIRED_CODE){
      this.auth.saveAuthToken(token, false, true);
      this.router.navigateByUrl("/two_factor_authentication");
      return;
    }
    
    if(res.body.subcode==StandardErrorCode.MUST_CHANGE_PASSWORD){
      this.auth.saveAuthToken(token, true, false);
      this.router.navigateByUrl("/force_password_change");
      return;
    }
    
    this.auth.saveAuthToken(token, false, false);
    this.router.navigateByUrl("/dashboard");
    
  }

  manageLoginError(error){
    let status: number = error.status;
    if(status==ChainExceptionHandler.SERVER_UNREACHABLE){
      this.showOnlyConnectionError();
      return;
    }
    if(status==ChainExceptionHandler.TOO_MANY_REQUESTS){ //bad request
      this.showOnlyTooManyAuthenticationRequestPerAccount();
      return;
    }
    if(status==ChainExceptionHandler.UNAUTHORIZED){
      this.showOnlyLoginError();
      return;
    }
    
    this.showOnlyConnectionError();
    this.exceptionHandler.manageErrorWithLongChain(status);
    return;

  }

  private hideAllErrors(): void{
    this.loginError = false;
    this.connectionError = false;
    this.tooManyAuthenticationRequestPerAccount = false;
  }

  private showOnlyLoginError(): void{
    this.loginError = true;
    this.connectionError = false;
    this.tooManyAuthenticationRequestPerAccount = false;
  }

  private showOnlyConnectionError(): void{
    this.loginError = false;
    this.connectionError = true;
    this.tooManyAuthenticationRequestPerAccount = false;
  }
  

  private showOnlyTooManyAuthenticationRequestPerAccount(): void{
    this.loginError = false;
    this.connectionError = false;
    this.tooManyAuthenticationRequestPerAccount = true;
  }





}
