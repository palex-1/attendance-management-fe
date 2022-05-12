import { Component, OnInit, ViewChild } from '@angular/core';
import { TurnstileService } from 'src/app/model/services/turnstile/turnstile.service';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { OrderEvent } from 'src/app/util/order-event.model';
import { PaginationEvent } from '../components/custom-paginator/custom-paginator.component';
import { TurnstileDTO } from 'src/app/model/dtos/turnstile/turnstile-dto.model';
import { AddViewEditTurnstileModalComponent } from './add-view-edit-turnstile-modal/add-view-edit-turnstile-modal.component';
import { Router } from '@angular/router';
import { CustomMessageService } from 'src/app/dialogs/message/custom-message.service';
import { TurnstileTokenViewComponent } from './turnstile-token-view/turnstile-token-view.component';
import { ExportDailyAttendanceComponent } from './export-daily-attendance/export-daily-attendance.component';

@Component({
  selector: 'app-turnstile',
  templateUrl: './turnstile.component.html',
  styleUrls: ['./turnstile.component.scss']
})
export class TurnstileComponent implements OnInit {

  @ViewChild('turnstileModal', { static: false })
  turnstileModal: AddViewEditTurnstileModalComponent;
  
  @ViewChild('turnstileTokenViewModal', { static: false })
  turnstileTokenViewModal: TurnstileTokenViewComponent;

  @ViewChild('exportDailyAttendanceModal', { static: false })
  exportDailyAttendanceModal: ExportDailyAttendanceComponent;

  
  public sortBy = new OrderEvent();
  
  constructor(private turnstileService: TurnstileService, private authoritiesService: AuthoritiesService, 
                private exceptionHandler: ChainExceptionHandler, private notifier: MessageNotifierService,
                  private loader: LoadingService, private router: Router, private messagingModalSrv: CustomMessageService) { 
  }

  ngOnInit(): void {
  }

  openDetails(turnstile: TurnstileDTO){
    this.router.navigateByUrl('dashboard/turnstile/'+turnstile.id)
  }

  openExportDailyAttendanceModal(){
    this.exportDailyAttendanceModal.openDialog()
  }

  openEditDialog(turnstile: TurnstileDTO){
    this.turnstileModal.openEditDialog(turnstile);
  }

  openCreateDialog(){
    this.turnstileModal.openCreateDialog();
  }


  hasAuthority(authority: string[]){
    return this.authoritiesService.hasAuthority(authority);
  }

  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  }
  
  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.turnstileService.currentSortBy = event;
    this.refreshTurnstile();
  }
  
  resetFilters(){
    this.turnstileService.resetFilters();
    this.refreshTurnstile();
  }

  filtersChanged(){
    this.refreshTurnstile();
  }
  
  getCurrentPageIndex(): number{
    return this.turnstileService.pageIndex;
  }

  getTotalRecords(): number{
    return this.turnstileService.totalElements;
  }

  getCurrentPageSize(): number{
    return this.turnstileService.currentPageSize;
  }

  refreshTurnstile(){
    this.loader.startLoading();

    this.turnstileService.realodAllTurnstile().subscribe(
      succ=>{
        this.loader.endLoading();
      },
      err=>{
        this.loader.endLoading();
        this.exceptionHandler.manageErrorWithLongChain(err.status)
      }
    );
  }

  turnstileAdded(event: TurnstileDTO){
    if(event.authToken!=null){
      this.turnstileTokenViewModal.openDialog(event.authToken)
    }
  }

  changePage(event: PaginationEvent) {
    this.turnstileService.pageIndex = event.selectedPage;
    this.turnstileService.currentPageSize = event.pageSize;
    this.refreshTurnstile();
  }
  
  
  get turnstiles(): TurnstileDTO[]{
    return this.turnstileService.currentLoadedData;
  }


  get titleFilter(){
    return this.turnstileService.titleFilter;
  }

  set titleFilter(value: string){
    this.turnstileService.titleFilter = value;
  }

  get positionFilter(){
    return this.turnstileService.positionFilter;
  }

  set positionFilter(value: string){
    this.turnstileService.positionFilter = value;
  }

  get descriptionFilter(){
    return this.turnstileService.descriptionFilter;
  }

  set descriptionFilter(value: string){
    this.turnstileService.descriptionFilter = value;
  }

  get includeDisabledFilter(){
    return this.turnstileService.includeDisabledFilter;
  }

  set includeDisabledFilter(value: boolean){
    if(value==null || value+''=='null' || value+''==''){
      this.turnstileService.includeDisabledFilter = null;
    }else{
      this.turnstileService.includeDisabledFilter = value;
    }
  }


}
