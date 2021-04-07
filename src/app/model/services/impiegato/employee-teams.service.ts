import { Injectable } from '@angular/core';
import { RestDataSource } from '../../rest.datasource';
import { BackendUrlsService } from '../../backend-urls.service';
import { ResetableService } from '../resetable-service.model';
import { OrderEvent } from 'src/app/util/order-event.model';
import { HttpErrorResponse } from '@angular/common/http';
import { of, Observable, forkJoin, throwError } from 'rxjs';
import { Params } from '@angular/router';
import { SPredicate } from 'src/app/util/querying/s-predicate.model';
import { PagingAndSorting } from 'src/app/util/querying/paging-and-sorting.model';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { SPredicateBuilder } from 'src/app/util/querying/s-predicate-builder.service';
import { QueryParameter } from 'src/app/util/querying/query-parameter.model';
import { GenericResponse } from '../../dtos/generic-response.model';
import { Page } from 'src/app/util/querying/page.model';
import { map, catchError } from 'rxjs/operators';
import { FilterElement, FilterType } from 'src/app/dashboard/components/custom-filters/custom-filters.component';
import { WorkTaskDTO } from '../../dtos/incarico/work-task-dto.model';

const DEFAULT_PAGE_SIZE: number = 5;

@Injectable()
export class EmployeeTeamsService implements ResetableService {

  public currentSortBy: OrderEvent = new OrderEvent("", "");

  dataAreLoaded: boolean = false;
  currentEmployeeId: number = null;

  public totalElements: number = 0;
  public totalPages: number = 0;
  public numberOfElements: number = 0;
  public pageIndex: number = 0;
  public currentPageSize: number = DEFAULT_PAGE_SIZE;
  public currentLoadedCommesse: WorkTaskDTO[] = [];

  filtersInizialized: boolean = false;
  
  tasksFilters: FilterElement[] = [];

   descrizioneIncaricoFilter :FilterElement = {
        id: 'taskDescriptionCustom', i18nKeyLabel: 'label.descrizione-commessa', name: 'EmployeeTeamsService.taskDescriptionCustom',
        value: null, type: FilterType.TEXT
   }

   codiceIncaricoFilter :FilterElement = {
        id: 'taskCodeCustom', i18nKeyLabel: 'label.codice-commessa', name: 'EmployeeTeamsService.taskCodeCustom',
        value: null, type: FilterType.TEXT
   }

  constructor(private datasource: RestDataSource, private backendUrlsSrv: BackendUrlsService,
                private exceptionHandler: ChainExceptionHandler,  private predicateBuider: SPredicateBuilder) {

  }


  reset(): void {
    this.dataAreLoaded = false;
    this.initializeFilters();
    this.resetFilters();
    this.resetPagingAndData();
  }

  resetFilters() {
    if(this.filtersInizialized){
      this.descrizioneIncaricoFilter.value = null;
      this.codiceIncaricoFilter.value = null;
    }
  }
  
  initializeFilters(){
    this.filtersInizialized = false;
    this.tasksFilters = [];
    this.descrizioneIncaricoFilter.value = null;
    this.codiceIncaricoFilter.value = null;
    this.tasksFilters.push(this.codiceIncaricoFilter, this.descrizioneIncaricoFilter);
    this.filtersInizialized = true;
  }

  resetPagingAndData(){
    this.totalElements = 0;
    this.totalPages = 0;
    this.numberOfElements = 0;
    this.pageIndex = 0;
    this.currentPageSize = DEFAULT_PAGE_SIZE;
    this.currentLoadedCommesse = [];
    this.currentSortBy = new OrderEvent('', '');
  }

  areDataLoaded(): boolean {
    return this.dataAreLoaded;
  }

  onResolveFailure(error: HttpErrorResponse): void {
  }


  loadInitialInformation(routeParams: Params, forceReload: boolean = false): Observable<boolean> {
    if(!this.filtersInizialized){
      this.initializeFilters();
    }

    if (this.dataAreLoaded && !forceReload && routeParams.idEmployee==this.currentEmployeeId) {
      return of(true);
    }

    //if employee is different reset page old content
    if(routeParams.idEmployee!=this.currentEmployeeId){
      this.reset();
    }

    this.currentEmployeeId = routeParams.idEmployee;
    
    return Observable.create(
      (observer) => {
        forkJoin(
          this.loadTeamsOfEmployee(this.buildQueryPredicate(), this.currentEmployeeId)
        )
          .subscribe(
            (successful) => {
              this.dataAreLoaded = true;
              observer.next(true);
              observer.complete();
            },
            error => {

              this.dataAreLoaded = false;
              this.exceptionHandler.manageErrorWithLongChain(error.status);
              observer.next(false);
              observer.complete();
            }
          );
      }
    );
  }
  

  private loadTeamsOfEmployee(predicate: SPredicate, employeeId){
    return this.datasource.sendGetRequest<GenericResponse<any>>(
                    this.backendUrlsSrv.buildEmployeeWorkTasksEndpoint(employeeId), predicate.params, true)
    .pipe(
        map((response: GenericResponse<Page<WorkTaskDTO>>) => {
          this.numberOfElements = response.data.numberOfElements;
          this.totalPages = response.data.totalPages;
          this.totalElements = response.data.totalElements;
          this.currentLoadedCommesse = response.data.content;
          
          return true;
        }),
        catchError((err) =>  {
          return throwError(err); 
        })
      );
  }

  buildQueryPredicate(): SPredicate {
    let pagingAndSorting = new PagingAndSorting(this.pageIndex, this.currentPageSize, this.currentSortBy.getSortBy(), this.currentSortBy.getDir());

    return this.predicateBuider.buildPredicate(this.buildFilters(), pagingAndSorting);
  }

  private buildFilters(): QueryParameter[]{
    let queryParameters: QueryParameter[] = [];
    if(this.descrizioneIncaricoFilter!=null && this.descrizioneIncaricoFilter.value!=null && this.descrizioneIncaricoFilter.value.trim()!=''){
      let descrizioneIncarico: QueryParameter = new QueryParameter(this.descrizioneIncaricoFilter.id, this.descrizioneIncaricoFilter.value);
      queryParameters.push(descrizioneIncarico);
    }
    if(this.codiceIncaricoFilter!=null && this.codiceIncaricoFilter.value!=null && this.codiceIncaricoFilter.value.trim()!=''){
        let codiceIncarico: QueryParameter = new QueryParameter(this.codiceIncaricoFilter.id, this.codiceIncaricoFilter.value);
        queryParameters.push(codiceIncarico);
    }
    return queryParameters;
  }


}
