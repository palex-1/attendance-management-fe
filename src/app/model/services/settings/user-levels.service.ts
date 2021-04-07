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
import { UserLevelDTO } from '../../dtos/profile/user-level.dto';

const DEFAULT_PAGE_SIZE: number = 5;

@Injectable()
export class UserLevelsService implements ResetableService {
  
  public currentSortBy: OrderEvent = new OrderEvent("", "");

  dataAreLoaded: boolean = false;

  public totalElements: number = 0;
  public totalPages: number = 0;
  public numberOfElements: number = 0;
  public pageIndex: number = 0;
  public currentPageSize: number = DEFAULT_PAGE_SIZE;
  public currentLoadedData: UserLevelDTO[] = [];

  public levelFilter: string = '';

  constructor(private datasource: RestDataSource, private backendUrlsSrv: BackendUrlsService,
                private exceptionHandler: ChainExceptionHandler,  private predicateBuider: SPredicateBuilder) { 
  }

  reset(): void {
    this.dataAreLoaded = false;
    this.resetFilters();
    this.resetPagingAndData();
  }

  resetFilters() {
    this.levelFilter = '';
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
          this.loadAllUserLevels(this.buildQueryPredicate())
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
  
  realodAllUserLevels(): Observable<any>{
    return this.loadAllUserLevels(this.buildQueryPredicate());
  }


  private loadAllUserLevels(predicate: SPredicate): Observable<any>{
    return this.datasource.sendGetRequest<GenericResponse<any>>(
                    this.backendUrlsSrv.getAllUserLevelsEndpoint(), predicate.params, true)
    .pipe(
        map((response: GenericResponse<Page<UserLevelDTO>>) => {
          this.numberOfElements = response.data.numberOfElements;
          this.totalPages = response.data.totalPages;
          this.totalElements = response.data.totalElements;

          this.currentLoadedData = response.data.content;
          
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
    this.predicateBuider.addStringQueryParamForFilter("level", this.levelFilter, queryParameters);

    return queryParameters;
  }


  addNewUserLevel(level: UserLevelDTO): Observable<GenericResponse<UserLevelDTO>>{
    return this.datasource.makePostJsonObject(this.backendUrlsSrv.getAddUserLevelUrl(), level)
    .pipe(
        map(
          (res: GenericResponse<UserLevelDTO>)=>{
            this.currentLoadedData.unshift(res.data);
          
            return res;
        })
      );
  }

  updateUserLevel(level: UserLevelDTO) {
    return this.datasource.makePutJsonObject(this.backendUrlsSrv.getUpdateUserLevelUrl(), level);
  }

  deleteUserLevel(level: UserLevelDTO) {
    let params: HttpParams = new HttpParams();
    params = params.append('levelId', level.id+'');

    return this.datasource.sendDeleteRequest(this.backendUrlsSrv.getDeleteUserLevelUrl(), params)
  }

}
