import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { EmployeeService } from 'src/app/model/services/impiegato/employee.service';
import { MonthPickEvent } from 'src/app/dashboard/components/monthpicker/monthpicker.component';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { CompanyDTO } from 'src/app/model/dtos/company/company.dto';
import { StringUtils } from 'src/app/util/string/string-utils';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StandardErrorCode } from 'src/app/util/standard-error-code';
import { UserProfileDTO } from 'src/app/model/dtos/profile/user-profile.dto';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { UserProfileAddressDTO } from 'src/app/model/dtos/profile/user-profile-address.dto';
import { UserLevelDTO } from 'src/app/model/dtos/profile/user-level.dto';
import { UserProfileContractDTO } from 'src/app/model/dtos/impiegato/user-profile-contract-dto.model';

@Component({
  selector: 'app-basic-employee-info',
  templateUrl: './basic-employee-info.component.html',
  styleUrls: ['./basic-employee-info.component.scss']
})
export class BasicEmployeeInfoComponent implements OnInit {


  updatingPersonalInfo: boolean = false;
  updatingResidence: boolean = false;
  updatingDomicile: boolean = false;
  updatingOtherInfo: boolean = false;
  updatingUsernameInfo: boolean = false;


  constructor(private employeeDetailsService: EmployeeService, private authoritiesService: AuthoritiesService,
                private notifier: MessageNotifierService, private exceptionHandler: ChainExceptionHandler) { 
    
  }

  ngOnInit() {
  }
  
  get companies(): CompanyDTO[]{
    if(this.employeeDetailsService.currentLoadedCompanies==null){
      return [];
    }
    return this.employeeDetailsService.currentLoadedCompanies;
  }

  get levels(): UserLevelDTO[]{
    if(this.employeeDetailsService.currentLoadedUserLeves==null){
      return [];
    }
    return this.employeeDetailsService.currentLoadedUserLeves;
  }

  get canEditUserData(){
    return this.authoritiesService.hasAuthority(['USER_PROFILE_UPDATE']);
  }

  get currentDomicile(){
    if(this.employeeDetailsService.currentLoadedEmployeeInfo!=null){
      if(this.employeeDetailsService.currentLoadedEmployeeInfo.domicile==null){
        this.employeeDetailsService.currentLoadedEmployeeInfo.domicile = new UserProfileAddressDTO();
      }
      return this.employeeDetailsService.currentLoadedEmployeeInfo.domicile;
    }
    return null;
  }

  get currentResidence(){
    if(this.employeeDetailsService.currentLoadedEmployeeInfo!=null){
      if(this.employeeDetailsService.currentLoadedEmployeeInfo.residence==null){
        this.employeeDetailsService.currentLoadedEmployeeInfo.residence = new UserProfileAddressDTO();
      }
      return this.employeeDetailsService.currentLoadedEmployeeInfo.residence;
    }
    return null;
  }

  get currentUserProfile(){
    if(this.employeeDetailsService.currentLoadedEmployeeInfo!=null){
      if(this.employeeDetailsService.currentLoadedEmployeeInfo.userProfile==null){
        this.employeeDetailsService.currentLoadedEmployeeInfo.userProfile = new UserProfileDTO();
      }
      return this.employeeDetailsService.currentLoadedEmployeeInfo.userProfile;
    }
    return null;
  }

  get currentContractInfo() {
    if(this.employeeDetailsService.currentLoadedEmployeeInfo!=null){
      if(this.employeeDetailsService.currentLoadedEmployeeInfo.contractInfo==null){
        this.employeeDetailsService.currentLoadedEmployeeInfo.contractInfo = new UserProfileContractDTO();
      }
      return this.employeeDetailsService.currentLoadedEmployeeInfo.contractInfo;
    }
    return null;
  }

  get levelIdField(){
    if(this.currentContractInfo.level==null){
      return null;
    }
    return this.currentContractInfo.level.id;
  }

  set levelIdField(value: number){
    if(this.currentContractInfo.level==null){
      this.currentContractInfo.level = new UserLevelDTO();
    }
    this.currentContractInfo.level.id =  value;
  }

  
  get vacationDaysField(){
    return this.currentContractInfo.vacationDays;
  }

