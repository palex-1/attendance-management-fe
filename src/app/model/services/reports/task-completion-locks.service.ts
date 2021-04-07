import { Injectable } from "@angular/core";
import { ResetableService } from "../resetable-service.model";
import { ChainExceptionHandler } from "../../../util/exceptions/chain-exception-handler.service";
import { forkJoin, of, Observable, throwError } from "rxjs";
import { Params, Router } from "@angular/router";
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import { RestDataSource } from "../../rest.datasource";
import { GenericResponse } from "../../dtos/generic-response.model";
import { map, catchError } from "rxjs/operators";
import { BackendUrlsService } from "../../backend-urls.service";
import { SPredicate } from "src/app/util/querying/s-predicate.model";
import { OrderEvent } from "src/app/util/order-event.model";
import { PagingAndSorting } from "src/app/util/querying/paging-and-sorting.model";
import { SPredicateBuilder } from "src/app/util/querying/s-predicate-builder.service";
import { QueryParameter } from "src/app/util/querying/query-parameter.model";
import { Page } from 'src/app/util/querying/page.model';
import { ReportDTO } from '../../dtos/reports/report-dto.model';
import { TaskCompletionsLocksDTO } from '../../dtos/reports/task-completion-locks-dto.model';

const DEFAULT_PAGE_SIZE: number = 5;

@Injectable()
export class TaskCompletionLocksService implements ResetableService {
  
   
  
    public currentSortBy: OrderEvent = new OrderEvent("", "");

    public totalElements: number = 0;
    public totalPages: number = 0;
    public numberOfElements: number = 0;
    public pageIndex: number = 0;
    public currentPageSize: number = DEFAULT_PAGE_SIZE;
    public currentLoadedData: TaskCompletionsLocksDTO[] = [];

    dataAreLoaded: boolean = false;

    yearFilter: number = null;
    monthFilter: number = null;
    includeDeletedFilter: boolean = false;
    statusFilter: string = null;

    constructor(private exceptionHandler: ChainExceptionHandler,
        private router: Router, private backendUrlsSrv: BackendUrlsService,
        private datasource: RestDataSource, private predicateBuider: SPredicateBuilder) {

    }

    reset(): void {
        this.dataAreLoaded = false;
        this.resetFilters();
        this.resetPagingAndData();
    }

    resetPagingAndData() {
        this.totalElements = 0;
        this.totalPages = 0;
        this.numberOfElements = 0;
        this.pageIndex = 0;
        this.currentPageSize = DEFAULT_PAGE_SIZE;
        this.currentLoadedData = [];
        this.currentSortBy = new OrderEvent('', '');
    }

    areDataLoaded(): boolean {
        return false; //always refresh
    }

    onResolveFailure(error: HttpErrorResponse): void {
    }

    resetFilters() {
        this.yearFilter = null;
        this.monthFilter = null;
        this.includeDeletedFilter = false;
        this.statusFilter = null;
    }



    loadInitialInformation(routeParams: Params, forceReload: boolean = false): Observable<boolean> {
        if (this.dataAreLoaded && !forceReload) {//always reload
            return of(true);
        }

        return this.loadTaskCompletionLocks();
    }

    private loadTaskCompletionLocks(): Observable<any> {
        return Observable.create(
            (observer) => {
                forkJoin(
                    this.loadTaskCompletionLock(this.buildQueryPredicate())
                )
                    .subscribe(
                        (successful) => {
                            this.dataAreLoaded = true;
                            observer.next(true);
                            observer.complete();
                        },
                        (error: HttpErrorResponse) => {

                            this.dataAreLoaded = false;
                            this.exceptionHandler.manageErrorWithLongChain(error.status);
                            observer.next(false);
                            observer.complete();
                        }
                    );
            }
        );
    }

    realodAllTaskCompletionLock(): Observable<any> {
        return this.loadTaskCompletionLock(this.buildQueryPredicate());
    }

    private loadTaskCompletionLock(predicate: SPredicate): Observable<any> {

        return this.datasource.sendGetRequest<GenericResponse<Page<TaskCompletionsLocksDTO>>>(
            this.backendUrlsSrv.getFindAllTaskCompletionsLocksUrl(), predicate.params, true
        ).pipe(
            map(
                (response: GenericResponse<Page<TaskCompletionsLocksDTO>>) => {
                    this.numberOfElements = response.data.numberOfElements;
                    this.totalPages = response.data.totalPages;
                    this.totalElements = response.data.totalElements;

                    this.currentLoadedData = response.data.content;

                    return true;
                }
            ),
            catchError((err) => {
                return throwError(err);
            })
        )
    }




    private buildFilters(): QueryParameter[] {
        let queryParameters: QueryParameter[] = [];
        let month = this.monthFilter==null ? null:this.monthFilter-1;
        this.predicateBuider.addNumberQueryParamForFilter("year", this.yearFilter, queryParameters);
        this.predicateBuider.addNumberQueryParamForFilter("month", month, queryParameters);

        this.predicateBuider.addStringQueryParamForFilter('status', this.statusFilter, queryParameters);

        return queryParameters;
    }



    buildQueryPredicate(): SPredicate {
        let pagingAndSorting = new PagingAndSorting(this.pageIndex, this.currentPageSize, this.currentSortBy.getSortBy(), this.currentSortBy.getDir());

        return this.predicateBuider.buildPredicate(this.buildFilters(), pagingAndSorting);
    }

    addNewLock(year: number, month: number, hoursCalculationExecutionRequested: boolean) {
        let body = {
            year: year,
            month: month,
            hoursCalculationExecutionRequested: hoursCalculationExecutionRequested
        }

        return this.datasource.makePostJsonObject(this.backendUrlsSrv.getCreateTaskCompletionLockUrl(), body)
        .pipe(
            map(
              (res: GenericResponse<TaskCompletionsLocksDTO>)=>{
                this.currentLoadedData.unshift(res.data);
              
                return res;
            })
          );
    }

    delete(taskCompletionLock: TaskCompletionsLocksDTO) {
        let params: HttpParams = new HttpParams()
        params = params.append('taskCompletionLockId', taskCompletionLock.id+'');

        return this.datasource.sendDeleteRequest(this.backendUrlsSrv.getDeleteTaskCompletionLockUrl(), params);
    }

    requestHoursCalculationExecution(taskCompletionLock: TaskCompletionsLocksDTO) {
        let params: HttpParams = new HttpParams()
        params = params.append('taskCompletionLockId', taskCompletionLock.id+'');

        return this.datasource.makePutJsonObject(this.backendUrlsSrv.getRequestHoursCalculationCompletionLockUrl(), {}, params);
    }
}