import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MyProfileService } from 'src/app/model/services/my-profile/my-profile.service';
import { environment } from "src/environments/environment";
import { UserProfileInfoService } from 'src/app/model/services/my-profile/user-profile-info.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MonthPickEvent } from '../components/monthpicker/monthpicker.component';
import { StringUtils } from 'src/app/util/string/string-utils';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { UserProfileDTO } from 'src/app/model/dtos/profile/user-profile.dto';
import { StandardErrorCode } from 'src/app/util/standard-error-code';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { BackendUrlsService } from 'src/app/model/backend-urls.service';
import { StringDTO } from 'src/app/model/dtos/string-dto.model';


@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit,  AfterViewInit{

  @ViewChild("fileChooser", { static: true })
  fileChooser: ElementRef;

  @ViewChild("imageProfile", { static: true })
  imageProfile: ElementRef;

  currentImgURL: any = '';
  choosenFile: File = null;
  currentFileName: string = '';

  nameField: string = '';
  surnameField: string = '';
  cfField: string = '';
  birthDate: Date = null;
  phoneNumberField: string = '';

  hiringDateField: Date = null;
  updatingPersonalInfo: boolean = false;

  wantToUpdateProfileImage: boolean = false;


  streetResidenceField: string = '';
  cityResidenceField: string = '';
  provinceResidenceField: string = '';
  nationResidenceField: string = '';
  zipCodeResidenceField: string = '';
  updatingResidence: boolean = false;


  streetDomicileField: string = '';
  cityDomicileField: string = '';
  provinceDomicileField: string = '';
  nationDomicileField: string = '';
  zipCodeDomicileField: string = '';
  updatingDomicile: boolean = false;


  constructor(private userProfileInfoService: UserProfileInfoService, private loader: LoadingService, 
                private notifier: MessageNotifierService, private exceptionHandler: ChainExceptionHandler,
                  private backendUrlService: BackendUrlsService) { 

  }

  ngOnInit() {
    this.initialitializeProfileInfoFields();
    this.initializeDomicileFields();
    this.initializeResidenceFields();
  }

  private initializeResidenceFields(){
    if(this.userProfileInfoService.currentResidence!=null ){
      if(this.userProfileInfoService.currentResidence.city!=null){
        this.cityResidenceField = this.userProfileInfoService.currentResidence.city
      }
      if(this.userProfileInfoService.currentResidence.nation!=null){
        this.nationResidenceField = this.userProfileInfoService.currentResidence.nation
      }
      if(this.userProfileInfoService.currentResidence.province!=null){
        this.provinceResidenceField = this.userProfileInfoService.currentResidence.province
      }
      if(this.userProfileInfoService.currentResidence.street!=null){
        this.streetResidenceField = this.userProfileInfoService.currentResidence.street
      }
      if(this.userProfileInfoService.currentResidence.zipCode!=null){
        this.zipCodeResidenceField = this.userProfileInfoService.currentResidence.zipCode
      }
    }
  }

  private initializeDomicileFields(){
    if(this.userProfileInfoService.currentDomicile!=null ){
      if(this.userProfileInfoService.currentDomicile.city!=null){
        this.cityDomicileField = this.userProfileInfoService.currentDomicile.city
      }
      if(this.userProfileInfoService.currentDomicile.nation!=null){
        this.nationDomicileField = this.userProfileInfoService.currentDomicile.nation
      } 
      if(this.userProfileInfoService.currentDomicile.province!=null){
        this.provinceDomicileField = this.userProfileInfoService.currentDomicile.province
      } 
      if(this.userProfileInfoService.currentDomicile.street!=null){
        this.streetDomicileField = this.userProfileInfoService.currentDomicile.street
      } 
      if(this.userProfileInfoService.currentDomicile.zipCode!=null){
        this.zipCodeDomicileField = this.userProfileInfoService.currentDomicile.zipCode
      } 
      
    }
  }

  private initialitializeProfileInfoFields(){
    this.nameField = this.name;
    this.surnameField = this.surname;
    this.cfField = this.cf;
    
    if(this.userProfileInfoService.currentUser!=null ){
      if(this.userProfileInfoService.currentUser.birthDate!=null){
        this.birthDate = new Date(this.userProfileInfoService.currentUser.birthDate);
      }
      if(this.userProfileInfoService.currentUser.phoneNumber!=null){
        this.phoneNumberField = this.userProfileInfoService.currentUser.phoneNumber;
      }
      if(this.userProfileInfoService.currentUser.employmentDate!=null){
        this.hiringDateField = new Date(this.userProfileInfoService.currentUser.employmentDate);
      }
    }
  }

  bornDateChanged(date: MonthPickEvent){
    if(date==null){
      this.birthDate = null;
    }else{
      this.birthDate = new Date(Date.UTC(date.year, date.month, date.day));
    }
  }

  ngAfterViewInit(): void {
    let that = this;
    this.imageProfile.nativeElement.addEventListener('click', function() {
      that.fileChooser.nativeElement.click();
    })
  }

  get imgURL(){
    if(this.currentImgURL==null || this.currentImgURL==''){
      if(this.userProfileInfoService.currentUser!=null && this.userProfileInfoService.currentUser.userProfileImageDownloadToken!=null){
        return this.backendUrlService.buildUrlForUserProfileImageLink(this.userProfileInfoService.currentUser.userProfileImageDownloadToken)
      }
      return './assets/images/profile.png';
    }
    return this.currentImgURL;
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    
    if(fileList.length > 0) {
      this.wantToUpdateProfileImage = true;

        this.currentFileName = fileList[0].name;
        this.choosenFile = fileList[0];
        var reader = new FileReader();
        reader.readAsDataURL(this.choosenFile); 
        reader.onload = (_event) => { 
          this.currentImgURL = reader.result; 
        }
    }
  }

  cancelUpdateImage(){
    this.clearUpdateImageForm();
    this.wantToUpdateProfileImage = false;
  }

  private clearUpdateImageForm(){
    this.currentFileName = '';
    this.choosenFile = null;
    this.currentImgURL = null;
    this.fileChooser.nativeElement.value = "";
  }


  updateImage(){
    if(this.choosenFile!=null){
      this.loader.startLoading();

      this.userProfileInfoService.updateProfileImage(this.choosenFile)
      .subscribe(
        event => {
          if (event instanceof HttpResponse) {
            let newImageDownloadToken = event.body.data.value;
            this.userProfileInfoService.currentUser.userProfileImageDownloadToken = newImageDownloadToken;

            this.wantToUpdateProfileImage = false;
            this.loader.endLoading();
            this.clearUpdateImageForm();
          } 
        },
        (error:HttpErrorResponse) => {
          this.loader.endLoading();
          this.exceptionHandler.manageErrorWithLongChain(error.status)
        }
      );
    }
  }

  get name(){
    if(this.userProfileInfoService.currentUser!=null && this.userProfileInfoService.currentUser.name!=null){
      return this.userProfileInfoService.currentUser.name;
    }
    return '';
  }

  get surname(){
    if(this.userProfileInfoService.currentUser!=null && this.userProfileInfoService.currentUser.surname!=null){
      return this.userProfileInfoService.currentUser.surname;
    }
    return '';
  }

  get email(){
    if(this.userProfileInfoService.currentUser!=null && this.userProfileInfoService.currentUser.email!=null){
      return this.userProfileInfoService.currentUser.email;
    }
    return '';
  }
  
  get cf(){
    if(this.userProfileInfoService.currentUser!=null && this.userProfileInfoService.currentUser.cf!=null){
      return this.userProfileInfoService.currentUser.cf;
    }
    return '';
  }


  updatePersonalInfo(){
    if(this.updatingPersonalInfo){
      return;
    }

    let cfPark = StringUtils.toUpperCase(StringUtils.trim(this.cfField));
    let namePark = StringUtils.trim(this.nameField);
    let surnamePark = StringUtils.trim(this.surnameField);
    let phoneNumberPark = StringUtils.trim(this.phoneNumberField);

    if(StringUtils.nullOrEmpty(namePark) || StringUtils.nullOrEmpty(surnamePark) || this.birthDate==null){
        this.notifier.notifyWarningWithI18nAndStandardTitle("message.invalid-data");
        return;
    }
    
    this.updatingPersonalInfo = true;

    this.userProfileInfoService.updatePersonalData(cfPark, namePark, surnamePark, phoneNumberPark, this.birthDate)
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


    this.userProfileInfoService.updateDomicile(StringUtils.toUpperCase(streetDomicileFieldPark), 
                          StringUtils.toUpperCase(cityDomicileFieldPark),
                          StringUtils.toUpperCase(provinceDomicileFieldPark), 
                          StringUtils.toUpperCase(nationDomicileFieldPark), 
                          zipCodeDomicileFieldPark)
        .subscribe(
          succ=>{
            this.updatingDomicile = false;
            this.notifier.notifySuccessWithI18nAndStandardTitle("message.successfully-updated");
            this.initializeDomicileFields();
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

    this.userProfileInfoService.updateResidence(
                StringUtils.toUpperCase(streetResidenceFieldPark), 
                StringUtils.toUpperCase(cityResidenceFieldPark),
                StringUtils.toUpperCase(provinceResidenceFieldPark), 
                StringUtils.toUpperCase(nationResidenceFieldPark), 
                zipCodeResidenceFieldPark)
        .subscribe(
          succ=>{
            this.notifier.notifySuccessWithI18nAndStandardTitle("message.successfully-updated");
            this.updatingResidence = false;
            this.initializeResidenceFields();
          },
          err=>{
            this.updatingResidence = false;
            this.exceptionHandler.manageErrorWithLongChain(err.status);
          }
        );
  }


}