  set vacationDaysField(value: number){
    this.currentContractInfo.vacationDays =  value;
  }

  
  get leaveHoursField(){
    return this.currentContractInfo.leaveHours;
  }

  set leaveHoursField(value: number){
    this.currentContractInfo.leaveHours =  value;
  }

  get hourlyCostField(){
    return this.currentContractInfo.hourlyCost;
  }

  set hourlyCostField(value: number){
    this.currentContractInfo.hourlyCost =  value;
  }

  get employmentOfficeField(){
    return this.currentContractInfo.employmentOffice;
  }

  set employmentOfficeField(value: string){
    this.currentContractInfo.employmentOffice =  value;
  }

  get workedHoursField(){
    return this.currentContractInfo.workDayHours;
  }

  set workedHoursField(value: number){
    this.currentContractInfo.workDayHours=  value;
  }


  get companyIdField(){
    if(this.currentUserProfile.company==null){
      return null;
    }
    return this.currentUserProfile.company.id;
  }

  set companyIdField(value: number){
    if(this.currentUserProfile.company==null){
      this.currentUserProfile.company = new CompanyDTO();
    }
    this.currentUserProfile.company.id =  value;
  }

  get cityResidenceField(){
    return this.currentResidence.city;
  }

  set cityResidenceField(value: string){
    this.currentResidence.city = value;
  }

  get streetResidenceField(){
    return this.currentResidence.street;
  }

  set streetResidenceField(value: string){
    this.currentResidence.street = value;
  }

  get provinceResidenceField(){
    return this.currentResidence.province;
  }

  set provinceResidenceField(value: string){
    this.currentResidence.province = value;
  }

  get nationResidenceField(){
    return this.currentResidence.nation;
  }

  set nationResidenceField(value: string){
    this.currentResidence.nation = value;
  }

  get zipCodeResidenceField(){
    return this.currentResidence.zipCode;
  }

  set zipCodeResidenceField(value: string){
    this.currentResidence.zipCode = value;
  }



  get cityDomicileField(){
    return this.currentDomicile.city;
  }

  set cityDomicileField(value: string){
    this.currentDomicile.city = value;
  }

  get streetDomicileField(){
    return this.currentDomicile.street;
  }

  set streetDomicileField(value: string){
    this.currentDomicile.street = value;
  }

  get provinceDomicileField(){
    return this.currentDomicile.province;
  }

  set provinceDomicileField(value: string){
    this.currentDomicile.province = value;
  }

  get nationDomicileField(){
    return this.currentDomicile.nation;
  }

  set nationDomicileField(value: string){
    this.currentDomicile.nation = value;
  }

  get zipCodeDomicileField(){
    return this.currentDomicile.zipCode;
  }

  set zipCodeDomicileField(value: string){
    this.currentDomicile.zipCode = value;
  }




  get birthDate(){
    return this.currentUserProfile.birthDate;
  }

  set birthDate(value: Date){
    this.currentUserProfile.birthDate = value;
  }

  get dateOfEmployment(){
    return this.currentUserProfile.employmentDate;
  }

  set dateOfEmployment(value: Date){
    this.currentUserProfile.employmentDate = value;
  }



  get nameField(){
    return this.currentUserProfile.name;
  }

  set nameField(value: string){
    this.currentUserProfile.name = value;
  }

  get surnameField(){
    return this.currentUserProfile.surname;
  }

  set surnameField(value: string){
    this.currentUserProfile.surname = value;
  }

  get cfField(){
    return this.currentUserProfile.cf;
  }

  set cfField(value: string){
    this.currentUserProfile.cf = value;
  }


  get usernameField(){
    return this.currentUserProfile.email;
  }

  set usernameField(value: string){
    this.currentUserProfile.email = value;
  }


  get phoneNumberField(){
    return this.currentUserProfile.phoneNumber;
  }

  set phoneNumberField(value: string){
    this.currentUserProfile.phoneNumber = value;
  }

  get sexField(){
    return this.currentUserProfile.sex;
  }

  set sexField(value: string){
    this.currentUserProfile.sex = value;
  }


  get employmentOffices(): string[]{
    if(this.employeeDetailsService.employmentOffices!=null){
      return this.employeeDetailsService.employmentOffices;
    }
    return [];
  }

