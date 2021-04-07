import { Component, OnInit } from '@angular/core';
import { OrderEvent } from 'src/app/util/order-event.model';
import { MyExpenseReportsService } from 'src/app/model/services/expenses/my-expense-report.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';
import { PaginationEvent } from '../components/custom-paginator/custom-paginator.component';
import { ExpenseReportDTO } from 'src/app/model/dtos/expenses/expense-report-dto.model';
import { ExpenseReportStatusPipe } from 'src/app/util/pipes/expense-report-status.pipe';
import { MonthPickEvent } from '../components/monthpicker/monthpicker.component';
import { Router } from '@angular/router';
import { StringDTO } from 'src/app/model/dtos/string-dto.model';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { StandardErrorCode } from 'src/app/util/standard-error-code';

@Component({
  selector: 'app-my-expense-report',
  templateUrl: './my-expense-report.component.html',
  styleUrls: ['./my-expense-report.component.scss']
})
export class MyExpenseReportComponent implements OnInit {

  public sortBy = new OrderEvent();
  
  constructor(private myExpenseReportsService: MyExpenseReportsService, private router: Router,
                private exceptionHandler: ChainExceptionHandler, private notifier: MessageNotifierService,
                  private loader: LoadingService, private confirmer: CustomConfirmationService) { }

  ngOnInit(): void {
  }

  canBeDeleted(elem: ExpenseReportDTO){
    return elem.status=='TO_BE_PROCESSED';
  }

  delete(elem: ExpenseReportDTO){
    let that = this;
    this.confirmer.askConfirmationWithStandardTitleI18nNoRejectCallback("message.sure-to-delete-expense-report", 
    ()=>{
      that.executeDeleteExpenseElement(elem)
    })
  }

  executeDeleteExpenseElement(elem: ExpenseReportDTO) {
    this.loader.startLoading();

    this.myExpenseReportsService.deleteExpenseReport(elem).subscribe(
      (succ: GenericResponse<StringDTO>)=>{
        this.loader.endLoading();
        this.refreshReports()
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.deleted-expense-report");
      },
      (error: HttpErrorResponse)=>{
        this.loader.endLoading();
        this.manageErrorUpdatingReportDetails(error);
      }
    )
  }

  manageErrorUpdatingReportDetails(error: HttpErrorResponse){

    if(error.status==ChainExceptionHandler.UNPROCESSABLE_ENTITY){
      let subcode = error.error.subcode;
      if(subcode==StandardErrorCode.SUBMISSION_FOR_THIS_DATE_IS_LOCKED){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.submissions-for-this-date-are-locked");
        return;
      }
      if(subcode==StandardErrorCode.USER_IS_NOT_AN_EMPLOYEE){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.user-is-not-an-employee-in-this-date");
        return;
      }
      if(subcode==StandardErrorCode.REPORT_CANNOT_BE_MODIFIED){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.expense-report-cannot-be-modified");
        return;
      }
      
    }
    
    this.exceptionHandler.manageErrorWithLongChain(error.status);
  }

  
  createNewReport(){
    this.router.navigateByUrl('dashboard/myExpenseReportDetails/NEW');
  }
  
  openExpenseDetails(report: ExpenseReportDTO){
    this.router.navigateByUrl('dashboard/myExpenseReportDetails/'+report.id);
  }

  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  }
  
  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.myExpenseReportsService.currentSortBy = event;
    this.refreshReports();
  }
  
  resetFilters(){
    this.myExpenseReportsService.resetFilters();
    this.refreshReports();
  }

  filtersChanged(){
    this.refreshReports();
  }
  
  getCurrentPageIndex(): number{
    return this.myExpenseReportsService.pageIndex;
  }

  getTotalRecords(): number{
    return this.myExpenseReportsService.totalElements;
  }

  getCurrentPageSize(): number{
    return this.myExpenseReportsService.currentPageSize;
  }

  refreshReports(){
    this.loader.startLoading();

    this.myExpenseReportsService.realodAllMyExpenseReports().subscribe(
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
    this.myExpenseReportsService.pageIndex = event.selectedPage;
    this.myExpenseReportsService.currentPageSize = event.pageSize;
    this.refreshReports();
  }
  
  
  get reports(): ExpenseReportDTO[]{
    return this.myExpenseReportsService.currentLoadedData;
  }

  get allStatuses(): string[] {
    return ExpenseReportStatusPipe.ALL_STATUSES;
  }

  get locationFilter(){
    return this.myExpenseReportsService.locationFilter;
  }

  set locationFilter(value: string){
    this.myExpenseReportsService.locationFilter = value;
  }

  get titleFilter(){
    return this.myExpenseReportsService.titleFilter;
  }

  set titleFilter(value: string){
    this.myExpenseReportsService.titleFilter = value;
  }
  

  get statusFilter(){
    return this.myExpenseReportsService.statusFilter;
  }

  set statusFilter(value: string){
    this.myExpenseReportsService.statusFilter = value;
  }

  get dateToFilter(){
    return this.myExpenseReportsService.dateToFilter;
  }

  get dateFromFilter(){
    return this.myExpenseReportsService.dateFromFilter;
  }

  onChangeDateToFilter(event: MonthPickEvent){
    let parkDate = null;
    if(event!=null){
      parkDate = new Date(Date.UTC(event.year, event.month, event.day));
    }
    
    this.myExpenseReportsService.dateToFilter = parkDate;
  }

  onChangeDateFromFilter(event: MonthPickEvent){
    let parkDate = null;
    if(event!=null){
      parkDate = new Date(Date.UTC(event.year, event.month, event.day));
    }
    this.myExpenseReportsService.dateFromFilter = parkDate;
  }

}
