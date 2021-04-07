import { Injectable } from '@angular/core';
import { OrderEvent } from 'src/app/util/order-event.model';
import { PaycheckDTO } from '../../dtos/impiegato/paycheck-dto.model';
import { BackendUrlsService } from '../../backend-urls.service';
import { RestDataSource } from '../../rest.datasource';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { SPredicateBuilder } from 'src/app/util/querying/s-predicate-builder.service';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { Params } from '@angular/router';
import { SPredicate } from 'src/app/util/querying/s-predicate.model';
import { DateUtils } from 'src/app/util/dates/date-utils';
import { Page } from 'src/app/util/querying/page.model';
import { GenericResponse } from '../../dtos/generic-response.model';
import { map, catchError } from 'rxjs/operators';
import { PagingAndSorting } from 'src/app/util/querying/paging-and-sorting.model';
import { QueryParameter } from 'src/app/util/querying/query-parameter.model';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';

const DEFAULT_PAGE_SIZE: number = 5;

@Injectable()
export class MyPaychecksService {

  public currentSortBy: OrderEvent = new OrderEvent("", "");

  dataAreLoaded: boolean = false;

  public totalElements: number = 0;
  public totalPages: number = 0;
  public numberOfElements: number = 0;
  public pageIndex: number = 0;
  public currentPageSize: number = DEFAULT_PAGE_SIZE;
  public currentLoadedData: PaycheckDTO[] = [];
  public yearFilter: number = null;
  public monthFilter: number = null;
  
  constructor(private datasource: RestDataSource, private backendUrlsSrv: BackendUrlsService,
                private exceptionHandler: ChainExceptionHandler,  private predicateBuider: SPredicateBuilder) { 

  }

  reset(): void {
    this.dataAreLoaded = false;
    this.resetFilters();
    this.resetPagingAndData();
  }

  resetFilters() {
    this.yearFilter = null;
    this.monthFilter = null;
  }

  resetPagingAndData(){
    this.totalElements = 0;
    this.totalPages = 0;
    this.numberOfElements = 0;
    this.pageIndex = 0;
    this.currentPageSize = DEFAULT_PAGE_SIZE;
    this.currentLoadedData = [];
    this.currentSortBy = new OrderEvent('', '');
  }

  areDataLoaded(): boolean {
    return this.dataAreLoaded;
  }

  onResolveFailure(error: HttpErrorResponse): void {
  }

  loadInitialInformation(routeParams: Params, forceReload: boolean = false): Observable<boolean> {
    if (this.dataAreLoaded && !forceReload) {
      return of(true);
    }

    
    return Observable.create(
      (observer) => {
        forkJoin(
          this.loadPaychecksOfCurrentLoggedEmployee(this.buildQueryPredicate())
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

  
  realodPaychecks(): Observable<any>{
    return this.loadPaychecksOfCurrentLoggedEmployee(this.buildQueryPredicate());
  }

  private loadPaychecksOfCurrentLoggedEmployee(predicate: SPredicate): Observable<any>{
    return this.datasource.sendGetRequest<GenericResponse<any>>(
                    this.backendUrlsSrv.getAllMyPaycheckEndpoint(), predicate.params, true)
    .pipe(
        map((response: GenericResponse<Page<PaycheckDTO>>) => {
          this.numberOfElements = response.data.numberOfElements;
          this.totalPages = response.data.totalPages;
          this.totalElements = response.data.totalElements;

          this.currentLoadedData = response.data.content;

          for(let i=0; i<this.currentLoadedData.length; i++){
            if(this.currentLoadedData[i].sendEmailDate!=null){
              this.currentLoadedData[i].sendEmailDate = DateUtils.buildDateFromStrOrDate(this.currentLoadedData[i].sendEmailDate);
            }
          }
          
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
    this.predicateBuider.addNumberQueryParamForFilter("year", this.yearFilter, queryParameters);
    this.predicateBuider.addNumberQueryParamForFilter("month", this.monthFilter, queryParameters);

    return queryParameters;
  }



  downloadPaycheck(paycheck: PaycheckDTO) {
    let params: HttpParams = new HttpParams();
    params = params.append('paycheckId', paycheck.id+'');

    return this.datasource.sendGetRequest(this.backendUrlsSrv.getDownloadMyPaycheckUrl(), params)
  }


}
