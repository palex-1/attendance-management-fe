import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from 'src/app/model/services/impiegato/employee.service';
import { UserProfileDTO } from 'src/app/model/dtos/profile/user-profile.dto';
import { BackendUrlsService } from 'src/app/model/backend-urls.service';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { FileUtilityService } from 'src/app/util/file-utility.service';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit, AfterViewInit {

  @ViewChild("fileChooser", { static: true })
  fileChooser: ElementRef;

  @ViewChild("imageProfile", { static: true })
  imageProfile: ElementRef;

  currentImgURL: any = '';
  choosenFile: File = null;
  currentFileName: string = '';
  
  wantToUpdateProfileImage: boolean = false;

  tabSelected = 1;

  constructor(private employeeDetailsService: EmployeeService, private authoritiesService: AuthoritiesService,
                private backendUrlService: BackendUrlsService, private fileUtilitySrv: FileUtilityService,
                  private loader: LoadingService, private exceptionHandler: ChainExceptionHandler,
                    private confirmer: CustomConfirmationService) { }

  ngOnInit() {
    
  }

  ngAfterViewInit(): void {
    let that = this;
    this.imageProfile.nativeElement.addEventListener('click', function() {
      that.fileChooser.nativeElement.click();
    })
  }


  
  hasAuthority(authority: string[]){
    return this.authoritiesService.hasAuthority(authority);
  }

  get imgURL(){
    if(this.currentImgURL==null || this.currentImgURL==''){
      if(this.currentUserProfile!=null && this.currentUserProfile.userProfileImageDownloadToken!=null){
        return this.backendUrlService.buildUrlForUserProfileImageLink(this.currentUserProfile.userProfileImageDownloadToken)
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

      this.employeeDetailsService.updateProfileImage(this.choosenFile, this.currentUserProfile.id)
      .subscribe(
        event => {
          if (event instanceof HttpResponse) {
            let newImageDownloadToken = event.body.data.value;
            this.currentUserProfile.userProfileImageDownloadToken = newImageDownloadToken;

            this.wantToUpdateProfileImage = false;
            this.loader.endLoading();
            this.clearUpdateImageForm();
          } 
        },
        (error: HttpErrorResponse) => {
          this.loader.endLoading();
          this.exceptionHandler.manageErrorWithLongChain(error.status)
        }
      );
    }
  }


  downloadFile(data, filename, contentType) {
    const blob = new Blob([data], { type: contentType });
    this.fileUtilitySrv.createAndDownloadBlobFile(blob, filename);
  }
  
  generateEmployeeBadge(){
    let that = this;
    this.confirmer.askConfirmationWithStandardTitleI18nNoRejectCallback("message.sure-to-generate-badge-for-user", 
    ()=>{
      that.executeGenerateEmployeeBadge()
    })
  }

  private executeGenerateEmployeeBadge() {
    this.loader.startLoading();


    this.employeeDetailsService.generateUserProfileBadge()
      .subscribe(
        (data: HttpResponse<any>) => {
          let fileName = this.fileUtilitySrv.extractFileNameOrUseDefault(data, "badge.pdf")
          let contentType = this.fileUtilitySrv.extractContentTypeOrUseDefault(data, "application/pdf");

          this.downloadFile(data.body, fileName, contentType);

          this.loader.endLoading();
        },
        (error) => {
          this.loader.endLoading();
          this.exceptionHandler.manageErrorWithLongChain(error.status)
        }
      );
  }



  selectTab(num){
    this.tabSelected = num;
  }

  get nameAndSurname(): string{
    if(this.currentUserProfile!=null){
      return this.buildNameAndSurname(this.currentUserProfile);
    }
    return '';
  }

  private buildNameAndSurname(userProfile: UserProfileDTO): string{
    let name = userProfile.name== null ? '': userProfile.name;
    let surname = userProfile.surname== null ? '': userProfile.surname;

    if(name=='' || surname==''){
      return name+surname;
    }

    return name+' '+surname;
  }

  get currentUserProfile(){
    if(this.employeeDetailsService.currentLoadedEmployeeInfo!=null){
      return this.employeeDetailsService.currentLoadedEmployeeInfo.userProfile;
    }
    return null;
  }

  get name(){
    if(this.currentUserProfile!=null && this.currentUserProfile.name!=null){
      return this.currentUserProfile.name;
    }
    return '';
  }

  get surname(){
    if(this.currentUserProfile!=null && this.currentUserProfile.surname!=null){
      return this.currentUserProfile.surname;
    }
    return '';
  }

  get email(){
    if(this.currentUserProfile!=null && this.currentUserProfile.email!=null){
      return this.currentUserProfile.email;
    }
    return '';
  }


}
