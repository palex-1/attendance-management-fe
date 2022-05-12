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
import { TicketDownloadDTO } from "../../dtos/ticket-download.dto";

const DEFAULT_PAGE_SIZE: number = 5;

@Injectable()
export class ReportsService implements ResetableService {
  
   
  
    public currentSortBy: OrderEvent = new OrderEvent("", "");

    public totalElements: number = 0;
    public totalPages: number = 0;
    public numberOfElements: number = 0;
    public pageIndex: number = 0;
    public currentPageSize: number = DEFAULT_PAGE_SIZE;
    public currentLoadedData: ReportDTO[] = [];

    dataAreLoaded: boolean = false;

    yearFilter: number = null;
    monthFilter: number = null;
    includeDeletedFilter: boolean = false;

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
                    this.loadReportsCall(this.buildQueryPredicate())
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

    realodAllReports(): Observable<any> {
        return this.loadReportsCall(this.buildQueryPredicate());
    }

    private loadReportsCall(predicate: SPredicate): Observable<any> {

        return this.datasource.sendGetRequest<GenericResponse<Page<ReportDTO>>>(
            this.backendUrlsSrv.getFindAllReportsUrl(), predicate.params, true
        ).pipe(
            map(
                (response: GenericResponse<Page<ReportDTO>>) => {
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
        this.predicateBuider.addBooleanQueryParamForFilter("includeDeleted", this.includeDeletedFilter, queryParameters);

        return queryParameters;
    }



    buildQueryPredicate(): SPredicate {
        let pagingAndSorting = new PagingAndSorting(this.pageIndex, this.currentPageSize, this.currentSortBy.getSortBy(), this.currentSortBy.getDir());

        return this.predicateBuider.buildPredicate(this.buildFilters(), pagingAndSorting);
    }

    generateReport(selectedMonth: number, selectedYear: number) {
        let params: HttpParams = new HttpParams()
        params = params.append('month', selectedMonth+'');
        params = params.append('year', selectedYear+'');

        return this.datasource.makePostJsonObject<GenericResponse<ReportDTO>>
        (this.backendUrlsSrv.getCreateReportUrl(), {}, params)
        .pipe(
            map(
              (res: GenericResponse<ReportDTO>)=>{
                this.currentLoadedData.unshift(res.data);
              
                return res;
            })
          );
    }

    deleteReport(report: ReportDTO) {
        let params: HttpParams = new HttpParams()
        params = params.append('reportId', report.id+'');

        return this.datasource.sendDeleteRequest<GenericResponse<ReportDTO>>(this.backendUrlsSrv.getDeleteReportUrl(), params);
    }

    downloadReport(report: ReportDTO) {
        let params: HttpParams = new HttpParams()
        params = params.append('reportId', report.id+'');

        return this.datasource.sendGetRequest<GenericResponse<TicketDownloadDTO>>(this.backendUrlsSrv.getDownloadReportUrl(), params);
    }
}