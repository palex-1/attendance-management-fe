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
import { ExpenseReportDTO } from '../../dtos/expenses/expense-report-dto.model';
import { DateUtils } from 'src/app/util/dates/date-utils';

const DEFAULT_PAGE_SIZE: number = 5;

@Injectable()
export class MyExpenseReportsService implements ResetableService {
  
    public currentSortBy: OrderEvent = new OrderEvent("", "");

    public totalElements: number = 0;
    public totalPages: number = 0;
    public numberOfElements: number = 0;
    public pageIndex: number = 0;
    public currentPageSize: number = DEFAULT_PAGE_SIZE;
    public currentLoadedData: ExpenseReportDTO[] = [];

    dataAreLoaded: boolean = false;

    statusFilter: string = null;
    locationFilter: string = null;
    titleFilter: string = null;
    dateFromFilter: Date = null;
    dateToFilter: Date = null;

    constructor(private exceptionHandler: ChainExceptionHandler, private router: Router, private backendUrlsSrv: BackendUrlsService,
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
        this.titleFilter = null;
        this.locationFilter = null;
        this.statusFilter = null;
        this.dateFromFilter = null;
        this.dateToFilter = null;
    }



    loadInitialInformation(routeParams: Params, forceReload: boolean = false): Observable<boolean> {
        if (this.dataAreLoaded && !forceReload) {//always reload
            return of(true);
        }

        return this.loadReports();
    }

    private loadReports(): Observable<any> {
        return Observable.create(
            (observer) => {
                forkJoin(
                    this.loadMyExpenseReportsCall(this.buildQueryPredicate())
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

    realodAllMyExpenseReports(): Observable<any> {
        return this.loadMyExpenseReportsCall(this.buildQueryPredicate());
    }

    private loadMyExpenseReportsCall(predicate: SPredicate): Observable<any> {

        return this.datasource.sendGetRequest<GenericResponse<Page<ExpenseReportDTO>>>(
            this.backendUrlsSrv.getFindAllMyExpenseReportsUrl(), predicate.params, true
        ).pipe(
            map(
                (response: GenericResponse<Page<ExpenseReportDTO>>) => {
                    this.numberOfElements = response.data.numberOfElements;
                    this.totalPages = response.data.totalPages;
                    this.totalElements = response.data.totalElements;

                    this.currentLoadedData = response.data.content;

                    for(let i=0; i<this.currentLoadedData.length; i++){
                        if(this.currentLoadedData[i].dateOfExpence!=null){
                          this.currentLoadedData[i].dateOfExpence = DateUtils.buildDateFromStrOrDate(this.currentLoadedData[i].dateOfExpence);
                        }
                      }

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
        this.predicateBuider.addDateQueryParamForFilter("dateOfExpenceFrom", this.dateFromFilter, queryParameters);
        this.predicateBuider.addDateQueryParamForFilter("dateOfExpenceTo", this.dateToFilter, queryParameters);
        this.predicateBuider.addStringQueryParamForFilter("status", this.statusFilter, queryParameters);
        this.predicateBuider.addStringQueryParamForFilter("location", this.locationFilter, queryParameters);
        this.predicateBuider.addStringQueryParamForFilter("title", this.titleFilter, queryParameters);

        return queryParameters;
    }



    buildQueryPredicate(): SPredicate {
        let pagingAndSorting = new PagingAndSorting(this.pageIndex, this.currentPageSize, this.currentSortBy.getSortBy(), this.currentSortBy.getDir());

        return this.predicateBuider.buildPredicate(this.buildFilters(), pagingAndSorting);
    }


    deleteExpenseReport(elem: ExpenseReportDTO) {
        let params: HttpParams = new HttpParams();
        params = params.append('reportId', elem.id+'');

        return this.datasource.sendDeleteRequest(this.backendUrlsSrv.getDeleteExpenseReportUrl(), params);
    }

}