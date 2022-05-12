import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginationEvent } from '../../components/custom-paginator/custom-paginator.component';
import { OrderEvent } from 'src/app/util/order-event.model';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { TurnstileService } from 'src/app/model/services/turnstile/turnstile.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { TurnstileAttedanceService } from 'src/app/model/services/turnstile/turnstile-attendance.service';
import { UserAttendanceDTO } from 'src/app/model/dtos/turnstile/user-attendance-dto.model';
import { MonthPickEvent } from '../../components/monthpicker/monthpicker.component';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';
import { RegisterAttendanceModalComponent } from '../register-attendance-modal/register-attendance-modal.component';
import { TurnstileTotemModalComponent } from '../turnstile-totem-modal/turnstile-totem-modal.component';

@Component({
  selector: 'app-turnstile-details',
  templateUrl: './turnstile-details.component.html',
  styleUrls: ['./turnstile-details.component.scss']
})
export class TurnstileDetailsComponent implements OnInit {

  @ViewChild('registerAttendanceModal', { static: false })
  registerAttendanceModal: RegisterAttendanceModalComponent;

  @ViewChild('turnstileTotem', { static: false })
  turnstileTotem: TurnstileTotemModalComponent;
  
  
  public sortBy = new OrderEvent();

  constructor(private turnstileAttendanceService: TurnstileAttedanceService, private authoritiesService: AuthoritiesService,
                private exceptionHandler: ChainExceptionHandler, private notifier: MessageNotifierService,
                  private loader: LoadingService, private confirmer: CustomConfirmationService) { }

  ngOnInit(): void {
  }

  openCreateDialog(){
    this.registerAttendanceModal.openRegisterAttendanceModal();
  }

  openTotem(){
    let that = this;

    this.confirmer.askConfirmationWithStandardTitleI18nNoRejectCallback("message.sure-to-open-totem",
      ()=>{ that.turnstileTotem.openTotem(); }
     )
  }

  delete(elem: UserAttendanceDTO){
    let that = this;

    this.confirmer.askConfirmationWithStandardTitleI18nNoRejectCallback("message.sure-to-delete-the-attendance",
      ()=>{ that.executeDelete(elem); }
    )
  }

  executeDelete(elem: UserAttendanceDTO) {
    this.loader.startLoading();

    this.turnstileAttendanceService.delete(elem).subscribe(
      succ=>{
        this.loader.endLoading();
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.successfully-deleted");
        this.refreshAttendance();
      },  
      err=>{
        this.loader.endLoading();
        this.exceptionHandler.manageErrorWithLongChain(err.status);
      }
    )
  }

  hasAuthority(authority: string[]){
    return this.authoritiesService.hasAuthority(authority);
  }

  isVirtualAndEnabledTurnstile(){
    if(this.turnstileAttendanceService.turnstileDetails!=null && 
        !this.turnstileAttendanceService.turnstileDetails.deactivated &&
          this.turnstileAttendanceService.turnstileDetails.type=='VIRTUAL'){
      return true;
    }
    return false;
  }

  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  }
  
  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.turnstileAttendanceService.currentSortBy = event;
    this.refreshAttendance();
  }
  
  resetFilters(){
    this.turnstileAttendanceService.resetFilters();
    this.refreshAttendance();
  }

  filtersChanged(){
    this.refreshAttendance();
  }
  
  getCurrentPageIndex(): number{
    return this.turnstileAttendanceService.pageIndex;
  }

  getTotalRecords(): number{
    return this.turnstileAttendanceService.totalElements;
  }

  getCurrentPageSize(): number{
    return this.turnstileAttendanceService.currentPageSize;
  }

  refreshAttendance(){
    this.loader.startLoading();

    this.turnstileAttendanceService.realodAllTurnstileAttendances().subscribe(
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
    this.turnstileAttendanceService.pageIndex = event.selectedPage;
    this.turnstileAttendanceService.currentPageSize = event.pageSize;
    this.refreshAttendance();
  }
  
  
  get attendances(): UserAttendanceDTO[]{
    return this.turnstileAttendanceService.currentLoadedData;
  }
  

  get dateToFilter(){
    return this.turnstileAttendanceService.dateToFilter;
  }

  get dateFromFilter(){
    return this.turnstileAttendanceService.dateFromFilter;
  }

  onChangeDateToFilter(event: MonthPickEvent){
    let parkDate = null;
    if(event!=null){
      parkDate = new Date(Date.UTC(event.year, event.month, event.day));
    }
    
    this.turnstileAttendanceService.dateToFilter = parkDate;
  }

  onChangeDateFromFilter(event: MonthPickEvent){
    let parkDate = null;
    if(event!=null){
      parkDate = new Date(Date.UTC(event.year, event.month, event.day));
    }
    this.turnstileAttendanceService.dateFromFilter = parkDate;
  }


  
}
