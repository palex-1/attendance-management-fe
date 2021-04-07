import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { UserLevelDTO } from 'src/app/model/dtos/profile/user-level.dto';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { UserLevelsService } from 'src/app/model/services/settings/user-levels.service';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';

declare const $: any;

@Component({
  selector: 'app-user-level-modal',
  templateUrl: './user-level-modal.component.html',
  styleUrls: ['./user-level-modal.component.scss']
})
export class UserLevelModalComponent implements OnInit {
  
  @ViewChild("userLevelModal", { static: true })
  userLevelModal: ElementRef;

  @Output()
  onUpdateUserLevel: EventEmitter<UserLevelDTO> = new EventEmitter();

  private levelIdToUpdate: number = null;

  level: string;
  monthlyVacationDays : number;
	monthlyLeaveHours: number;
	bankHourEnabled: boolean = false;
	extraWorkPaid: boolean = false;

  addModeEnabled: boolean = null;
  editModeEnabled: boolean = null;

  addOperationInProgress: boolean = false;
  updateOperationInProgress: boolean = false;

  constructor(private authoritiesService: AuthoritiesService, private userLevelsService: UserLevelsService,
                private notifier: MessageNotifierService, private exceptionHandler: ChainExceptionHandler) { 
                  
  }

  ngOnInit(): void {
  }

  hasAuthority(authority: string[]){
    return this.authoritiesService.hasAuthority(authority);
  }

  private clearAllFields(){
    this.levelIdToUpdate = null;
    this.level = null;
    this.monthlyVacationDays = null;
    this.monthlyLeaveHours = null;
    this.bankHourEnabled = false;
    this.extraWorkPaid = false;
    this.addOperationInProgress = false;
    this.updateOperationInProgress = false;
  }

  openAddDialog(){
    this.clearAllFields();
    this.addModeEnabled = true;
    this.editModeEnabled = false;

    this.openDialog();
  }

  openEditDialog(userLevel: UserLevelDTO){
    this.clearAllFields();
    this.addModeEnabled = false;
    this.editModeEnabled = true;

    this.levelIdToUpdate = userLevel.id;
    this.level = userLevel.level;
    this.monthlyVacationDays = userLevel.monthlyVacationDays;
    this.monthlyLeaveHours = userLevel.monthlyLeaveHours;
    this.bankHourEnabled = userLevel.bankHourEnabled;
    this.extraWorkPaid = userLevel.extraWorkPaid;

    this.openDialog();
  }


  private openDialog(){
    $(this.userLevelModal.nativeElement).modal({backdrop: 'static', keyboard: false})
  }

  get showLoader(){
    if(this.addOperationInProgress || this.updateOperationInProgress){
      return true;
    }
    return false;
  }



  closeDialog(){
    if(this.addOperationInProgress || this.updateOperationInProgress){
      return;
    }
    $(this.userLevelModal.nativeElement).modal('hide');
  }

  private checkIfCurrentDataAreFilled(): boolean{
    if(this.level ==null || this.monthlyVacationDays==null || this.monthlyLeaveHours==null
          || this.bankHourEnabled==null  || this.extraWorkPaid==null){
      return false;
    }
    return true
  }


  addNewLevel(){
    if(this.addOperationInProgress){
      return;
    }
    if(!this.checkIfCurrentDataAreFilled()){
      this.notifier.notifyWarningWithI18nAndStandardTitle("message.missing-data-to-continue");
      return;
    }

    if(this.monthlyVacationDays<0 || this.monthlyLeaveHours<0){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.invalid-data");
      return;
    }

    let level: UserLevelDTO = new UserLevelDTO();
    level.level = this.level;
    level.bankHourEnabled = this.bankHourEnabled;
    level.extraWorkPaid = this.extraWorkPaid;
    level.monthlyLeaveHours = this.monthlyLeaveHours;
    level.monthlyVacationDays = this.monthlyVacationDays;

    this.addOperationInProgress = true;

    this.userLevelsService.addNewUserLevel(level).subscribe(
      succ=>{
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.level-successfully-added")
        this.addOperationInProgress = false;
        this.closeDialog();
      },
      (err: HttpErrorResponse)=>{
        this.addOperationInProgress = false;
        if(err.status==ChainExceptionHandler.CONFLICT_ERROR){
          this.notifier.notifySuccessWithI18nAndStandardTitle("message.a-level-with-same-level-already-exists")
          return;
        }

        this.exceptionHandler.manageErrorWithLongChain(err.status);
      }
    )
  }

  updateNewLevel(){
    if(this.updateOperationInProgress){
      return;
    }

    if(!this.checkIfCurrentDataAreFilled()){
      this.notifier.notifyWarningWithI18nAndStandardTitle("message.missing-data-to-continue");
      return;
    }
    if(this.monthlyVacationDays<0 || this.monthlyLeaveHours<0){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.invalid-data");
      return;
    }

    let level: UserLevelDTO = new UserLevelDTO();
    level.level = this.level;
    level.bankHourEnabled = this.bankHourEnabled;
    level.extraWorkPaid = this.extraWorkPaid;
    level.monthlyLeaveHours = this.monthlyLeaveHours;
    level.monthlyVacationDays = this.monthlyVacationDays;
    level.id = this.levelIdToUpdate;

    this.updateOperationInProgress = true;

    this.userLevelsService.updateUserLevel(level).subscribe(
      (succ: GenericResponse<UserLevelDTO>)=>{
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.successfully-updated")
        this.updateOperationInProgress = false;
        this.closeDialog();
        this.onUpdateUserLevel.emit(succ.data)
      },
      (err: HttpErrorResponse)=>{
        this.updateOperationInProgress = false;

        if(err.status==ChainExceptionHandler.CONFLICT_ERROR){
          this.notifier.notifySuccessWithI18nAndStandardTitle("message.a-level-with-same-level-already-exists")
          return;
        }

        this.exceptionHandler.manageErrorWithLongChain(err.status);
      }
    )
  }


}
