import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalConfigurationAreaService } from 'src/app/model/services/settings/global-configuration-area.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { OrderEvent } from 'src/app/util/order-event.model';
import { PaginationEvent } from '../components/custom-paginator/custom-paginator.component';
import { StringDTO } from 'src/app/model/dtos/string-dto.model';
import { SettingAddEditModalComponent } from './setting-add-edit-modal/setting-add-edit-modal.component';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, AfterViewInit {

  @ViewChild("addSettingModalComp", { static: true })
  addSettingModalComp: SettingAddEditModalComponent;
  

  @ViewChild("fileChooser", { static: true })
  fileChooser: ElementRef;

  @ViewChild("imageLogo", { static: true })
  imageProfile: ElementRef;

  wantToUpdateLogoImage: boolean = false;

  currentImgURL: any = '';
  choosenFile: File = null;
  currentFileName: string = '';

  public sortBy = new OrderEvent();

  constructor(private translate: TranslateService, private globalConfigurationAreaService: GlobalConfigurationAreaService,
              private authoritiesService: AuthoritiesService, private exceptionHandler: ChainExceptionHandler, 
                private notifier: MessageNotifierService, private loader: LoadingService, private router: Router,
                  private confirmer: CustomConfirmationService) {

  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    let that = this;
    this.imageProfile.nativeElement.addEventListener('click', function() {
      that.fileChooser.nativeElement.click();
    })
  }

  openCreateDialog(){
    this.addSettingModalComp.openCreateDialog()
  }

  openDetails(setting: StringDTO) {
    this.router.navigateByUrl('dashboard/settings/' + setting.value)
  }

  deleteConfig(setting: StringDTO){
    let that = this;

    this.confirmer.askConfirmationWithStandardTitleI18nNoRejectCallback("message.sure-to-delete-the-configuration-area",
      ()=>{ that.executeDeleteConfigArea(setting.value); }
    )
  }

  executeDeleteConfigArea(area: string) {
    this.loader.startLoading();

    this.globalConfigurationAreaService.deleteConfigArea(area).subscribe(
      succ=>{
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.configuration-area-successfully-deleted");
        this.loader.endLoading();
        this.refreshConfigurations();
      },
      err=>{
        this.exceptionHandler.manageErrorWithLongChain(err.status);
        this.loader.endLoading();
      }
    )
  }

  hasAuthority(authority: string[]) {
    return this.authoritiesService.hasAuthority(authority);
  }

  get initialSelectedPage() {
    return this.getCurrentPageIndex();
  }

  onSortChange(event: OrderEvent) {
    this.sortBy = event;
    this.globalConfigurationAreaService.currentSortBy = event;
    this.refreshConfigurations();
  }

  resetFilters() {
    this.globalConfigurationAreaService.resetFilters();
    this.refreshConfigurations();
  }

  filtersChanged() {
    this.refreshConfigurations();
  }

  getCurrentPageIndex(): number {
    return this.globalConfigurationAreaService.pageIndex;
  }

  getTotalRecords(): number {
    return this.globalConfigurationAreaService.totalElements;
  }

  getCurrentPageSize(): number {
    return this.globalConfigurationAreaService.currentPageSize;
  }

  refreshConfigurations() {
    this.loader.startLoading();

    this.globalConfigurationAreaService.reloadAllGlobalConfigurations().subscribe(
      succ => {
        this.loader.endLoading();
      },
      err => {
        this.loader.endLoading();
        this.exceptionHandler.manageErrorWithLongChain(err.status)
      }
    );
  }

  changePage(event: PaginationEvent) {
    this.globalConfigurationAreaService.pageIndex = event.selectedPage;
    this.globalConfigurationAreaService.currentPageSize = event.pageSize;
    this.refreshConfigurations();
  }


  get areasLabels(): StringDTO[] {
    return this.globalConfigurationAreaService.currentLoadedData;
  }


  get areaFilter() {
    return this.globalConfigurationAreaService.areaFilter;
  }

  set areaFilter(value: string) {
    this.globalConfigurationAreaService.areaFilter = value;
  }


  get imgURL(){
    if(this.currentImgURL==null || this.currentImgURL==''){
      return this.globalConfigurationAreaService.buildUrlForLogoImageLink()
    }
    return this.currentImgURL;
  }


  updateImage(){
    if(this.choosenFile!=null){
      this.loader.startLoading();

      this.globalConfigurationAreaService.updateLogoImage(this.choosenFile)
      .subscribe(
        event => {
          if (event instanceof HttpResponse) {
            let newImageDownloadToken = event.body.data.value;

            this.wantToUpdateLogoImage = false;
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


  fileChange(event) {
    let fileList: FileList = event.target.files;

    if(fileList.length > 0) {
      this.wantToUpdateLogoImage = true;

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
    this.wantToUpdateLogoImage = false;
  }

  private clearUpdateImageForm(){
    this.currentFileName = '';
    this.choosenFile = null;
    this.currentImgURL = null;
    this.fileChooser.nativeElement.value = "";
  }

}
