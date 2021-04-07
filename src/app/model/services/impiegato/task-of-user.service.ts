import { Injectable } from '@angular/core';
import { FilterElement, FilterType } from 'src/app/dashboard/components/custom-filters/custom-filters.component';
import { WorkTaskDTO } from '../../dtos/incarico/work-task-dto.model';
import { OrderEvent } from 'src/app/util/order-event.model';
import { QueryParameter } from 'src/app/util/querying/query-parameter.model';
import { SPredicate } from 'src/app/util/querying/s-predicate.model';
import { PagingAndSorting } from 'src/app/util/querying/paging-and-sorting.model';
import { catchError, map } from 'rxjs/operators';
import { RestDataSource } from '../../rest.datasource';
import { SPredicateBuilder } from 'src/app/util/querying/s-predicate-builder.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { BackendUrlsService } from '../../backend-urls.service';
import { GenericResponse } from '../../dtos/generic-response.model';
import { Page } from 'src/app/util/querying/page.model';
import { throwError } from 'rxjs';

const DEFAULT_PAGE_SIZE = 5;

@Injectable()
export class TaskOfUserService {

  public currentSortBy: OrderEvent = new OrderEvent("", "");

  public totalElements: number = 0;
  public totalPages: number = 0;
  public numberOfElements: number = 0;
  public pageIndex: number = 0;
  public currentPageSize: number = DEFAULT_PAGE_SIZE;
  public currentLoadedCommesse: WorkTaskDTO[] = [];

  private filtersInizialized: boolean = false;

  gestioneCommessaFilters: FilterElement[] = [];

  descrizioneIncaricoFilter: FilterElement = {
    id: 'taskDescriptionCustom', i18nKeyLabel: 'label.descrizione-commessa', name: 'TaskOfUserService.descrizioneIncaricoCUSTOMIZED',
    value: null, type: FilterType.TEXT
  }

  codiceIncaricoFilter: FilterElement = {
    id: 'taskCodeCustom', i18nKeyLabel: 'label.codice-commessa', name: 'TaskOfUserService.codiceIncaricoCUSTOMIZED',
    value: null, type: FilterType.TEXT
  }

  constructor(private datasource: RestDataSource, private backendUrlsSrv: BackendUrlsService,
                private exceptionHandler: ChainExceptionHandler, private predicateBuider: SPredicateBuilder) { }

  reset(): void {
    this.resetFilters();
    this.resetPagingAndData();
    this.initializeFilters();
  }

  resetPagingAndData() {
    this.totalElements = 0;
    this.totalPages = 0;
    this.numberOfElements = 0;
    this.pageIndex = 0;
    this.currentPageSize = DEFAULT_PAGE_SIZE;
    this.currentLoadedCommesse = [];
    this.currentSortBy = new OrderEvent('', '');
  }

  resetFilters() {
    this.filtersInizialized = false;
    this.gestioneCommessaFilters = [];
    this.descrizioneIncaricoFilter.value = null;
    this.codiceIncaricoFilter.value = null;
  }

  initializeFilters() {
    this.filtersInizialized = false;
    this.gestioneCommessaFilters = [];
    this.descrizioneIncaricoFilter.value = null;
    this.codiceIncaricoFilter.value = null;
    this.gestioneCommessaFilters.push(this.codiceIncaricoFilter, this.descrizioneIncaricoFilter);
    this.filtersInizialized = true;
  }

  loadWorkTaskOfUser(){
    return this.loadWorkTask(this.buildQueryPredicate())
  }

  private loadWorkTask(predicate: SPredicate){

    return this.datasource.sendGetRequest<GenericResponse<any>>(
      this.backendUrlsSrv.getFindAllMyEnabledTasksEndpoint(), predicate.params, true)
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

  buildQueryPredicate(): SPredicate {
      let pagingAndSorting = new PagingAndSorting(this.pageIndex, this.currentPageSize, this.currentSortBy.getSortBy(), this.currentSortBy.getDir());
      
      return this.predicateBuider.buildPredicate(this.buildFilters(), pagingAndSorting);
  }


}
