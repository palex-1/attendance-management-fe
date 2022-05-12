import { Component, OnInit, EventEmitter, Output, ElementRef, ViewChild, Input } from '@angular/core';
import { EmployeeManagementService } from 'src/app/model/services/impiegato/employee-management.service';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { MonthPickEvent } from '../../components/monthpicker/monthpicker.component';
import { PermissionUserGroupLabel } from 'src/app/model/dtos/profile/permission-user-group-label.dto';
import { CompanyDTO } from 'src/app/model/dtos/company/company.dto';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { StringUtils } from 'src/app/util/string/string-utils';
import { HttpErrorResponse } from '@angular/common/http';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { UserProfileDTO } from 'src/app/model/dtos/profile/user-profile.dto';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { StandardErrorCode } from 'src/app/util/standard-error-code';
import { UserLevelDTO } from 'src/app/model/dtos/profile/user-level.dto';

declare const $: any;

@Component({
  selector: 'app-add-new-employee',
  templateUrl: './add-new-employee.component.html',
  styleUrls: ['./add-new-employee.component.scss']
})
export class AddNewEmployeeComponent implements OnInit {

  @ViewChild("addNewEmployeeModal", { static: true })
  addTeamMemberModal: ElementRef;

  @Output()
  onSaveClick: EventEmitter<any> = new EventEmitter<any>();

  addOperationInProgress: boolean = false;
  showLoaderInModal: boolean = false;
  
	email : string = '';
	phoneNumber : string = '';
	permissionGroupLabelId : number = null;
	name : string = '';
	surname : string = '';
	sex : string = '';
	fiscalCode : string = '';
	private birthDate: Date = null;
	private dateOfEmployment: Date = null;
	levelIdField : number = null;
  companyId : number = null;
  workedHoursField: number = null;
  vacationDaysField: number = null;
  leaveHoursField: number = null;
  employmentOffice: string = null;
  hourlyCost: number = 0;

  permissionsUserGroupsLabels: PermissionUserGroupLabel[] = [];
  companies: CompanyDTO[] = [];
  levels: UserLevelDTO[] = [];
  employmentOffices: string[] = [];

  constructor(private employeeManagementService: EmployeeManagementService, private exceptionHandler: ChainExceptionHandler,
                private authoritiesService: AuthoritiesService, private notifier: MessageNotifierService) { 
  }

  ngOnInit() {
    this.initializePermissionGroups();
    this.initializeCompanies();
    this.initializeLevels();
    this.initializeEmploymentOffices();
  }

  private initializePermissionGroups(){
    if(this.employeeManagementService.permissionsUserGroupsLabels==null || 
      this.employeeManagementService.permissionsUserGroupsLabels.length==0){
        this.employeeManagementService.buildUserGroupType().subscribe(
          succ=>{
            this.permissionsUserGroupsLabels = this.employeeManagementService.permissionsUserGroupsLabels;
          }
        )
    }else{
      this.permissionsUserGroupsLabels = this.employeeManagementService.permissionsUserGroupsLabels;
    }
  }

  private initializeCompanies(){
    if(this.employeeManagementService.companies==null || 
      this.employeeManagementService.companies.length==0){
        this.employeeManagementService.loadAllCompanies().subscribe(
          succ=>{
            this.companies = this.employeeManagementService.companies;
          }
          )
    }else{
      this.companies = this.employeeManagementService.companies;
    }
  }

  private initializeLevels(){
    if(this.employeeManagementService.companies==null || 
      this.employeeManagementService.companies.length==0){
        this.employeeManagementService.loadAllUserLevels().subscribe(
          succ=>{
            this.levels = this.employeeManagementService.levels;
          }
          )
    }else{
      this.levels = this.employeeManagementService.levels;
    }
  }

  private initializeEmploymentOffices(){
    if(this.employeeManagementService.employmentOffices==null || 
      this.employeeManagementService.employmentOffices.length==0){
        this.employeeManagementService.loadAllEmploymentOffices().subscribe(
          succ=>{
            this.employmentOffices = this.employeeManagementService.employmentOffices;
          }
          )
    }else{
      this.employmentOffices = this.employeeManagementService.employmentOffices;
    }
  }


  hasAuthority(authority: string[]){
    return this.authoritiesService.hasAuthority(authority);
  }

  resetData(){
    this.email = '';
    this.phoneNumber = '';
    this.permissionGroupLabelId = null;
    this.name = '';
    this.surname = '';
    this.sex = '';
    this.fiscalCode = '';
    this.birthDate = null;
    this.dateOfEmployment = null;
    this.levelIdField = null;
    this.companyId = null;
    this.workedHoursField = null;
    this.vacationDaysField = null;
    this.leaveHoursField = null;
    this.employmentOffice = null;
    this.hourlyCost = 0;
    this.birthDate = null;
	  this.dateOfEmployment = null
  }

  get showLoader(){
    return this.showLoaderInModal || this.addOperationInProgress;
  }

  openDialog(){
    $(this.addTeamMemberModal.nativeElement).modal({backdrop: 'static', keyboard: false})
  }

  private closeDialog(){
    $(this.addTeamMemberModal.nativeElement).modal('hide');
  }

  closeAddDialog(){
    if(this.addOperationInProgress){
      return;
    }
    this.closeDialog();
    this.resetData();
  }

