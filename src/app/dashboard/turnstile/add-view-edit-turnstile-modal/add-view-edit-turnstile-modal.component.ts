import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { TurnstileDTO } from 'src/app/model/dtos/turnstile/turnstile-dto.model';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { TurnstileService } from 'src/app/model/services/turnstile/turnstile.service';
import { StringUtils } from 'src/app/util/string/string-utils';
import { HttpErrorResponse } from '@angular/common/http';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { TurnstileTypePipe } from 'src/app/util/pipes/turnstile-type.pipe';


declare const $: any;

@Component({
  selector: 'app-add-view-edit-turnstile-modal',
  templateUrl: './add-view-edit-turnstile-modal.component.html',
  styleUrls: ['./add-view-edit-turnstile-modal.component.scss']
})
export class AddViewEditTurnstileModalComponent implements OnInit {
  
  
  @ViewChild("addViewEditTurnstileModal", { static: true })
  addViewEditTurnstileModal: ElementRef;

  @Output()
  onUpdateTurnstile: EventEmitter<TurnstileDTO> = new EventEmitter();

  @Output()
  onAddTurnstile: EventEmitter<TurnstileDTO> = new EventEmitter();

  addOperationInProgress: boolean = false;
  updateOperationInProgress: boolean = false;
  credentialsOperationInProgress: boolean = false;
  

  editDialogEnabled: boolean = false;
  createDialogEnabled: boolean = false;


  title: string = '';
  description: string = '';
  position: string = '';
  enabled: boolean = true;
  type: string = '';
  
  clientSecret: string = '';
  clientId: string = '';

  private clientSecretInternal: string = '';
  private clientIdInternal: string = '';


  credentialHidden: boolean = true;

  private currentTurnstileId= null;

  constructor(private authoritiesService: AuthoritiesService, private turnstileService: TurnstileService,
                  private notifier: MessageNotifierService, private exceptionHandler: ChainExceptionHandler) { 
      
  }

  ngOnInit(): void {
  }

  get allTurnstileType(): string[] {
    return TurnstileTypePipe.ALL_TURNSTILE_TYPE;
  }

  hasAuthority(authority: string[]){
    return this.authoritiesService.hasAuthority(authority);
  }

  clearAllFields(){
    this.title = '';
    this.description = '';
    this.position = '';
    this.enabled = true;
    this.type = '';
    this.currentTurnstileId = null;

    this.credentialHidden = true;
    this.clientSecretInternal = '';
    this.clientIdInternal = '';
    this.clientSecret = '';
    this.clientId = '';
  }


  hideCredentials(){
    this.clientSecretInternal = '';
    this.clientIdInternal = '';
    this.clientSecret = '';
    this.clientId = '';

    this.credentialHidden = true;
  }

  openCreateDialog() {
    this.editDialogEnabled = false;
    this.createDialogEnabled = true;

    this.clearAllFields();
    this.openDialog();
  }

  openEditDialog(turnstile: TurnstileDTO) {
    this.editDialogEnabled = true;
    this.createDialogEnabled = false;
    this.clearAllFields();

    this.currentTurnstileId = turnstile.id;
    this.title = turnstile.title;
    this.description = turnstile.description;
    this.position = turnstile.position;
    this.enabled = !turnstile.deactivated;
    this.type = turnstile.type;

    this.openDialog();
  }



  showCredentials(){
    if(this.updateOperationInProgress || this.credentialsOperationInProgress){
      return;
    }

    this.credentialsOperationInProgress = true;

    this.turnstileService.findTurnstileDetails(this.currentTurnstileId).subscribe(
      (succ: GenericResponse<TurnstileDTO>)=>{
        this.credentialsOperationInProgress = false;
        this.clientIdInternal = succ.data.clientId;
        this.clientSecretInternal = succ.data.clientSecret;

        this.clientSecret = this.clientSecretInternal;
        this.clientId = this.clientIdInternal;

        this.credentialHidden = false;
      },
      err=>{
        this.exceptionHandler.manageErrorWithLongChain(err.status);
        this.credentialsOperationInProgress = false;
      }
    )

  }

