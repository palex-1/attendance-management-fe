import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TaskCompletionsLocksDTO } from 'src/app/model/dtos/reports/task-completion-locks-dto.model';
import { PaginationEvent } from '../components/custom-paginator/custom-paginator.component';
import { HttpErrorResponse } from '@angular/common/http';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { MonthPickEvent, MonthpickerComponent } from '../components/monthpicker/monthpicker.component';
import { TaskCompletionLocksService } from 'src/app/model/services/reports/task-completion-locks.service';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';
import { OrderEvent } from 'src/app/util/order-event.model';
import { TaskCompletionLockStatusPipe } from 'src/app/util/pipes/task-completion-lock-status.pipe';

declare const $: any;

@Component({
  selector: 'app-task-completion-lock',
  templateUrl: './task-completion-lock.component.html',
  styleUrls: ['./task-completion-lock.component.scss']
})
export class TaskCompletionLockComponent implements OnInit {

  @ViewChild('taskCompletionAddModal', { static: false }) 
  taskCompletionAddModal: ElementRef;
  
  @ViewChild('monthPickerModal', { static: false }) 
  monthPickerModal: MonthpickerComponent;

  
  public sortBy = new OrderEvent();

  addingCompletionLock: boolean = false;

  selectedYear: number = null;
  selectedMonth: number = null;

  yearDetailsModal: number = null
  monthDetailsModal: number = null;
  hoursCalculationExecutionRequested: boolean = false;

  constructor(private taskCompletionLocksService: TaskCompletionLocksService, private authoritiesService: AuthoritiesService, 
                private exceptionHandler: ChainExceptionHandler, private notifier: MessageNotifierService,
                  private loader: LoadingService, private confirmer: CustomConfirmationService) {

  }

  ngOnInit(): void {
  }

  canBeDeleted(elem: TaskCompletionsLocksDTO){
    if(elem!=null){
      if(elem.status=='NOT_TO_BE_PROCESSED' || elem.status=='TO_BE_PROCESSED'){
        return true;
      }
    }
    return false;
  }

  openCreateDialog(){
    this.selectedMonth = null;
    this.selectedYear = null;
    this.hoursCalculationExecutionRequested = false;
    this.monthPickerModal.resetComponent();
    $(this.taskCompletionAddModal.nativeElement).modal({backdrop: 'static', keyboard: false})
  }

  closeDialog(){
    if(this.addingCompletionLock){
      return;
    }
    $(this.taskCompletionAddModal.nativeElement).modal('hide');
  }

  addNewCompletionLock(){
    if(this.addingCompletionLock){
      return;
    }

    if(this.selectedMonth==null || this.selectedYear==null){
      this.notifier.notifyWarningWithI18nAndStandardTitle('message.select-month');
      return;
    }
    if(this.hoursCalculationExecutionRequested==null){
      this.notifier.notifyWarningWithI18nAndStandardTitle('message.bad-data');
      return;
    }

    this.addingCompletionLock = true;

    this.taskCompletionLocksService.addNewLock(this.selectedYear, this.selectedMonth, this.hoursCalculationExecutionRequested)
    .subscribe(
      (succ: GenericResponse<TaskCompletionsLocksDTO>)=>{
        this.addingCompletionLock = false;
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.completion-lock-added");
        this.closeDialog();
      },
      (err)=>{
        this.exceptionHandler.manageErrorWithLongChain(err.status);
        this.addingCompletionLock = false;
      }
    )

  }

  requestHoursCalculation(lock: TaskCompletionsLocksDTO){
    let that = this;

    this.confirmer.askConfirmationWithStandardTitleI18nNoRejectCallback("message.sure-to-request-hours-calculation", 
    ()=>{
      that.executeRequestHoursCalculation(lock)
    })
  }

  executeRequestHoursCalculation(lock: TaskCompletionsLocksDTO) {
    this.loader.startLoading();

    this.taskCompletionLocksService.requestHoursCalculationExecution(lock)
    .subscribe(
      (succ: GenericResponse<TaskCompletionsLocksDTO>) => {
        this.loader.endLoading();
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.requested-hours-calculation")
        this.refreshTaskCompletionLocks();
      },
      (err:HttpErrorResponse)=>{
        this.exceptionHandler.manageErrorWithLongChain(err.status);
        this.loader.endLoading();
      }
    )
  }
   
  delete(lock: TaskCompletionsLocksDTO){
    let that = this;

    this.confirmer.askConfirmationWithStandardTitleI18nNoRejectCallback("message.sure-to-delete-completion-lock", 
    ()=>{
      that.executeDelete(lock)
    })
  }

  executeDelete(lock: TaskCompletionsLocksDTO){
    this.loader.startLoading();

    this.taskCompletionLocksService.delete(lock)
    .subscribe(
      (succ: GenericResponse<TaskCompletionsLocksDTO>) => {
        this.loader.endLoading();
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.lock-deleted")
        this.refreshTaskCompletionLocks();
      },
      (err:HttpErrorResponse)=>{
        this.exceptionHandler.manageErrorWithLongChain(err.status);
        this.loader.endLoading();
      }
    )
  }


  getMonthValue(month: number){
    let park = month + 1;
    if(month<10){
      return '0'+park;
    }
    return park;
  }
 

  addModalDateChanges(event: MonthPickEvent){
    if(event==null){
      this.selectedYear = null;
      this.selectedMonth = null;
    }else{
      this.selectedYear = event.year;
      this.selectedMonth = event.month;
    }
  }


  hasAuthority(authority: string[]){
    return this.authoritiesService.hasAuthority(authority);
  }

  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  }
  
  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.taskCompletionLocksService.currentSortBy = event;
    this.refreshTaskCompletionLocks();
  }
  
  resetFilters(){
    this.taskCompletionLocksService.resetFilters();
    this.refreshTaskCompletionLocks();
  }

  filtersChanged(){
    this.refreshTaskCompletionLocks();
  }
  
  getCurrentPageIndex(): number{
    return this.taskCompletionLocksService.pageIndex;
  }

  getTotalRecords(): number{
    return this.taskCompletionLocksService.totalElements;
  }

  getCurrentPageSize(): number{
    return this.taskCompletionLocksService.currentPageSize;
  }

  refreshTaskCompletionLocks(){
    this.loader.startLoading();

    this.taskCompletionLocksService.realodAllTaskCompletionLock().subscribe(
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
    this.taskCompletionLocksService.pageIndex = event.selectedPage;
    this.taskCompletionLocksService.currentPageSize = event.pageSize;
    this.refreshTaskCompletionLocks();
  }
  
  
  get locks(): TaskCompletionsLocksDTO[]{
    return this.taskCompletionLocksService.currentLoadedData;
  }

  get allStatuses(): string[] {
    return TaskCompletionLockStatusPipe.ALL_STATUS;
  }

  get yearFilter(){
    return this.taskCompletionLocksService.yearFilter;
  }

  set yearFilter(value: number){
    this.taskCompletionLocksService.yearFilter = value;
  }

  get monthFilter(){
    return this.taskCompletionLocksService.monthFilter;
  }

  set monthFilter(value: number){
    this.taskCompletionLocksService.monthFilter = value;
  }

  get statusFilter(){
    return this.taskCompletionLocksService.statusFilter;
  }

  set statusFilter(value: string){
    this.taskCompletionLocksService.statusFilter = value;
  }
  
  
}
