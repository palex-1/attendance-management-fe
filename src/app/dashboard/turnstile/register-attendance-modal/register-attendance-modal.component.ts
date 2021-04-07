import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AttendanceTypePipe } from 'src/app/util/pipes/attendance-type.pipe';
import { DateUtils } from 'src/app/util/dates/date-utils';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { MonthPickEvent } from '../../components/monthpicker/monthpicker.component';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { TurnstileAttedanceService } from 'src/app/model/services/turnstile/turnstile-attendance.service';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { UserAttendanceDTO } from 'src/app/model/dtos/turnstile/user-attendance-dto.model';
import { HttpErrorResponse } from '@angular/common/http';
import { StandardErrorCode } from 'src/app/util/standard-error-code';

declare const $: any;

@Component({
  selector: 'app-register-attendance-modal',
  templateUrl: './register-attendance-modal.component.html',
  styleUrls: ['./register-attendance-modal.component.scss']
})
export class RegisterAttendanceModalComponent implements OnInit {
  
  @ViewChild("registerAttendanceModal", { static: true })
  registerAttendanceModal: ElementRef;

  @ViewChild("continuousCicleInput", { static: false })
  continuousCicleInput: ElementRef;


  addOperationInProgress: boolean = false;

  continuousCicleEnabled: boolean = false;
  employeeIdInternal: string = null;
  enterType: string = null;
  attendanceTime: Date = new Date();
  timeOfAttendance: NgbTimeStruct = {hour: 0, minute: 0, second: 0};

  constructor(private notifier: MessageNotifierService, private exceptionHandler: ChainExceptionHandler,
                private turnstileAttendanceService: TurnstileAttedanceService) { 

  }


  ngOnInit(): void {
  }

  resetAllFields() {
    this.employeeIdInternal = null;
    this.rebuildTimeOfAttendance();
    this.continuousCicleEnabled = false;
  }

  rebuildTimeOfAttendance(){
    this.attendanceTime = new Date();
    this.timeOfAttendance = {hour: this.attendanceTime.getHours(), minute: this.attendanceTime.getMinutes(), second: this.attendanceTime.getSeconds()};
  }

  get allAttendanceType(): string[] {
    return AttendanceTypePipe.ALL_ATTENDANCE_TYPE;
  }

  openRegisterAttendanceModal() {
    this.resetAllFields();
    this.openDialog();
  }
  

  private openDialog(){
    $(this.registerAttendanceModal.nativeElement).modal({backdrop: 'static', keyboard: false})
  }

  get showLoader(){
    if(this.addOperationInProgress){
      return true;
    }
    return false;
  }

  closeDialog(){
    if(this.addOperationInProgress){
      return;
    }
    $(this.registerAttendanceModal.nativeElement).modal('hide');
  }

  onChangeDateOfAttedance(event: MonthPickEvent){
    let parkDate = null;
    if(event!=null){
      parkDate = new Date(event.year, event.month, event.day);
    }
    this.attendanceTime = parkDate;
  }

  registerAttendance(){
    if(this.addOperationInProgress){
      return;
    }
    if(this.continuousCicleEnabled){
      this.registerAttendanceWithContinuousCicle()
    }else{
      this.registerAttendanceFixed()
    }

  }

  private registerAttendanceFixed(){

    if(this.attendanceTime==null || this.timeOfAttendance==null || this.timeOfAttendance.hour==null 
            || this.timeOfAttendance.minute==null || this.timeOfAttendance.second==null){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.bad-data");
      return;
    }

    if(this.enterType==null){
      this.notifier.notifyErrorWithI18nAndStandardTitle('message.select-type-of-attendance-before-starting-the-cicle');
      this.employeeIdInternal = null;
      return;
    }

    if(this.employeeIdInternal==null || this.employeeIdInternal==''){
      this.employeeIdInternal = null;
      this.notifier.notifyErrorWithI18nAndStandardTitle('message.employee-id-invalid');
      return;
    }
    let employeeId: string = this.employeeIdInternal+'';
    
    if(employeeId.startsWith(this.turnstileAttendanceService.companyId)){
      employeeId = employeeId.substring(this.turnstileAttendanceService.companyId.length);
    }

    let dateOfAttendance = new Date(this.attendanceTime.getFullYear(), this.attendanceTime.getMonth(), this.attendanceTime.getDate(),
                    this.timeOfAttendance.hour, this.timeOfAttendance.minute, this.timeOfAttendance.second);

    dateOfAttendance = DateUtils.buildUTCDateWithSecondsFromDate(dateOfAttendance);

    this.addOperationInProgress = true;

    this.turnstileAttendanceService.registerNewAttendace(
      employeeId, this.turnstileAttendanceService.currentTurnstileId, this.enterType, dateOfAttendance
      ).subscribe(
        (succ: GenericResponse<UserAttendanceDTO>)=>{
          this.notifier.notifySuccessWithI18nAndStandardTitle("message.attendance-successfully-added")
          this.addOperationInProgress = false;
          this.closeDialog();
        },
        err=>{
          this.addOperationInProgress = false;
          this.manageErrorOnRegisteringAttendance(err)
        }
      );
  
  }
  manageErrorOnRegisteringAttendance(err: HttpErrorResponse) {
    if(err.status==ChainExceptionHandler.NOT_FOUND){
      if(err.error.subcode==StandardErrorCode.USER_NOT_FOUND){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.user-not-found");
        return;
      }
    }

    this.exceptionHandler.manageErrorWithLongChain(err.status)
  }










  private registerAttendanceWithContinuousCicle(){
    if(this.enterType==null){
      this.notifier.notifyErrorWithI18nAndStandardTitle('message.select-type-of-attendance-before-starting-the-cicle');
      this.employeeIdInternal = null;
      return;
    }

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

    this.turnstileAttendanceService.registerNewAttendace(
        employeeId, this.turnstileAttendanceService.currentTurnstileId, this.enterType
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
      this.notifier.notifySuccessWithI18n('label.welcome-en', "message.welcome-user", [nameAndSurname])
    }else{
      this.notifier.notifySuccessWithI18n('label.goodbye-en', "message.goodbye-user", [nameAndSurname])
    }
    
  }

  reprepareModalForContinuousCicle(){
    this.employeeIdInternal = null;

    if(this.continuousCicleInput!=null && this.continuousCicleInput.nativeElement!=null){
      this.continuousCicleInput.nativeElement.disabled = false;
      this.continuousCicleInput.nativeElement.focus();
    }
  }



}