  birthDateChanged(date: MonthPickEvent){
    if(date==null){
      this.birthDate = null;
    }else{
      this.birthDate = new Date(Date.UTC(date.year, date.month, date.day));
    }
  }

  employmentDateChanged(date: MonthPickEvent){
    if(date==null){
      this.dateOfEmployment = null;
    }else{
      this.dateOfEmployment = new Date(Date.UTC(date.year, date.month, date.day));
    }
  }

  addNewEmployee(){
    if(this.addOperationInProgress){
      return;
    }
    
    if(StringUtils.nullOrEmpty(this.name) || StringUtils.nullOrEmpty(this.surname) || 
        StringUtils.nullOrEmpty(this.sex) || StringUtils.nullOrEmpty(this.email) || 
          this.dateOfEmployment==null || this.dateOfEmployment+''=='' || this.birthDate==null 
          || this.birthDate+''=='' || this.permissionGroupLabelId==null || this.permissionGroupLabelId+''==''
          || this.companyId==null || this.companyId+''=='' || this.workedHoursField==null
          || this.levelIdField==null || this.levelIdField+''=='' 
          || this.workedHoursField==null || this.vacationDaysField==null || this.hourlyCost==null){

      this.notifier.notifyWarningWithI18nAndStandardTitle("message.missing-data-to-continue");
      return;
    }

    if(this.hourlyCost < 0){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.bad-data")
      return;
    }

    if(this.workedHoursField<=0 || this.workedHoursField>24){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.bad-data")
      return;
    }

    let emailPark = StringUtils.toLowerCase(StringUtils.transformToNullIfWithespaceOrNullAndTrim(this.email));

    let addEmployeeRequest = {
      name: StringUtils.transformToNullIfWithespaceOrNullAndTrim(this.name),
      surname: StringUtils.transformToNullIfWithespaceOrNullAndTrim(this.surname),
      sex: StringUtils.toUpperCase(StringUtils.transformToNullIfWithespaceOrNullAndTrim(this.sex)),
      email: emailPark,
      username: emailPark,
      fiscalCode: StringUtils.toUpperCase(StringUtils.transformToNullIfWithespaceOrNullAndTrim(this.fiscalCode)),
      phoneNumber: StringUtils.transformToNullIfWithespaceOrNullAndTrim(this.phoneNumber),
      permissionGroupLabelId: this.permissionGroupLabelId,
      companyId: this.companyId,
      levelId: this.levelIdField,
      birthDate: this.birthDate,
      dateOfEmployment: this.dateOfEmployment,
      workDayHours: this.workedHoursField,
      initialLeaveHours: this.leaveHoursField,
      initialVacationDays: this.vacationDaysField,
      employmentOffice: this.employmentOffice,
      hourlyCost: this.hourlyCost
    }


    this.addOperationInProgress = true;

    this.employeeManagementService.sendAddNewEmployee(addEmployeeRequest)
      .subscribe(
        (succ: GenericResponse<UserProfileDTO>)=>{
          this.addOperationInProgress = false;
          this.onSaveClick.emit(succ.data);
          this.closeAddDialog();
          this.notifier.notifySuccessWithI18nAndStandardTitle("message.user-successfully-invited");
        },
        (err: HttpErrorResponse)=>{
          this.manageAddError(err);
          this.addOperationInProgress = false;
        }
      )
  }


  manageAddError(err: HttpErrorResponse) {
    let subcode = err.error==null || err.error.subcode==null ? 0: err.error.subcode;

    if(err.status==ChainExceptionHandler.BAD_DATA){
      if(subcode==StandardErrorCode.INVALID_BIRTH_DATE){
        this.notifier.notifyWarningWithI18nAndStandardTitle("message.invalid-birth-date")
        return;
      }
      if(subcode==StandardErrorCode.INVALID_EMAIL){ 
        this.notifier.notifyWarningWithI18nAndStandardTitle("message.invalid-email")
        return;
      }
      if(subcode==StandardErrorCode.INVALID_PHONE_NUMBER){ 
        this.notifier.notifyWarningWithI18nAndStandardTitle("message.invalid-phone-number")
        return;
      }

    }

    if(err.status==ChainExceptionHandler.FORBIDDEN){
      if(subcode==StandardErrorCode.ONLY_ADMIN_CAN_ADD_ADMIN){ 
        this.notifier.notifyWarningWithI18nAndStandardTitle("message.only-admin-can-add-admin")
        return;
      }
    }

    if(err.status==ChainExceptionHandler.CONFLICT_ERROR){
      if(subcode==StandardErrorCode.MAIL_ALREADY_REGISTRED){ 
        this.notifier.notifyWarningWithI18nAndStandardTitle("message.mail-already-registered")
        return;
      }
      if(subcode==StandardErrorCode.USERNAME_ALREADY_REGISTRED){ 
        this.notifier.notifyWarningWithI18nAndStandardTitle("message.username-already-registered")
        return;
      }
      if(subcode==StandardErrorCode.PHONE_NUMBER_ALREADY_REGISTERED){ 
        this.notifier.notifyWarningWithI18nAndStandardTitle("message.phone-number-already-registered")
        return;
      }
    }

    if(err.status==ChainExceptionHandler.INTERNAL_SERVER_ERROR){
      if(subcode==StandardErrorCode.ERROR_SENDING_EMAIL_PLEASE_CHECK_IT){ 
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.error-sending-email-please-check-it")
        return;
      }
    }

    this.exceptionHandler.manageErrorWithLongChain(err.status);
  }




}
