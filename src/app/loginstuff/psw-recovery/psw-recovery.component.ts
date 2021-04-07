import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { TranslateService } from '@ngx-translate/core';
import { Router } from "@angular/router";
import { StandardValidatorService } from '../../util/validators/standard-validators.service';
import { BackgroundThemingService } from 'src/app/util/theming/background-theming.service';
import { AuthDetailsService } from 'src/app/model/services/auth/authDetails.service';
import { ChangePasswordRequestDTO } from 'src/app/model/dtos/change-password-request-dto.model';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';




@Component({
  templateUrl: './psw-recovery.component.html',
  styleUrls: ['./psw-recovery.component.scss']
})
export class PswRecoveryComponent implements OnInit {

  disableButtonReset: boolean = false;
  email: string;
  private invalidUsername : boolean = false;
  private notValidEmailMessage : boolean = false;
  private connectionError : boolean = false;
  private notAcceptedRequest : boolean = false;
  private tooManyRequestError: boolean = false;
  private internalError: boolean = false;

  private resetPasswordCompleted : boolean = false;

  private emailFromIsShown : boolean = false;
  private passwordRecoveryInProgress: boolean = false;

  constructor(private standarsValidator: StandardValidatorService,
                private themingSrv: BackgroundThemingService, private router: Router,
                  private authDetailsSrv: AuthDetailsService, private exceptionHandler: ChainExceptionHandler) { }



  ngOnInit() {
    this.themingSrv.setStandardColouredBackground();
  }


  isValidUsername(username: string): boolean{
    if(username==null || username=="null"){
      return false;
    }
    return true;
  }


  showNotValidUsernameMessage(): void{
      this.invalidUsername = true;
  }

  isNotValidUsername(): boolean{
    return this.invalidUsername;
  }

  showNotAcceptedRequestErrors(): boolean{
    return this.notAcceptedRequest;
  }

  showTooManyRequestErrors(): boolean{
    return this.tooManyRequestError;
  }

  showInternalError(): boolean{
    return this.internalError;
  }
  
  goToLogin(){
    if(this.passwordRecoveryInProgress){
      return;
    }
    this.router.navigateByUrl('/login')
  }

  recoverPasswordUsingEmail(form: NgForm){
    if(this.passwordRecoveryInProgress){
      return; //in 
    }
    this.clearAllErrorMessage();
    this.passwordRecoveryInProgress = true;

    if(form!=null){
      if(this.isValidEmail(this.email)){
          this.requestRecoverEmailUsingEmail();
      }else{
          this.showNotValidEmailMessageOnly();
          this.passwordRecoveryInProgress = false;
      }
    }
    
  }

  isPasswordRecoveryInProgress(): boolean{
    return this.passwordRecoveryInProgress;
  }


  private showEmailForm(): boolean{
    return this.emailFromIsShown;
  }

  private showEmailRecoveryForm(): void{
    this.emailFromIsShown = true;
  }


  private requestRecoverEmailUsingEmail(): void{
    this.passwordRecoveryInProgress = true;
    
    this.authDetailsSrv.requestPasswordRecovery(this.email.trim()).subscribe(
      (succ)=>{
        this.resetPasswordCompleted = true;
        this.passwordRecoveryInProgress = false;
      },
      (error)=>{
        this.manageError(error);
        this.passwordRecoveryInProgress = false;
      }
    )
   
  }



  manageError(error){
    let status = error.status;
    if(status==ChainExceptionHandler.SERVER_UNREACHABLE){
      this.showOnlyConnectionError();
      return;
    }
    if(status==ChainExceptionHandler.INTERNAL_SERVER_ERROR){
      this.showInternalErrorOnly();
      return;
    }
    if(status==ChainExceptionHandler.TOO_MANY_REQUESTS){
      this.showTooManyRequestErrorOnly();
      return;
    }
    this.exceptionHandler.manageErrorWithLongChain(status);
    
  }



  private disabledSubmitButton(): boolean{
    return this.disableButtonReset;
  }
  

  isResetPasswordCompleted(): boolean{
    return this.resetPasswordCompleted;
  }

  private isValidEmail(email: string): boolean{
    return this.standarsValidator.isValidEmail(email);
  }


  thereAreConnectionErrors(): boolean{
    return this.connectionError;
  }

  isNotValidEmailMessage(): boolean{
    return this.notValidEmailMessage;
  }

  isNotAcceptedRequest(): boolean{
    return this.notAcceptedRequest;
  }

  showInternalErrorOnly(): void{
    this.notValidEmailMessage = false;
    this.connectionError = false;
    this.notAcceptedRequest = false;
    this.tooManyRequestError = false;
    this.internalError = true;
  }

  showNotValidEmailMessageOnly(): void{
    this.notValidEmailMessage = true;
    this.connectionError = false;
    this.notAcceptedRequest = false;
    this.tooManyRequestError = false;
    this.internalError = false;
  }

  showTooManyRequestErrorOnly(): void{
    this.notValidEmailMessage = false;
    this.connectionError = false;
    this.notAcceptedRequest = false;
    this.tooManyRequestError = true;
    this.internalError = false;
  }

  showOnlyConnectionError(): void {
    this.notValidEmailMessage = false;
    this.connectionError = true;
    this.notAcceptedRequest = false;
    this.tooManyRequestError = false;
    this.internalError = false;
  }

  showOnlyNotAcceptedRequestErrors(): void{
    this.notValidEmailMessage = false;
    this.connectionError = false;
    this.notAcceptedRequest = true;
    this.tooManyRequestError = false;
    this.internalError = false;
  }

  private clearAllErrorMessage(): void{
    this.notValidEmailMessage = false;
    this.connectionError = false;
    this.notAcceptedRequest = false;
    this.tooManyRequestError = false;
    this.internalError = false;
  }


}