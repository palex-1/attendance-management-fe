import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BackgroundThemingService } from 'src/app/util/theming/background-theming.service';
import { ImpiegatoService } from 'src/app/model/services/impiegato/impiegato.service';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { AuthService } from 'src/app/model/services/auth/auth.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';

@Component({
  selector: 'app-email-change',
  templateUrl: './email-change.component.html',
  styleUrls: ['./email-change.component.scss']
})
export class EmailChangeComponent implements OnInit {

  private authorization_token: string;
  isAuthenticated: boolean;
  tokenInvalid: boolean;
  emailOwnedByAnotherUser: boolean;
  changeEmailInProgress: boolean;

  constructor(private loading: LoadingService,
                private router: Router,
                  private themingSrv: BackgroundThemingService,
                    private impiegatoSrv: ImpiegatoService,
                      private activatedRoute: ActivatedRoute,
                        private notifier: MessageNotifierService,
                          private authService: AuthService,
                            private exceptionHandler: ChainExceptionHandler) { }


  ngOnInit() {
    this.isAuthenticated = this.authService.authenticated;
    this.themingSrv.setStandardColouredBackground();
    this.clearAllErrorMessages();
    this.authorization_token = this.activatedRoute.snapshot.params["token"];
    this.changeEmailInProgress = false;
  }

  completeEmailChange(){
    if(this.changeEmailInProgress){
      this.notifier.notifyWarningWithI18nAndStandardTitle("general.wait-previous-request-completion");
      return;

    }
    this.clearAllErrorMessages();
    this.changeEmailInProgress = true;
    this.impiegatoSrv.completeEmailChange(this.authorization_token).subscribe(
      (succ)=>{
         this.notifier.notifySuccessWithI18nAndStandardTitle("email-change.changed-successfully");
         let that = this;
         this.changeEmailInProgress = false;
         setTimeout(() => {
            that.router.navigateByUrl("/dashboard");
         }, 1000);
      },
      (err)=>{
        this.manageError(err);
        this.changeEmailInProgress = false;
      }
    );
  }

  manageError(error){
    let status: number = error.status;
    if(status==ChainExceptionHandler.FORBIDDEN){
      this.notifier.notifyErrorWithI18nAndStandardTitle("email-change.token-invalid");
      this.showOnlyTokenInvalid();
      return;
    }
    if(status==ChainExceptionHandler.UNPROCESSABLE_ENTITY){
      this.notifier.notifyErrorWithI18nAndStandardTitle("email-change.email-owned-by-another-user");
      this.showOnlyEmailOwnedByAnotherUser();
      return;
    }
    this.exceptionHandler.manageErrorWithLongChain(status);
  }

  private clearAllErrorMessages(){
    this.tokenInvalid = false;
    this.emailOwnedByAnotherUser = false;
  }

  private showOnlyTokenInvalid(){
    this.tokenInvalid = true;
    this.emailOwnedByAnotherUser = false;
  }

  private showOnlyEmailOwnedByAnotherUser(){
    this.tokenInvalid = false;
    this.emailOwnedByAnotherUser = true;
  }

}
