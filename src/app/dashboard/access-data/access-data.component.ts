import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AuthDetailsService } from 'src/app/model/services/auth/authDetails.service';
import { NgForm } from '@angular/forms';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { PasswordValidatorService } from 'src/app/util/validators/password-validator.service';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { AuthService } from 'src/app/model/services/auth/auth.service';
import { ResetAllServicesService } from 'src/app/model/services/reset-all-services.service';
import { Router } from '@angular/router';
import { ImpiegatoService } from 'src/app/model/services/impiegato/impiegato.service';
import { ChangeEmailRequestDTO } from 'src/app/model/dtos/change-email-request-dto.model';
import { StandardValidatorService } from 'src/app/util/validators/standard-validators.service';
import { StringDTO } from 'src/app/model/dtos/string-dto.model';
import { MyProfileService } from 'src/app/model/services/my-profile/my-profile.service';
import { environment } from 'src/environments/environment';
import { BackendUrlsService } from 'src/app/model/backend-urls.service';

@Component({
  selector: 'app-access-data',
  templateUrl: './access-data.component.html',
  styleUrls: ['./access-data.component.scss']
})
export class AccessDataComponent implements OnInit{
  
  repeatNewPassword: string;
  newPassword: string;
  oldPassword: string;
  changePasswordInProgress: boolean;
  changeEmailInProgress: boolean;

  changeEmailPassword: string;
  newEmail: string;

  currentImgURL: any = '';

  constructor(private authDetailsSrv: AuthDetailsService,
                private notifier: MessageNotifierService,
                  private confirmer: CustomConfirmationService,
                    private passwordValidator: PasswordValidatorService,
                      private exceptionHandler: ChainExceptionHandler,
                        private authService: AuthService,
                          private myProfileSrv: MyProfileService,
                                private backendUrlService: BackendUrlsService) { }

  ngOnInit() {
    this.changePasswordInProgress = false;
    this.changeEmailInProgress = false;
  }

  

  clearChangePasswordForm(){
    this.repeatNewPassword = "";
    this.newPassword = "";
    this.oldPassword = "";
  }


  get imgURL(){
    if(this.currentImgURL==null || this.currentImgURL==''){
      if(this.myProfileSrv.currentUser!=null && this.myProfileSrv.currentUser.userProfileImageDownloadToken!=null){
        return this.backendUrlService.buildUrlForUserProfileImageLink(this.myProfileSrv.currentUser.userProfileImageDownloadToken)
      }
      return './assets/images/profile.png';
    }
    return this.currentImgURL;
  }

  changePassword(form: NgForm){
    if(this.changePasswordInProgress){
      this.notifier.notifyWarningWithI18nAndStandardTitle("general.wait-previous-request-completion");
      return;
    }
    if(form.valid){
        if(!this.passwordValidator.arePasswordEquals(this.newPassword, this.repeatNewPassword)){
          this.notifier.notifyErrorWithI18nAndStandardTitle("pswreset.password-do-not-match-error");
          return;
        }
        if(this.passwordValidator.arePasswordEquals(this.oldPassword, this.newPassword)){
          this.notifier.notifyErrorWithI18nAndStandardTitle("profile.access-data.psw.password-is-in-use");
          return;
        }
        if(!this.passwordValidator.isValidPassword(this.newPassword)){
          this.notifier.notifyErrorWithI18nAndStandardTitle("pswreset.invalid-password-reset");
          return;
        }
        let that = this;
        this.confirmer.askConfirmationWithStandardTitleI18n("profile.access-data.psw.change-password-confirmation", 
        ()=>{that.executePasswordReset();}, () => {} );
        
    }else{
      this.notifier.notifyErrorWithI18nAndStandardTitle("generic.missing-data-to-continue");
    }

  }

  private executePasswordReset(){
    this.changePasswordInProgress = true;
    this.authDetailsSrv.changePassword(this.oldPassword, this.newPassword)
    .subscribe(
      (succ: GenericResponse<StringDTO>)=>{
        this.changePasswordInProgress = false;
        this.notifier.notifySuccessWithI18nAndStandardTitle("pswreset.updated-credential");
        this.authService.saveAuthToken(succ.data.value, false, false);
        this.clearChangePasswordForm(); //clear password from memory
      },
      (error)=>{
        this.changePasswordInProgress = false;
        this.manageErrorChangingPsw(error);
      }
    );
  }

  
  private manageErrorChangingPsw(error){
    let status = error.status;
    if(status==ChainExceptionHandler.FORBIDDEN){ //bad request
      this.notifier.notifyErrorWithI18nAndStandardTitle("profile.access-data.psw.current-password-not-valid");
      return;
    }
    if(status==ChainExceptionHandler.NOT_ACCEPTABLE){
      this.notifier.notifyErrorWithI18nAndStandardTitle("profile.access-data.psw.password-used-too-recently")
      return;
    }
    this.exceptionHandler.manageErrorWithLongChain(status);
  }


  get name(){
    if(this.myProfileSrv.currentUser!=null && this.myProfileSrv.currentUser.name!=null){
      return this.myProfileSrv.currentUser.name;
    }
    return '';
  }

  get surname(){
    if(this.myProfileSrv.currentUser!=null && this.myProfileSrv.currentUser.surname!=null){
      return this.myProfileSrv.currentUser.surname;
    }
    return '';
  }

  get email(){
    if(this.myProfileSrv.currentUser!=null && this.myProfileSrv.currentUser.email!=null){
      return this.myProfileSrv.currentUser.email;
    }
    return '';
  }

}
