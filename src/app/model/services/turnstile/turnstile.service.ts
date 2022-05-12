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
import { TurnstileDTO } from '../../dtos/turnstile/turnstile-dto.model';
import { StringUtils } from 'src/app/util/string/string-utils';
import { TicketDownloadDTO } from "../../dtos/ticket-download.dto";

const DEFAULT_PAGE_SIZE: number = 5;

@Injectable()
export class TurnstileService implements ResetableService {
       
  
    public currentSortBy: OrderEvent = new OrderEvent("", "");

    public totalElements: number = 0;
    public totalPages: number = 0;
    public numberOfElements: number = 0;
    public pageIndex: number = 0;
    public currentPageSize: number = DEFAULT_PAGE_SIZE;
    public currentLoadedData: TurnstileDTO[] = [];

    dataAreLoaded: boolean = false;

    titleFilter: string = '';
    positionFilter: string = '';
    descriptionFilter: string = '';
    includeDisabledFilter: boolean = true;

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
        this.titleFilter = '';
        this.positionFilter = '';
        this.descriptionFilter = '';
        this.includeDisabledFilter = true;
    }



    loadInitialInformation(routeParams: Params, forceReload: boolean = false): Observable<boolean> {
        if (this.dataAreLoaded && !forceReload) {//always reload
            return of(true);
        }

        return this.loadTurnstile();
    }

    private loadTurnstile(): Observable<any> {
        return Observable.create(
            (observer) => {
                forkJoin(
                    this.loadTurnstileCall(this.buildQueryPredicate())
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

    realodAllTurnstile(): Observable<any> {
        return this.loadTurnstileCall(this.buildQueryPredicate());
    }

    private loadTurnstileCall(predicate: SPredicate): Observable<any> {

        return this.datasource.sendGetRequest<GenericResponse<Page<TurnstileDTO>>>(
            this.backendUrlsSrv.getFindAllTurnstile(), predicate.params, true
        ).pipe(
            map(
                (response: GenericResponse<Page<TurnstileDTO>>) => {
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
        this.predicateBuider.addStringQueryParamForFilter("title", this.titleFilter, queryParameters);
        this.predicateBuider.addStringQueryParamForFilter("position", this.positionFilter, queryParameters);
        this.predicateBuider.addStringQueryParamForFilter("description", this.descriptionFilter, queryParameters);
        this.predicateBuider.addBooleanQueryParamForFilter("includeDisabled", this.includeDisabledFilter, queryParameters);

        return queryParameters;
    }

    exportAttendance(exportRequest) {
        return this.datasource.makePostJsonObject<GenericResponse<TicketDownloadDTO>>(
                                     this.backendUrlsSrv.getExportDailyAttendance(), exportRequest)
    }

    buildQueryPredicate(): SPredicate {
        let pagingAndSorting = new PagingAndSorting(this.pageIndex, this.currentPageSize, this.currentSortBy.getSortBy(), this.currentSortBy.getDir());

        return this.predicateBuider.buildPredicate(this.buildFilters(), pagingAndSorting);
    }

    addNewTurnstile(title: string, description: string, position: string, enabled: boolean, type: string): Observable<GenericResponse<TurnstileDTO>> {
        let request = {
            title: StringUtils.trim(title),
            description: StringUtils.trim(description),
            position: StringUtils.trim(position),
            deactivated: !enabled,
            type: StringUtils.trim(type),
        };

        return this.datasource.makePostJsonObject<GenericResponse<TurnstileDTO>>(
            this.backendUrlsSrv.getAddTurnstileUrl(), request)
        .pipe(
            map(
              (res: GenericResponse<TurnstileDTO>)=>{
                this.currentLoadedData.unshift(res.data);
              
                return res;
            })
          );

    }


    findTurnstileDetails(currentTurnstileId) {
        let params: HttpParams = new HttpParams()
        params = params.set('turnstileId', currentTurnstileId+'');

        return this.datasource.sendGetRequest<GenericResponse<TurnstileDTO>>
        (this.backendUrlsSrv.findTurnstileDetailsUrl(), params);
    }

    updateTurnstile(request: TurnstileDTO) {
        let params: HttpParams = new HttpParams()

        return this.datasource.makePutJsonObject<GenericResponse<TurnstileDTO>>
        (this.backendUrlsSrv.updateTurnstileUrl(), request, params);
    }


}