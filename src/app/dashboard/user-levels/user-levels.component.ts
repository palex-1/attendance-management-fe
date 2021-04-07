import { Component, OnInit, ViewChild } from '@angular/core';
import { UserLevelsService } from 'src/app/model/services/settings/user-levels.service';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { Router } from '@angular/router';
import { OrderEvent } from 'src/app/util/order-event.model';
import { PaginationEvent } from '../components/custom-paginator/custom-paginator.component';
import { UserLevelDTO } from 'src/app/model/dtos/profile/user-level.dto';
import { CustomConfirmationComponent } from 'src/app/dialogs/confirmation/custom-confirmation.component';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserLevelModalComponent } from './user-level-modal/user-level-modal.component';


@Component({
  selector: 'app-user-levels',
  templateUrl: './user-levels.component.html',
  styleUrls: ['./user-levels.component.scss']
})
export class UserLevelsComponent implements OnInit {

  @ViewChild('userLevelModal', { static: false })
  userLevelModal: UserLevelModalComponent;

  

  public sortBy = new OrderEvent();
  private deleteOperationInProgress: boolean = false;


  constructor(private userLevelsService: UserLevelsService, private authoritiesService: AuthoritiesService, private router: Router, 
                private exceptionHandler: ChainExceptionHandler, private notifier: MessageNotifierService,
                  private loader: LoadingService, private confirmer: CustomConfirmationService) { 

  }

  ngOnInit(): void {
  }

  openAddDialog(){
    this.userLevelModal.openAddDialog();
  }

  openEditDialog(userLevel: UserLevelDTO){
    this.userLevelModal.openEditDialog(userLevel);
  }



  delete(userLevel: UserLevelDTO){
    if(this.deleteOperationInProgress){
      return;
    }

    let that = this;

    this.confirmer.askConfirmationWithStandardTitleI18nNoRejectCallbackWithParams("message.sure-to-delete-the-user-level",
      ()=>{ that.executeDeleteLevel(userLevel); },
      [userLevel.level]
    )
  }

  executeDeleteLevel(userLevel: UserLevelDTO){
    this.deleteOperationInProgress = true;
    this.loader.startLoading();

    this.userLevelsService.deleteUserLevel(userLevel)
    .subscribe(
      succ=>{
        this.loader.endLoading();
        this.deleteOperationInProgress = false;
        this.refreshUserLevels();
      },
      (err: HttpErrorResponse)=>{
        this.deleteOperationInProgress = false;
        this.manageErrorOnDeleteLevel(err);
        this.loader.endLoading();
      }
    )
  }

  manageErrorOnDeleteLevel(err: HttpErrorResponse) {
    if(err.status==ChainExceptionHandler.UNPROCESSABLE_ENTITY){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.error-on-delete-level");
      return;
    }
    this.exceptionHandler.manageErrorWithLongChain(err.status)
  }

  hasAuthority(authority: string[]){
    return this.authoritiesService.hasAuthority(authority);
  }

  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  }
  
  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.userLevelsService.currentSortBy = event;
    this.refreshUserLevels();
  }
  
  resetFilters(){
    this.userLevelsService.resetFilters();
    this.refreshUserLevels();
  }

  filtersChanged(){
    this.refreshUserLevels();
  }
  
  getCurrentPageIndex(): number{
    return this.userLevelsService.pageIndex;
  }

  getTotalRecords(): number{
    return this.userLevelsService.totalElements;
  }

  getCurrentPageSize(): number{
    return this.userLevelsService.currentPageSize;
  }

  refreshUserLevels(){
    this.loader.startLoading();

    this.userLevelsService.realodAllUserLevels().subscribe(
      succ=>{
        this.loader.endLoading();
      },
      err=>{
        this.loader.endLoading();
        this.exceptionHandler.manageErrorWithLongChain(err.status)
      }
    );
  }

  changePage(event: PaginationEvent) {
    this.userLevelsService.pageIndex = event.selectedPage;
    this.userLevelsService.currentPageSize = event.pageSize;
    this.refreshUserLevels();
  }
  
  
  get userLevels(): UserLevelDTO[]{
    return this.userLevelsService.currentLoadedData;
  }


  get levelFilter(){
    return this.userLevelsService.levelFilter;
  }

  set levelFilter(value: string){
    this.userLevelsService.levelFilter = value;
  }


}
