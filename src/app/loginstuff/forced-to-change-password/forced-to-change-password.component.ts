import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PasswordValidatorService } from 'src/app/util/validators/password-validator.service';
import { BackgroundThemingService } from 'src/app/util/theming/background-theming.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { AuthDetailsService } from 'src/app/model/services/auth/authDetails.service';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { NgForm } from '@angular/forms';
import { StringDTO } from 'src/app/model/dtos/string-dto.model';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { AuthService } from 'src/app/model/services/auth/auth.service';

@Component({
  selector: 'app-forced-to-change-password',
  templateUrl: './forced-to-change-password.component.html',
  styleUrls: ['./forced-to-change-password.component.scss']
})
export class ForcedToChangePasswordComponent implements OnInit {

  
  password: string = null;
  repeat_password: string = null;

  passwordDoNotMatch: boolean = false;
  passwordInvalid: boolean = false;
  serviceUnavailable: boolean = false; 
  passwordAlreadyUsed: boolean = false;

  resetPasswordCompleted : boolean = false;
  
  passwordResetInProgress : boolean = false;


  constructor(private activatedRoute: ActivatedRoute, private router: Router, private authService: AuthService,
                private translate: TranslateService, private passwordValidator: PasswordValidatorService,
                    private themingSrv: BackgroundThemingService, private exceptionHandler: ChainExceptionHandler,
                      private authDetailsSrv: AuthDetailsService, private notifier: MessageNotifierService) { 

  }



  ngOnInit() {
    this.themingSrv.setStandardColouredBackground();
  }


  resetPassword(form: NgForm){
    if(form.valid){
      this.executeResetPassword();
    }else{
      this.showOnlyPasswordInvalidError();
    }
  }

  isPasswordResetInProgress(): boolean{
    return this.passwordResetInProgress;
  }

  private executeResetPassword(): void{
    if(this.passwordResetInProgress){
      return;
    }
    this.passwordResetInProgress = true;
    this.clearAllErrorMessage();

    if(!this.makePreliminaryTest()){ //if preliminary test fails
      this.passwordResetInProgress = false;
      return;
    }

    this.authDetailsSrv.forcePasswordChangeToLogin(this.password).subscribe(
      (succ: GenericResponse<StringDTO>)=>{  
        this.authService.saveAuthToken(succ.data.value, false, false);
        this.notifier.notifySuccessWithI18nAndStandardTitle("pswreset.updated-credential");
        this.passwordResetInProgress = false;
        this.router.navigateByUrl('dashboard');
        this.password = null; //clear password from memory
        this.repeat_password = null; //clear password from memory
      },
      (error)=>{
        this.manageError(error);
        this.passwordResetInProgress = false;
      }
    );

  }

  manageError(error){
    let status = error.status;
    if(status==ChainExceptionHandler.SERVER_UNREACHABLE){
      this.showOnlyServiceUnavailableError();
      return;
    }
    if(status==ChainExceptionHandler.NOT_ACCEPTABLE){
      this.showOnlyPasswordAlreadyUsedMessage();
      return;
    }
    if(status==ChainExceptionHandler.UNAUTHORIZED){
      this.authService.logout();
      this.router.navigateByUrl("/login");
      return
    }
    this.exceptionHandler.manageErrorWithLongChain(status);
  }


  isResetPasswordCompleted(): boolean{
    return this.resetPasswordCompleted;
  }


  private makePreliminaryTest(): boolean{
    if(this.password==null){
      this.showOnlyPasswordInvalidError();
      return false;
    }
    if(!this.checkPasswordValidity(this.password)){
      this.showOnlyPasswordInvalidError();
      return false;
    }
    if(this.password!=this.repeat_password){
      this.showOnlyPasswordDoNotMatchError();
      return false;
    }
    
    return true;
  }



  private checkPasswordValidity(psw: string): boolean{
    return this.passwordValidator.isValidPassword(psw);
  }

  private showOnlyPasswordDoNotMatchError(): void{
    this.passwordDoNotMatch = true;
    this.passwordInvalid = false;
    this.serviceUnavailable = false;
    this.passwordAlreadyUsed = false;
  }

  private showOnlyPasswordInvalidError(): void{
    this.passwordDoNotMatch = false;
    this.passwordInvalid = true;
    this.serviceUnavailable = false;
    this.passwordAlreadyUsed = false;
  }

  private showOnlyServiceUnavailableError(): void{
    this.passwordDoNotMatch = false;
    this.passwordInvalid = false;
    this.serviceUnavailable = true;
    this.passwordAlreadyUsed = false;
  }

  private showOnlyPasswordAlreadyUsedMessage(): void{
    this.passwordDoNotMatch = false;
    this.passwordInvalid = false;
    this.serviceUnavailable = false;
    this.passwordAlreadyUsed = true;
  }

  private clearAllErrorMessage(): void{
    this.passwordDoNotMatch = false;
    this.passwordInvalid = false;
    this.serviceUnavailable = false;
    this.passwordAlreadyUsed = false;
  }


  showPasswordDoNotMatchError(): boolean{
    return this.passwordDoNotMatch;
  }

  showPasswordInvalidError(): boolean{
    return this.passwordInvalid;
  }

  showServiceUnavailableError(): boolean{
    return this.serviceUnavailable;
  }

  showPasswordAlreadyUsedMessage(): boolean{
    return this.passwordAlreadyUsed;
  }


}
