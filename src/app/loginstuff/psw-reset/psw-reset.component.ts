import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PasswordValidatorService } from '../../util/validators/password-validator.service';
import { BackgroundThemingService } from 'src/app/util/theming/background-theming.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { AuthDetailsService } from 'src/app/model/services/auth/authDetails.service';
import { ResetPasswordCompleteDTO } from 'src/app/model/dtos/reset-password-complete-dto';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';


@Component({
  selector: 'app-psw-reset',
  templateUrl: './psw-reset.component.html',
  styleUrls: ['./psw-reset.component.scss']
})
export class PswResetComponent implements OnInit {

  

  private authorization_token : string = null;

  password: string = null;
  repeat_password: string = null;
  private notValidToken: boolean = false;
  private passwordDoNotMatch: boolean = false;
  private passwordInvalid: boolean = false;
  private serviceUnavailable: boolean = false; 
  private passwordAlreadyUsed: boolean = false;
  private internalServerError: boolean = false;

  private resetPasswordCompleted : boolean = false;
  
  private passwordResetInProgress : boolean = false;


  constructor(private activatedRoute: ActivatedRoute, 
                  private router: Router,
                    private translate: TranslateService,
                      private passwordValidator: PasswordValidatorService,
                        private themingSrv: BackgroundThemingService,
                          private exceptionHandler: ChainExceptionHandler,
                            private authDetailsSrv: AuthDetailsService,
                              private notifier: MessageNotifierService) { 

  }



  ngOnInit() {
    this.themingSrv.setStandardColouredBackground();
    
    this.authorization_token = this.activatedRoute.snapshot.params["token"];
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
    this.resetPasswordCompleted = false;
    this.passwordResetInProgress = true;
    this.clearAllErrorMessage();

    if(!this.makePreliminaryTest()){ //if preliminary test fails
      this.passwordResetInProgress = false;
      return;
    }
    let reset: ResetPasswordCompleteDTO = new ResetPasswordCompleteDTO(this.authorization_token, this.password);

    this.authDetailsSrv.completePasswordRecovery(reset).subscribe(
      (succ)=>{
        this.passwordResetInProgress = false;
        this.password = null; //clear password from memory
        this.repeat_password = null; //clear password from memory
        this.resetPasswordCompleted = true;
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
    if(status==ChainExceptionHandler.FORBIDDEN || status==ChainExceptionHandler.UNAUTHORIZED){
      this.showOnlyAuthorizationTokenErrorMessage();
      return;
    }
    if(status==ChainExceptionHandler.NOT_ACCEPTABLE){
      this.showOnlyPasswordAlreadyUsedMessage();
      return;
    }

    this.showOnlyInternalServerError();
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
    if(this.authorization_token == null || this.authorization_token== "null"){
      this.showOnlyAuthorizationTokenErrorMessage();
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


  goToLogin(){

    if(this.passwordResetInProgress){
      return;
    }
    this.router.navigateByUrl('/login')
  }

  private checkPasswordValidity(psw: string): boolean{
    return this.passwordValidator.isValidPassword(psw);
  }

  private showOnlyAuthorizationTokenErrorMessage(): void{
    this.notValidToken = true;
    this.passwordDoNotMatch = false;
    this.passwordInvalid = false;
    this.serviceUnavailable = false;
    this.passwordAlreadyUsed = false;
    this.internalServerError = false;
  }

  private showOnlyPasswordDoNotMatchError(): void{
    this.notValidToken = false;
    this.passwordDoNotMatch = true;
    this.passwordInvalid = false;
    this.serviceUnavailable = false;
    this.passwordAlreadyUsed = false;
    this.internalServerError = false;
  }

  private showOnlyPasswordInvalidError(): void{
    this.notValidToken = false;
    this.passwordDoNotMatch = false;
    this.passwordInvalid = true;
    this.serviceUnavailable = false;
    this.passwordAlreadyUsed = false;
    this.internalServerError = false;
  }

  private showOnlyServiceUnavailableError(): void{
    this.notValidToken = false;
    this.passwordDoNotMatch = false;
    this.passwordInvalid = false;
    this.serviceUnavailable = true;
    this.passwordAlreadyUsed = false;
    this.internalServerError = false;
  }

  private showOnlyPasswordAlreadyUsedMessage(): void{
    this.notValidToken = false;
    this.passwordDoNotMatch = false;
    this.passwordInvalid = false;
    this.serviceUnavailable = false;
    this.passwordAlreadyUsed = true;
    this.internalServerError = false;
  }

  private showOnlyInternalServerError(): void{
    this.notValidToken = false;
    this.passwordDoNotMatch = false;
    this.passwordInvalid = false;
    this.serviceUnavailable = false;
    this.passwordAlreadyUsed = false;
    this.internalServerError = true;
  }

  private clearAllErrorMessage(): void{
    this.notValidToken = false;
    this.passwordDoNotMatch = false;
    this.passwordInvalid = false;
    this.serviceUnavailable = false;
    this.passwordAlreadyUsed = false;
    this.internalServerError = false;
  }

  //getter for show message error

  showAuthorizationTokenErrorMessage(): boolean{
    return this.notValidToken;
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

  showInternalServerError(): boolean{
    return this.internalServerError;
  }

}
