import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { UserAttendanceDTO } from 'src/app/model/dtos/turnstile/user-attendance-dto.model';
import { TurnstileAttedanceService } from 'src/app/model/services/turnstile/turnstile-attendance.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { StandardErrorCode } from 'src/app/util/standard-error-code';


const TIME_MESSAGE_DURATION: number = 10000;

@Component({
  selector: 'app-turnstile-totem-modal',
  templateUrl: './turnstile-totem-modal.component.html',
  styleUrls: ['./turnstile-totem-modal.component.scss']
})
export class TurnstileTotemModalComponent implements OnInit {

  @ViewChild("turnstileModal", { static: true })
  turnstileModal: ElementRef;
  
  @ViewChild("continuousCicleInput", { static: false })
  continuousCicleInput: ElementRef;

  employeeIdInternal: string = null;
  addOperationInProgress: boolean = false;
  modalOpened: boolean = false;

  constructor(private notifier: MessageNotifierService, private exceptionHandler: ChainExceptionHandler,
                private turnstileAttendanceService: TurnstileAttedanceService) { 
            
  }

  ngOnInit(): void {
  }

  openTotem(): void{
    this.employeeIdInternal = null;
    this.addOperationInProgress = false;
    this.turnstileModal.nativeElement.style.display = 'block';
    this.modalOpened = true;

    this.refocusOnInput(); 
  }

  closeTotem(): void{
    this.turnstileModal.nativeElement.style.display = 'none';
    this.modalOpened = false;
  }

  registerAttendance(){
    if(this.addOperationInProgress){
      return;
    }

    this.registerAttendanceWithContinuousCicle()
  }

  private registerAttendanceWithContinuousCicle(){

    if(this.employeeIdInternal==null || this.employeeIdInternal==''){
      this.employeeIdInternal = null;
      this.notifier.notifyErrorWithI18nAndStandardTitle('message.employee-id-invalid');
      return;
    }

    this.addOperationInProgress = true;
    this.continuousCicleInput.nativeElement.disabled = true;

    
    let employeeId: string = this.employeeIdInternal+'';
    
    if(employeeId.startsWith(this.turnstileAttendanceService.companyId)){
      employeeId = this.employeeIdInternal.substring(this.turnstileAttendanceService.companyId.length);
    }

    this.addOperationInProgress = true;

    this.turnstileAttendanceService.registerNewAttendaceWithSwitchingType(
        employeeId, this.turnstileAttendanceService.currentTurnstileId
    ).subscribe(
      (succ: GenericResponse<UserAttendanceDTO>)=>{
        this.showWelcomeMessage(succ.data);
        this.reprepareModalForContinuousCicle();
        this.addOperationInProgress = false;
      },
      err=>{
        this.reprepareModalForContinuousCicle();
        this.addOperationInProgress = false;
        this.manageErrorOnRegisteringAttendance(err)
      }
    );
  }


  showWelcomeMessage(data: UserAttendanceDTO) {
    let nameAndSurname = '';
    if(data!=null && data.userProfile!=null){
      if(data.userProfile.name!=null){
        nameAndSurname = nameAndSurname+' '+data.userProfile.name+' ';
      }
      if(data.userProfile.surname!=null){
        nameAndSurname = nameAndSurname+' '+data.userProfile.surname;
      }
    }
    if(data.type=='ENTER'){
      this.notifier.notifySuccessWithI18n('label.welcome-en', "message.welcome-user", [nameAndSurname], TIME_MESSAGE_DURATION)
    }else{
      this.notifier.notifySuccessWithI18n('label.goodbye-en', "message.goodbye-user", [nameAndSurname], TIME_MESSAGE_DURATION)
    }
    
  }

  manageErrorOnRegisteringAttendance(err: HttpErrorResponse) {
    if(err.status==ChainExceptionHandler.NOT_FOUND){
      if(err.error.subcode==StandardErrorCode.USER_NOT_FOUND){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.user-not-found");
        return;
      }
    }

    if(err.status==ChainExceptionHandler.ENHANCE_CALM){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.wait-a-minut-to-make-another-request", 
                    [], TIME_MESSAGE_DURATION);
      return;
    }

    this.exceptionHandler.manageErrorWithLongChain(err.status)
  }
  
  refocusOnInput(){
    if(!this.modalOpened){
      return;
    }
    if(this.continuousCicleInput!=null && this.continuousCicleInput.nativeElement!=null){
      this.continuousCicleInput.nativeElement.disabled = false;
      this.continuousCicleInput.nativeElement.focus();
    }
  }

  reprepareModalForContinuousCicle(){
    this.employeeIdInternal = null;
    this.refocusOnInput();    
  }
  
}
