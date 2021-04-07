import { Injectable } from '@angular/core';
import { ResetableService } from '../resetable-service.model';
import { OrderEvent } from 'src/app/util/order-event.model';
import { RestDataSource } from '../../rest.datasource';
import { BackendUrlsService } from '../../backend-urls.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { SPredicateBuilder } from 'src/app/util/querying/s-predicate-builder.service';
import { PaycheckDTO } from '../../dtos/impiegato/paycheck-dto.model';
import { HttpErrorResponse, HttpEvent, HttpParams, HttpResponse } from '@angular/common/http';
import { Params } from '@angular/router';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { SPredicate } from 'src/app/util/querying/s-predicate.model';
import { GenericResponse } from '../../dtos/generic-response.model';
import { map, catchError } from 'rxjs/operators';
import { Page } from 'src/app/util/querying/page.model';
import { QueryParameter } from 'src/app/util/querying/query-parameter.model';
import { PagingAndSorting } from 'src/app/util/querying/paging-and-sorting.model';
import { DateUtils } from 'src/app/util/dates/date-utils';

const DEFAULT_PAGE_SIZE: number = 5;

@Injectable()
export class EmployeePaycheckService implements ResetableService {
  
  

  public currentSortBy: OrderEvent = new OrderEvent("", "");

  dataAreLoaded: boolean = false;
  currentEmployeeId: number = null;

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
          this.loadPaychecksOfEmployee(this.buildQueryPredicate())
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
    return this.loadPaychecksOfEmployee(this.buildQueryPredicate());
  }

  private loadPaychecksOfEmployee(predicate: SPredicate): Observable<any>{
    return this.datasource.sendGetRequest<GenericResponse<any>>(
                    this.backendUrlsSrv.getAllEmployeePaycheckEndpoint(), predicate.params, true)
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
    this.predicateBuider.addNumberQueryParamForFilter("userProfileId", this.currentEmployeeId, queryParameters);
    this.predicateBuider.addNumberQueryParamForFilter("year", this.yearFilter, queryParameters);
    this.predicateBuider.addNumberQueryParamForFilter("month", this.monthFilter, queryParameters);

    return queryParameters;
  }


  uploadNewPaycheck(title: string, file: File, month: number, 
                      year: number, checkFiscalCode: boolean, forceAdd: boolean): Observable<HttpEvent<any>>{
    let addRequest = {
      month: month,
      year: year,
      userProfileId: this.currentEmployeeId,
      checkFiscalCode: checkFiscalCode,
      forceAdd: forceAdd,
      title: title
    };

    let formData: FormData = new FormData();
    formData.append('paycheck', file);
    formData.append('info', JSON.stringify(addRequest));

    return this.datasource.uploadWithPost(this.backendUrlsSrv.getUploadPaycheckEndpoint(), formData)
    .pipe(
        map(event=>{
          if(event instanceof HttpResponse){
            this.currentLoadedData.unshift(event.body.data);
          }
          return event;
        })
      );
  }

  downloadPaycheck(paycheck: PaycheckDTO) {
    let params: HttpParams = new HttpParams();
    params = params.append('paycheckId', paycheck.id+'');

    return this.datasource.sendGetRequest(this.backendUrlsSrv.getDownloadPaycheckUrl(), params)
  }

  deletePaycheck(paycheck: PaycheckDTO) {
    let params: HttpParams = new HttpParams();
    params = params.append('paycheckId', paycheck.id+'');

    return this.datasource.sendDeleteRequest(this.backendUrlsSrv.getDeletePaycheckUrl(), params)
  }

}
