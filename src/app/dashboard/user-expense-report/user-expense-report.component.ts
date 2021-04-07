import { Component, OnInit } from '@angular/core';
import { MonthPickEvent } from '../components/monthpicker/monthpicker.component';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StandardErrorCode } from 'src/app/util/standard-error-code';
import { ExpenseReportDTO } from 'src/app/model/dtos/expenses/expense-report-dto.model';
import { StringDTO } from 'src/app/model/dtos/string-dto.model';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { UserExpenseReportsService } from 'src/app/model/services/expenses/user-expense-report.service';
import { Router } from '@angular/router';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { OrderEvent } from 'src/app/util/order-event.model';
import { PaginationEvent } from '../components/custom-paginator/custom-paginator.component';
import { ExpenseReportStatusPipe } from 'src/app/util/pipes/expense-report-status.pipe';
import { UserProfileDTO } from 'src/app/model/dtos/profile/user-profile.dto';

@Component({
  selector: 'app-user-expense-report',
  templateUrl: './user-expense-report.component.html',
  styleUrls: ['./user-expense-report.component.scss']
})
export class UserExpenseReportComponent implements OnInit {

  public sortBy = new OrderEvent();
  
  constructor(private userExpenseReportsService: UserExpenseReportsService, private router: Router,
                private exceptionHandler: ChainExceptionHandler, private notifier: MessageNotifierService,
                  private loader: LoadingService, private confirmer: CustomConfirmationService) { }

  ngOnInit(): void {
  }

  openExpenseDetails(report: ExpenseReportDTO){
    this.router.navigateByUrl('dashboard/expenseReportsDetails/'+report.id);
  }

  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  }
  
  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.userExpenseReportsService.currentSortBy = event;
    this.refreshReports();
  }
  
  resetFilters(){
    this.userExpenseReportsService.resetFilters();
    this.refreshReports();
  }

  filtersChanged(){
    this.refreshReports();
  }
  
  getCurrentPageIndex(): number{
    return this.userExpenseReportsService.pageIndex;
  }

  getTotalRecords(): number{
    return this.userExpenseReportsService.totalElements;
  }

  getCurrentPageSize(): number{
    return this.userExpenseReportsService.currentPageSize;
  }

  refreshReports(){
    this.loader.startLoading();

    this.userExpenseReportsService.realodAllMyExpenseReports().subscribe(
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
    this.userExpenseReportsService.pageIndex = event.selectedPage;
    this.userExpenseReportsService.currentPageSize = event.pageSize;
    this.refreshReports();
  }

  
  get reports(): ExpenseReportDTO[]{
    return this.userExpenseReportsService.currentLoadedData;
  }

  get allStatuses(): string[] {
    return ExpenseReportStatusPipe.ALL_STATUSES;
  }

  buildNameAndSurname(user: UserProfileDTO){
    if(user==null){
      return '';
    }

    if(user.name!=null && user.surname!=null){
      return user.name+' '+user.surname;
    }

    if(user.name!=null){
      return user.name;
    }

    if(user.surname!=null){
      return user.surname;
    }

    return '';
  }

  get locationFilter(){
    return this.userExpenseReportsService.locationFilter;
  }

  set locationFilter(value: string){
    this.userExpenseReportsService.locationFilter = value;
  }

  get titleFilter(){
    return this.userExpenseReportsService.titleFilter;
  }

  set titleFilter(value: string){
    this.userExpenseReportsService.titleFilter = value;
  }
  
  get madeByEmailFilter(){
    return this.userExpenseReportsService.madeByEmailFilter;
  }

  set madeByEmailFilter(value: string){
    this.userExpenseReportsService.madeByEmailFilter = value;
  }
  
  get statusFilter(){
    return this.userExpenseReportsService.statusFilter;
  }

  set statusFilter(value: string){
    this.userExpenseReportsService.statusFilter = value;
  }

  get dateToFilter(){
    return this.userExpenseReportsService.dateToFilter;
  }

  get dateFromFilter(){
    return this.userExpenseReportsService.dateFromFilter;
  }

  onChangeDateToFilter(event: MonthPickEvent){
    let parkDate = null;
    if(event!=null){
      parkDate = new Date(Date.UTC(event.year, event.month, event.day));
    }
    
    this.userExpenseReportsService.dateToFilter = parkDate;
  }

  onChangeDateFromFilter(event: MonthPickEvent){
    let parkDate = null;
    if(event!=null){
      parkDate = new Date(Date.UTC(event.year, event.month, event.day));
    }
    this.userExpenseReportsService.dateFromFilter = parkDate;
  }

}
