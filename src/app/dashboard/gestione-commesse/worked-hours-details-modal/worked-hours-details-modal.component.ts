import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { WorkTaskSummaryService } from 'src/app/model/services/incarico/work-task-summary.service';
import { OrderEvent } from 'src/app/util/order-event.model';
import { CompletedTaskDTO } from 'src/app/model/dtos/incarico/completed-task.dto';
import { PaginationEvent } from '../../components/custom-paginator/custom-paginator.component';
import { QueryParameter } from 'src/app/util/querying/query-parameter.model';
import { SPredicate } from 'src/app/util/querying/s-predicate.model';
import { PagingAndSorting } from 'src/app/util/querying/paging-and-sorting.model';
import { FilterElement } from '../../components/custom-filters/custom-filters.component';
import { SPredicateBuilder } from 'src/app/util/querying/s-predicate-builder.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { Page } from 'src/app/util/querying/page.model';

declare const $: any;
const DEFAULT_PAGE_SIZE: number = 5;

@Component({
  selector: 'app-worked-hours-details-modal',
  templateUrl: './worked-hours-details-modal.component.html',
  styleUrls: ['./worked-hours-details-modal.component.scss']
})
export class WorkedHoursDetailsModalComponent implements OnInit {

  @ViewChild("workedHoursDetailsModal", { static: true })
  workedHoursDetailsModal: ElementRef;

  taskId: number;
  userProfileId: number;
  startDate: Date;
  endDate: Date;
  title: string = '';

  private showLoaderInModal: boolean = false;

  private currentSortBy: OrderEvent = new OrderEvent("", "");
  sortBy = new OrderEvent();
  initialSelectedPage: number = 0;

  public totalElements: number = 0;
  public totalPages: number = 0;
  public numberOfElements: number = 0;
  public pageIndex: number = 0;
  public currentPageSize: number = DEFAULT_PAGE_SIZE;
  public currentLoadedData: CompletedTaskDTO[] = [];


  constructor(private workTaskSummaryService: WorkTaskSummaryService, private exceptionHandler: ChainExceptionHandler,
                private predicateBuider: SPredicateBuilder) { 

  }

  ngOnInit(): void {
  }

  get showLoader(){
    return this.showLoaderInModal;
  }

  reset(){
    this.resetPagingAndData();
  }

  
  resetPagingAndData() {
    this.initialSelectedPage = 0;
    this.totalElements = 0;
    this.totalPages = 0;
    this.numberOfElements = 0;
    this.pageIndex = 0;
    this.currentPageSize = DEFAULT_PAGE_SIZE;
    this.currentSortBy = new OrderEvent('', '');
    this.currentLoadedData = [];
  }

  openDialog(taskId: number, userProfileId: number, startDate: Date, endDate: Date, name: string, surname: string){
    this.taskId = taskId;
    this.userProfileId = userProfileId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.title = '';
    if(name!=null){
      this.title = this.title + name+' ';
    }
    if(surname!=null){
      this.title = this.title + surname;
    }
    this.reset();
    this.refreshData();
    $(this.workedHoursDetailsModal.nativeElement).modal()//{backdrop: 'static', keyboard: false})
  }

  closeDialog(){
    $(this.workedHoursDetailsModal.nativeElement).modal('hide');
  }

  getCurrentPageIndex(): number{
    return this.pageIndex;
  }

  getTotalRecords(): number{
    return this.totalElements;
  }

  getCurrentPageSize(): number{
    return this.currentPageSize;
  }

  refreshData(){
    this.loadWorkedHoursDetails();
  }

  changePage(event: PaginationEvent) {
    this.pageIndex = event.selectedPage;
    this.currentPageSize = event.pageSize;
    this.refreshData();
  }

  filtersChanged(event){
    this.refreshData();
  }

  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.currentSortBy = this.sortBy;
    this.refreshData();
  }


  private loadWorkedHoursDetails(){
    this.showLoaderInModal = true;
  
    this.workTaskSummaryService.findWorkedHoursDetails(this.taskId, this.buildQueryPredicate())
    .subscribe(
      (successful: GenericResponse<Page<CompletedTaskDTO>>) => {
          this.numberOfElements = successful.data.numberOfElements;
          this.totalPages = successful.data.totalPages;
          this.totalElements = successful.data.totalElements;

          this.currentLoadedData = successful.data.content;
          
          this.showLoaderInModal = false;
      },
      (error: HttpErrorResponse) =>{
          this.currentLoadedData = [];
          this.exceptionHandler.manageErrorWithLongChain(error.status);
          this.showLoaderInModal = false;
      }
    );
  }
  

  private buildQueryPredicate(): SPredicate {
    let pagingAndSorting = new PagingAndSorting(this.pageIndex, this.currentPageSize, this.currentSortBy.getSortBy(), 
                this.currentSortBy.getDir());
    
    return this.predicateBuider.buildPredicate(this.buildFilters(), pagingAndSorting);
  }

  private buildFilters(): QueryParameter[]{
      let queryParameters: QueryParameter[] = [];
      this.predicateBuider.addNumberQueryParamForFilter("userProfileId", this.userProfileId, queryParameters);
      this.predicateBuider.addDateQueryParamForFilter("endDate", this.endDate, queryParameters);
      this.predicateBuider.addDateQueryParamForFilter("startDate", this.startDate, queryParameters);
      
      return queryParameters;
  }

}