  private openDialog(){
    $(this.addViewEditTurnstileModal.nativeElement).modal({backdrop: 'static', keyboard: false})
  }

  get showLoader(){
    if(this.addOperationInProgress || this.updateOperationInProgress|| this.credentialsOperationInProgress){
      return true;
    }
    return false;
  }

  closeDialog(){
    if(this.addOperationInProgress || this.updateOperationInProgress || this.credentialsOperationInProgress){
      return;
    }
    $(this.addViewEditTurnstileModal.nativeElement).modal('hide');
  }


  addNewTurnstile(){
    if(this.addOperationInProgress){
      return;
    }
    if(StringUtils.nullOrEmpty(this.title) || StringUtils.nullOrEmpty(this.description) 
        || StringUtils.nullOrEmpty(this.position) || StringUtils.nullOrEmpty(this.type)){
        this.notifier.notifyWarningWithI18nAndStandardTitle("message.missing-data-to-continue");
        return;
    }

    this.addOperationInProgress = true;


    this.turnstileService.addNewTurnstile(this.title, this.description, this.position, this.enabled, this.type)
    .subscribe(
      (succ: GenericResponse<TurnstileDTO>)=>{
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.turnstile-successfully-added")
        this.addOperationInProgress = false;
        this.closeDialog();
        this.onAddTurnstile.emit(succ.data)
      },
      (err: HttpErrorResponse)=>{
        this.addOperationInProgress = false;
        this.exceptionHandler.manageErrorWithLongChain(err.status);
      }
    )

  }

  updateTurnstile(){
    if(this.updateOperationInProgress || this.credentialsOperationInProgress){
      return;
    }

    if(StringUtils.nullOrEmpty(this.title) || StringUtils.nullOrEmpty(this.description) 
        || StringUtils.nullOrEmpty(this.position)){
        this.notifier.notifyWarningWithI18nAndStandardTitle("message.missing-data-to-continue");
        return;
    }

    let request: TurnstileDTO = new TurnstileDTO();
    request.title = StringUtils.trim(this.title);
    request.deactivated = !this.enabled;
    request.position= StringUtils.trim(this.position);
    request.description = StringUtils.trim(this.description);
    request.id = this.currentTurnstileId;

    this.updateOperationInProgress = true;

    this.turnstileService.updateTurnstile(request).subscribe(
      (succ: GenericResponse<TurnstileDTO>) => {
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.successfully-updated");
        this.updateOperationInProgress = false;
        this.closeDialog();
        this.onUpdateTurnstile.emit(succ.data)
      },
      (err: HttpErrorResponse)=>{
        this.updateOperationInProgress = false;
        this.exceptionHandler.manageErrorWithLongChain(err.status);
      }
    )

  }

  resetClientId(){
    this.clientId = this.clientIdInternal;
  }

  resetClientSecret(){
    this.clientSecret = this.clientSecretInternal;
  }

  // changeTurnstileSecret(){
  //   if(this.credentialsOperationInProgress){
  //     return;
  //   }

  //   this.credentialsOperationInProgress = true;

  //   this.turnstileService.changeTurnstileSecret(this.currentTurnstileId).subscribe(
  //     (succ: GenericResponse<TurnstileDTO>)=>{
  //       this.credentialsOperationInProgress = false;
  //       this.clientIdInternal = succ.data.clientId;
  //       this.clientSecretInternal = succ.data.clientSecret;

  //       this.clientSecret = this.clientSecretInternal;
  //       this.clientId = this.clientIdInternal;

  //       this.credentialHidden = false;
  //     },
  //     err=>{
  //       this.exceptionHandler.manageErrorWithLongChain(err.status);
  //       this.credentialsOperationInProgress = false;
  //     }
  //   )


  // }
}
