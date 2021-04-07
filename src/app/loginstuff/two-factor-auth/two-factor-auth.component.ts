import { Component, OnInit } from '@angular/core';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { StandardErrorCode } from 'src/app/util/standard-error-code';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { BackgroundThemingService } from 'src/app/util/theming/background-theming.service';
import { AuthService } from 'src/app/model/services/auth/auth.service';
import { NgForm } from '@angular/forms';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { StringDTO } from 'src/app/model/dtos/string-dto.model';

@Component({
  selector: 'app-two-factor-auth',
  templateUrl: './two-factor-auth.component.html',
  styleUrls: ['./two-factor-auth.component.scss']
})
export class TwoFactorAuthComponent implements OnInit {

  otp: string;
  otpExpired : boolean = false;
  otpInvalid : boolean = false;
  connectionError : boolean = false;
  tooManyOTPRequestPerAccount: boolean = false;

  areCurrentRequestingAuthentication: boolean = false;

  constructor(private translate : TranslateService, private router: Router,
                private auth: AuthService, private themingSrv: BackgroundThemingService,
                  private exceptionHandler: ChainExceptionHandler, private notifier: MessageNotifierService
                    ) { }

  ngOnInit() {
    this.themingSrv.setStandardColouredBackground();
    this.hideAllErrors();
  }


  authenticate(form: NgForm){
    if(form.valid){
      this.executeAuthentication();
    }else{
      this.showOnlyInvalidOtpError();
    }
  }
  

  private executeAuthentication(){
      if(this.areCurrentRequestingAuthentication){
        return;
      }
      this.hideAllErrors();
      this.areCurrentRequestingAuthentication = true;
      this.auth.completeOTPAuthentication(this.otp)
      .subscribe(
              (res: GenericResponse<StringDTO>) =>{
                this.manageSuccessfullLogin(res);
                this.areCurrentRequestingAuthentication = false;
              },
              err=>{
                this.manageLoginError(err);
                this.areCurrentRequestingAuthentication = false;
              }
          );
  }

  goToLoginPage(){
    this.auth.logout();
    this.router.navigateByUrl("/login");
  }

  private manageSuccessfullLogin(res: GenericResponse<StringDTO>){
   
    if(res.subcode==StandardErrorCode.MUST_CHANGE_PASSWORD){
      this.auth.updateLoginStatus(true, false);
      this.router.navigateByUrl("/force_password_change");
      return;
    }
    
    this.auth.updateLoginStatus(false, false);
    this.router.navigateByUrl("/dashboard");
  }

  manageLoginError(error: HttpErrorResponse){
    let status: number = error.status;
    if(status==ChainExceptionHandler.SERVER_UNREACHABLE){
      this.showOnlyConnectionError();
      return;
    }
    if(status==ChainExceptionHandler.TOO_MANY_REQUESTS){ //bad request
      this.showOnlyManyOTPRequestPerAccount();
      return;
    }
    
    if(status==ChainExceptionHandler.FORBIDDEN){
      if(error.error.subcode==StandardErrorCode.INVALID_OTP_CODE){
        this.showOnlyInvalidOtpError();
        return;
      }
      if(error.error.subcode==StandardErrorCode.EXPIRED_OTP_CODE){
        this.showOnlyExpiredOtpError();
        return;
      }
      if(error.error.subcode==StandardErrorCode.MAX_OTP_ATTEMPT_REACHED){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.max-otp-attempt-reached");
        this.auth.logout();
        this.router.navigateByUrl("/login");
        return;
      }
      
    }

    if(status==ChainExceptionHandler.UNAUTHORIZED){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.expired-otp-session");
      this.auth.logout();
      this.router.navigateByUrl("/login");
      return;
    }
    
    this.showOnlyConnectionError();
    this.exceptionHandler.manageErrorWithLongChain(status);
    return;
  }

  private hideAllErrors(): void{
    this.otpExpired = false;
    this.otpInvalid = false;
    this.connectionError = false;
    this.tooManyOTPRequestPerAccount = false;
  }

  private showOnlyExpiredOtpError(): void{
    this.otpExpired = true;
    this.otpInvalid = false;
    this.connectionError = false;
    this.tooManyOTPRequestPerAccount = false;
  }

  private showOnlyInvalidOtpError(): void{
    this.otpExpired = false;
    this.otpInvalid = true;
    this.connectionError = false;
    this.tooManyOTPRequestPerAccount = false;
  }

  private showOnlyConnectionError(): void{
    this.otpExpired = false;
    this.otpInvalid = false;
    this.connectionError = true;
    this.tooManyOTPRequestPerAccount = false;
  }
  

  private showOnlyManyOTPRequestPerAccount(): void{
    this.otpExpired = false;
    this.otpInvalid = false;
    this.connectionError = false;
    this.tooManyOTPRequestPerAccount = true;
  }


}