  bornDateChanged(date: MonthPickEvent){
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

  updateOtherInfo(){
    if(this.updatingOtherInfo){
      return;
    }

    if(this.companyIdField==null || this.companyIdField+''==''  
        || this.workedHoursField==null || this.vacationDaysField==null
          || this.levelIdField==null || this.levelIdField+''=='' || this.leaveHoursField==null 
          || this.hourlyCostField==null){
      this.notifier.notifyWarningWithI18nAndStandardTitle("message.missing-data-to-continue");
      return;
    }

    if(this.hourlyCostField < 0){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.bad-data")
      return;
    }

    if(this.workedHoursField<=0 || this.workedHoursField>24){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.bad-data")
      return;
    }

    this.updatingOtherInfo = true;
    
    this.employeeDetailsService.updateOtherUserInfo(this.currentUserProfile.id, this.levelIdField, this.companyIdField, 
                      this.workedHoursField, this.leaveHoursField, this.vacationDaysField, 
                      this.employmentOfficeField, this.hourlyCostField)
        .subscribe(
          succ=>{
              this.updatingOtherInfo = false;
              this.notifier.notifySuccessWithI18nAndStandardTitle("message.successfully-updated");
          },
          err=>{
              this.updatingOtherInfo = false;
              this.exceptionHandler.manageErrorWithLongChain(err.status);
          }
        );
  }

  updateDomicile(){
    if(this.updatingDomicile){
      return;
    }
    let streetDomicileFieldPark: string = StringUtils.trim(this.streetDomicileField);
    let cityDomicileFieldPark: string = StringUtils.trim(this.cityDomicileField);
    let provinceDomicileFieldPark: string = StringUtils.trim(this.provinceDomicileField);
    let nationDomicileFieldPark: string = StringUtils.trim(this.nationDomicileField);
    let zipCodeDomicileFieldPark: string = StringUtils.trim(this.zipCodeDomicileField);

    if(StringUtils.nullOrEmpty(streetDomicileFieldPark) ||  StringUtils.nullOrEmpty(cityDomicileFieldPark) ||
        StringUtils.nullOrEmpty(provinceDomicileFieldPark) || StringUtils.nullOrEmpty(nationDomicileFieldPark) || 
          StringUtils.nullOrEmpty(zipCodeDomicileFieldPark) ){
            
            this.notifier.notifyWarningWithI18nAndStandardTitle("message.missing-data-to-continue");
            return;
    }

    this.updatingDomicile = true;


    this.employeeDetailsService.updateDomicileOfUser(
                          this.currentUserProfile.id,
                          StringUtils.toUpperCase(streetDomicileFieldPark), 
                          StringUtils.toUpperCase(cityDomicileFieldPark),
                          StringUtils.toUpperCase(provinceDomicileFieldPark), 
                          StringUtils.toUpperCase(nationDomicileFieldPark), 
                          zipCodeDomicileFieldPark)
        .subscribe(
          succ=>{
            this.updatingDomicile = false;
            this.notifier.notifySuccessWithI18nAndStandardTitle("message.successfully-updated");
          },
          err=>{
            this.updatingDomicile = false;
            this.exceptionHandler.manageErrorWithLongChain(err.status);
          }
        );
  }



  updateResidence(){
    if(this.updatingResidence){
      return;
    }
    let streetResidenceFieldPark: string = StringUtils.trim(this.streetResidenceField);
    let cityResidenceFieldPark: string = StringUtils.trim(this.cityResidenceField);
    let provinceResidenceFieldPark: string = StringUtils.trim(this.provinceResidenceField);
    let nationResidenceFieldPark: string = StringUtils.trim(this.nationResidenceField);
    let zipCodeResidenceFieldPark: string = StringUtils.trim(this.zipCodeResidenceField);

    if(StringUtils.nullOrEmpty(streetResidenceFieldPark) ||  StringUtils.nullOrEmpty(cityResidenceFieldPark) ||
        StringUtils.nullOrEmpty(provinceResidenceFieldPark) || StringUtils.nullOrEmpty(nationResidenceFieldPark) || 
          StringUtils.nullOrEmpty(zipCodeResidenceFieldPark) ){
            
            this.notifier.notifyWarningWithI18nAndStandardTitle("message.missing-data-to-continue");
            return;
    }
    
    this.updatingResidence = true;

    this.employeeDetailsService.updateResidenceOfUser(this.currentUserProfile.id, 
              StringUtils.toUpperCase(streetResidenceFieldPark), 
              StringUtils.toUpperCase(cityResidenceFieldPark),
              StringUtils.toUpperCase(provinceResidenceFieldPark), 
              StringUtils.toUpperCase(nationResidenceFieldPark), 
              zipCodeResidenceFieldPark)
        .subscribe(
          succ=>{
            this.notifier.notifySuccessWithI18nAndStandardTitle("message.successfully-updated");
            this.updatingResidence = false;
          },
          err=>{
            this.updatingResidence = false;
            this.exceptionHandler.manageErrorWithLongChain(err.status);
          }
        );
  }


  updateUsernameInfo(){
    if(this.updatingUsernameInfo){
      return;
    }
    let usernamePark = StringUtils.toUpperCase(StringUtils.trim(this.usernameField));
    
    if(StringUtils.nullOrEmpty(usernamePark)){
        this.notifier.notifyWarningWithI18nAndStandardTitle("message.invalid-data");
        return;
    }

    this.updatingUsernameInfo = true;

    this.employeeDetailsService.updateUsernameOfUser(this.currentUserProfile.id, usernamePark)
            .subscribe(
            (succ: GenericResponse<UserProfileDTO>)=>{
              this.updatingUsernameInfo = false;
              this.notifier.notifySuccessWithI18nAndStandardTitle("message.successfully-updated");
            },
            (err: HttpErrorResponse)=>{
              this.manageErrorOnUsernameUpdate(err);
              this.updatingUsernameInfo = false;
            }
            );
  }

  updatePersonalInfo(){
    if(this.updatingPersonalInfo){
      return;
    }

    let cfPark = StringUtils.toUpperCase(StringUtils.trim(this.cfField));
    let namePark = StringUtils.trim(this.nameField);
    let surnamePark = StringUtils.trim(this.surnameField);
    let phoneNumberPark = StringUtils.trim(this.phoneNumberField);

    if(StringUtils.nullOrEmpty(namePark) || StringUtils.nullOrEmpty(surnamePark) || this.birthDate==null
        || this.dateOfEmployment==null){
        this.notifier.notifyWarningWithI18nAndStandardTitle("message.invalid-data");
        return;
    }
    
    this.updatingPersonalInfo = true;

    this.employeeDetailsService.updatePersonalDataOfUser(this.currentUserProfile.id,cfPark, namePark, 
                                                          surnamePark, phoneNumberPark, this.birthDate, this.sexField,
                                                          this.dateOfEmployment)
      .subscribe(
        (succ: GenericResponse<UserProfileDTO>)=>{
          this.updatingPersonalInfo = false;
          this.notifier.notifySuccessWithI18nAndStandardTitle("message.successfully-updated");
        },
        (err: HttpErrorResponse)=>{
          this.manageErrorOnProfileUpdate(err);
          this.updatingPersonalInfo = false;
        }
      );
  }

  
  private manageErrorOnUsernameUpdate(err: HttpErrorResponse){
    if(err.status==400){
      this.notifier.notifyWarningWithI18nAndStandardTitle("message.invalid-data");
      return;
    }
    if(err.status==ChainExceptionHandler.CONFLICT_ERROR){
      this.notifier.notifyWarningWithI18nAndStandardTitle("message.username-already-registered");
      return;
    }
    
    this.exceptionHandler.manageErrorWithLongChain(err.status);
  }

  private manageErrorOnProfileUpdate(err: HttpErrorResponse){
    if(err.status==400){
      if(err.error.subcode==StandardErrorCode.INVALID_CF){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.invalid-cf");
        return;
      }
      if(err.error.subcode==StandardErrorCode.INVALID_PHONE_NUMBER){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.phone-number");
        return;
      }
    }
    if(err.status==ChainExceptionHandler.CONFLICT_ERROR){
      if(err.error.subcode==StandardErrorCode.PHONE_NUMBER_ALREADY_REGISTERED){
        this.notifier.notifyWarningWithI18nAndStandardTitle("message.phone-number-already-registered");
        return;
      }
    }
    this.exceptionHandler.manageErrorWithLongChain(err.status);
  }

  
}
