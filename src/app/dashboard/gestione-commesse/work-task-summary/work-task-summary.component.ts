import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkTaskSummaryService } from 'src/app/model/services/incarico/work-task-summary.service';
import { OrderEvent } from 'src/app/util/order-event.model';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { PaginationEvent } from '../../components/custom-paginator/custom-paginator.component';
import { WorkTaskSummaryDTO } from 'src/app/model/dtos/incarico/work-task-summary.model';
import { MonthPickEvent } from '../../components/monthpicker/monthpicker.component';
import { WorkedHoursDetailsModalComponent } from '../worked-hours-details-modal/worked-hours-details-modal.component';

@Component({
  selector: 'app-work-task-summary',
  templateUrl: './work-task-summary.component.html',
  styleUrls: ['./work-task-summary.component.scss']
})
export class WorkTaskSummaryComponent implements OnInit {

  @ViewChild("workedHoursDetailsModalRef", { static: true })
  workedHoursDetailsModalRef: WorkedHoursDetailsModalComponent;


  public sortBy = new OrderEvent();
  
  constructor(private workTaskSummaryService: WorkTaskSummaryService,
                private errorHandler: ChainExceptionHandler, private loader: LoadingService) { 
    
  }

  ngOnInit(): void {
  }

  openWorkedHoursDetailsModal(elem: WorkTaskSummaryDTO){
    this.workedHoursDetailsModalRef.openDialog(this.workTaskSummaryService.currentTaskId, elem.userProfile.id, 
      this.workTaskSummaryService.dateStartFilter, this.workTaskSummaryService.dateEndFilter,
      elem.userProfile.name, elem.userProfile.surname);
  }


  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  }

  
  resetFilters(){
    this.workTaskSummaryService.resetFilters();
    this.refreshSummary();
  }

  getCurrentPageIndex(): number{
    return this.workTaskSummaryService.pageIndex;
  }

  getTotalRecords(): number{
    return this.workTaskSummaryService.totalElements;
  }

  getCurrentPageSize(): number{
    return this.workTaskSummaryService.currentPageSize;
  }

  refreshSummary(){
    this.loader.startLoading();

    this.workTaskSummaryService.loadTaskCodeSummary()
          .subscribe(
            succ=>{
              this.loader.endLoading();
            },
            error=>{
              this.errorHandler.manageErrorWithLongChain(error.status);
              this.loader.endLoading();
            }
          );
  }

  get summary(): WorkTaskSummaryDTO[]{
    if(this.workTaskSummaryService.currentLoadedData==null){
      return [];
    }
    return this.workTaskSummaryService.currentLoadedData;
  }

  filtersChanged(event){
    this.refreshSummary();
  }

  changePage(event: PaginationEvent) {
    this.workTaskSummaryService.pageIndex = event.selectedPage;
    this.workTaskSummaryService.currentPageSize = event.pageSize;
    this.refreshSummary();
  }


  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.workTaskSummaryService.currentSortBy = event;
    this.refreshSummary();
  }

  get userNameFilter(): string{
    return this.workTaskSummaryService.userNameFilter;
  }

  set userNameFilter(value: string) {
    this.workTaskSummaryService.userNameFilter = value;
  }

  get userEmailFilter(): string{
    return this.workTaskSummaryService.userEmailFilter;
  }

  set userEmailFilter(value: string) {
    this.workTaskSummaryService.userEmailFilter = value;
  }

  get userSurnameFilter(): string{
    return this.workTaskSummaryService.userSurnameFilter;
  }

  set userSurnameFilter(value: string) {
    this.workTaskSummaryService.userSurnameFilter = value;
  }

  get workedFromFilter(){
    return this.workTaskSummaryService.dateStartFilter;
  }

  get workedToFilter(){
    return this.workTaskSummaryService.dateEndFilter;
  }

  onChangeWorkedToDateFilter(event: MonthPickEvent){
    let parkDate = null;
    if(event!=null){
      parkDate = new Date(Date.UTC(event.year, event.month, event.day));
    }
    
    this.workTaskSummaryService.dateEndFilter = parkDate;
  }

  onChangeWorkedFromDateFilter(event: MonthPickEvent){
    let parkDate = null;
    if(event!=null){
      parkDate = new Date(Date.UTC(event.year, event.month, event.day));
    }
    this.workTaskSummaryService.dateStartFilter = parkDate;
  }

}
