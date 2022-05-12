import { Injectable, Predicate, OnInit, AfterViewInit } from '@angular/core';
import { RestDataSource } from '../../rest.datasource';
import { ResetableService } from '../resetable-service.model';
import { Params } from '@angular/router';
import { Observable, forkJoin, Subject, throwError, of } from 'rxjs';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { GenericResponse } from '../../dtos/generic-response.model';
import { SPredicate } from 'src/app/util/querying/s-predicate.model';
import { OrderEvent } from 'src/app/util/order-event.model';
import { map, catchError } from 'rxjs/operators';
import { LoginLogsDTO } from '../../dtos/login-log-dto.model';
import { QueryParameter } from 'src/app/util/querying/query-parameter.model';
import { SPredicateBuilder } from 'src/app/util/querying/s-predicate-builder.service';
import { PagingAndSorting } from 'src/app/util/querying/paging-and-sorting.model';
import { HttpErrorResponse } from '@angular/common/http';
import { BackendUrlsService } from '../../backend-urls.service';
import { FilterElement, FilterType, DateFilterElement } from 'src/app/dashboard/components/custom-filters/custom-filters.component';
import { Page } from 'src/app/util/querying/page.model';

const DEFAULT_PAGE_SIZE: number = 5;

@Injectable()
export class SuccessfullyLoginLogsService implements ResetableService, OnInit{

  private dataAreLoaded: boolean = false;
  private dateFrom: Date;
  public currentSortBy: OrderEvent = new OrderEvent("", "");
  
  public totalElements: number = 0;
  public totalPages: number = 0;
  public numberOfElements: number = 0;
  public pageIndex: number = 0;
  public currentPageSize: number = DEFAULT_PAGE_SIZE;
  public currentLoadedUserAccessLogs: LoginLogsDTO[] = [];

  private filtersInizialized: boolean = false;
  accessLogsFilter: FilterElement[] = [];

  dateFromFilter :DateFilterElement = {
      id: 'fromDate', i18nKeyLabel: "logUserAccess.date-from", name: 'SuccessfullyLoginLogsService.fromDate',
      value: null, type: FilterType.CALENDAR
  }

  dateToFilter :DateFilterElement = {
      id: 'toDate', i18nKeyLabel: "logUserAccess.date-to", name: 'SuccessfullyLoginLogsService.toDate',
      value: null, type: FilterType.CALENDAR
  }

  constructor(private datasouce: RestDataSource, private backendUrlsSrv: BackendUrlsService,
                private exceptionHandler: ChainExceptionHandler,
                  private predicateBuider: SPredicateBuilder) { 
                  
  }

  ngOnInit() {
  }

  areDataLoaded(): boolean{
    return this.dataAreLoaded;
  }

  reset(): void{
    this.dataAreLoaded = false;
    this.resetFilters();
    this.resetPagingAndData();
  }

  resetPagingAndData(){
    this.totalElements = 0;
    this.totalPages = 0;
    this.numberOfElements = 0;
    this.pageIndex = 0;
    this.currentPageSize = DEFAULT_PAGE_SIZE;
    this.currentLoadedUserAccessLogs = [];
    this.currentSortBy = new OrderEvent('', '');
  } 

  resetFilters(){
      this.filtersInizialized = false;
      this.accessLogsFilter = [];
      this.dateFromFilter.value = null;
      this.dateToFilter.value = null;
  }

  initializeFilters(){
      this.filtersInizialized = false;
      this.accessLogsFilter = [];
      this.dateFromFilter.value = null;
      this.dateToFilter.value = null;
      this.accessLogsFilter.push(this.dateFromFilter, this.dateToFilter);
      this.filtersInizialized = true;
  }

  onResolveFailure(error: HttpErrorResponse): void{
  }

  loadInitialInformation(routeParams: Params, forceReload : boolean = false): Observable<boolean>{
    if(!this.filtersInizialized){
      this.initializeFilters();
    }
    if(this.dataAreLoaded && !forceReload){
      return of(true);
    }
    return Observable.create(
        (observer) => {
          forkJoin(
            this.getUserSuccessfullyLoginLogs(this.buildQueryPredicate())
            )
            .subscribe(
              (successful) => {
                  this.dataAreLoaded = true;
                  observer.next(true);
                  observer.complete(); 
                },
              error =>{
                  
                  this.dataAreLoaded = false;
                  this.exceptionHandler.manageErrorWithLongChain(error.status);
                  observer.next(false);
                  observer.complete();
              }
            );
        }
    );
  }

  private buildFilters(): QueryParameter[]{
    let queryParameters: QueryParameter[] = [];   
    let dateFromPark: Date = this.dateFromFilter.value;

    if(dateFromPark!=null){
      let fromDate: QueryParameter = new QueryParameter(this.dateFromFilter.id, null);
      fromDate.value = dateFromPark.getFullYear()+"-"+(dateFromPark.getMonth() + 1)+"-"+dateFromPark.getDate()+" 00:00:00";
      queryParameters.push(fromDate);
    }

    let dateToPark: Date = this.dateToFilter.value;
    if(dateToPark!=null){
      let toDate: QueryParameter = new QueryParameter(this.dateToFilter.id, null);
      toDate.value = dateToPark.getFullYear()+"-"+(dateToPark.getMonth() + 1)+"-"+dateToPark.getDate()+" 23:59:59";
      queryParameters.push(toDate);
    }
    
    return queryParameters;
  }

  buildQueryPredicate(): SPredicate {
    let pagingAndSorting = new PagingAndSorting(this.pageIndex, this.currentPageSize, this.currentSortBy.getSortBy(), this.currentSortBy.getDir());
    
    return this.predicateBuider.buildPredicate(this.buildFilters(), pagingAndSorting);
  }


  private getUserSuccessfullyLoginLogs(predicate: SPredicate){
    let funToCall;
    if(predicate!=null){
      funToCall = this.datasouce.sendGetRequest<GenericResponse<any>>(this.backendUrlsSrv.getSuccLoginLogsUrl(), 
                  predicate.params, true);
    }else{
      funToCall = this.datasouce.sendGetRequest<GenericResponse<any>>(this.backendUrlsSrv.getSuccLoginLogsUrl(), null, true);
    }
    return funToCall.pipe(
        map((response: GenericResponse<Page<LoginLogsDTO>>) => {
          this.numberOfElements = response.data.numberOfElements;
          this.totalPages = response.data.totalPages;
          this.totalElements = response.data.totalElements;
          this.currentLoadedUserAccessLogs = response.data.content;
          return true;
        }),
        catchError((err) =>  {
          return throwError(err); 
        })
      );
    
  }
  


}
