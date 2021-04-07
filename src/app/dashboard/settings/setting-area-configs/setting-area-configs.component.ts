import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginationEvent } from '../../components/custom-paginator/custom-paginator.component';
import { GlobalConfigurationDTO } from 'src/app/model/dtos/settings/global-configuration-dto.model';
import { OrderEvent } from 'src/app/util/order-event.model';
import { TranslateService } from '@ngx-translate/core';
import { GlobalConfigurationDetailsService } from 'src/app/model/services/settings/global-configurations-details.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { SettingAddEditModalComponent } from '../setting-add-edit-modal/setting-add-edit-modal.component';
import { Router } from '@angular/router';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';

@Component({
  selector: 'app-setting-area-configs',
  templateUrl: './setting-area-configs.component.html',
  styleUrls: ['./setting-area-configs.component.scss']
})
export class SettingAreaConfigsComponent implements OnInit {

  @ViewChild("addSettingModalComp", { static: true })
  addSettingModalComp: SettingAddEditModalComponent;
  
  public sortBy = new OrderEvent();

  constructor(private translate: TranslateService, private globalConfigurationDetailsService: GlobalConfigurationDetailsService,
                private authoritiesService: AuthoritiesService, private exceptionHandler: ChainExceptionHandler, 
                  private notifier: MessageNotifierService, private loader: LoadingService, private router: Router,
                    private confirmer: CustomConfirmationService) {

  }

  ngOnInit() {
  }

  openCreateDialog(){
    this.addSettingModalComp.openCreateDialogWithArea(this.settingArea);
  }

  editConfig(config: GlobalConfigurationDTO){
    this.addSettingModalComp.openEditDialogWithAreaAndKeyLocked(config.settingArea, config.settingKey, config.settingValue);
  }

  deleteConfig(config: GlobalConfigurationDTO){
    let that = this;

    this.confirmer.askConfirmationWithStandardTitleI18nNoRejectCallback("message.sure-to-delete-the-configuration",
      ()=>{ that.executeDeleteConfig(config); }
    )
  }

  executeDeleteConfig(config: GlobalConfigurationDTO) {
    this.loader.startLoading();

    this.globalConfigurationDetailsService.deleteConfig(config).subscribe(
      succ=>{
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.configuration-successfully-deleted");
        this.loader.endLoading();
        this.refreshConfigurations();
      },
      err=>{
        this.exceptionHandler.manageErrorWithLongChain(err.status);
        this.loader.endLoading();
      }
    )
  }

  get settingArea(): string {
    return this.globalConfigurationDetailsService.currentArea;
  }

  hasAuthority(authority: string[]) {
    return this.authoritiesService.hasAuthority(authority);
  }

  get initialSelectedPage() {
    return this.getCurrentPageIndex();
  }

  onSortChange(event: OrderEvent) {
    this.sortBy = event;
    this.globalConfigurationDetailsService.currentSortBy = event;
    this.refreshConfigurations();
  }

  resetFilters() {
    this.globalConfigurationDetailsService.resetFilters();
    this.refreshConfigurations();
  }

  filtersChanged() {
    this.refreshConfigurations();
  }

  getCurrentPageIndex(): number {
    return this.globalConfigurationDetailsService.pageIndex;
  }

  getTotalRecords(): number {
    return this.globalConfigurationDetailsService.totalElements;
  }

  getCurrentPageSize(): number {
    return this.globalConfigurationDetailsService.currentPageSize;
  }

  refreshConfigurations() {
    this.loader.startLoading();

    this.globalConfigurationDetailsService.reloadAllGlobalConfigurations().subscribe(
      succ => {
        this.loader.endLoading();
        if(this.configs.length==0){
          this.router.navigateByUrl('dashboard/settings');
        }
      },
      err => {
        this.loader.endLoading();
        if(err.status==ChainExceptionHandler.NOT_FOUND){
          this.router.navigateByUrl('dashboard/settings');
        }
        this.exceptionHandler.manageErrorWithLongChain(err.status)
      }
    );
  }

  changePage(event: PaginationEvent) {
    this.globalConfigurationDetailsService.pageIndex = event.selectedPage;
    this.globalConfigurationDetailsService.currentPageSize = event.pageSize;
    this.refreshConfigurations();
  }


  get configs(): GlobalConfigurationDTO[] {
    return this.globalConfigurationDetailsService.currentLoadedData;
  }


  get keyFilter() {
    return this.globalConfigurationDetailsService.keyFilter;
  }

  set keyFilter(value: string) {
    this.globalConfigurationDetailsService.keyFilter = value;
  }

}
