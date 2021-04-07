import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/model/services/impiegato/employee.service';
import { UserProfileDTO } from 'src/app/model/dtos/profile/user-profile.dto';
import { BackendUrlsService } from 'src/app/model/backend-urls.service';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { FileUtilityService } from 'src/app/util/file-utility.service';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { HttpResponse } from '@angular/common/http';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {

  tabSelected = 1;
  currentImgURL: any = '';

  constructor(private employeeDetailsService: EmployeeService, private authoritiesService: AuthoritiesService,
                private backendUrlService: BackendUrlsService, private fileUtilitySrv: FileUtilityService,
                  private loader: LoadingService, private exceptionHandler: ChainExceptionHandler,
                    private confirmer: CustomConfirmationService) { }

  ngOnInit() {
    
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
