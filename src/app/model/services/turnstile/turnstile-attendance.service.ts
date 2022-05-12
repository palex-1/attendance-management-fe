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
import { UserAttendanceDTO } from '../../dtos/turnstile/user-attendance-dto.model';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { StringDTO } from '../../dtos/string-dto.model';

const DEFAULT_PAGE_SIZE: number = 10;

@Injectable()
export class TurnstileAttedanceService implements ResetableService {
   
  
    public currentSortBy: OrderEvent = new OrderEvent("", "");

    public totalElements: number = 0;
    public totalPages: number = 0;
    public numberOfElements: number = 0;
    public pageIndex: number = 0;
    public currentPageSize: number = DEFAULT_PAGE_SIZE;
    public currentLoadedData: UserAttendanceDTO[] = [];

    public turnstileDetails: TurnstileDTO = null;

    public companyId: string = '';

    dataAreLoaded: boolean = false;

    dateFromFilter: Date = null;
    dateToFilter: Date = null;
    currentTurnstileId: number = null;

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
        this.dateFromFilter = null;
        this.dateToFilter = null;
    }



    loadInitialInformation(routeParams: Params, forceReload: boolean = false): Observable<boolean> {
        if (this.dataAreLoaded && !forceReload) {//always reload
            return of(true);
        }
        
        this.currentTurnstileId = routeParams['turnstileId'];

        return this.loadTurnstileAttendances();
    }

    private loadTurnstileAttendances(): Observable<any> {
        return Observable.create(
            (observer) => {
                forkJoin(
                    this.loadTurnstileAttendancesCall(this.buildQueryPredicate()),
                    this.loadTurnstileDetails(),
                    this.loadCompanyId()
                )
                    .subscribe(
                        (successful) => {
                            this.dataAreLoaded = true;
                            observer.next(true);
                            observer.complete();
                        },
                        (error: HttpErrorResponse) => {
                            if(error.status==ChainExceptionHandler.NOT_FOUND){
                                this.router.navigateByUrl('dashboard/turnstile')
                            }
                            this.dataAreLoaded = false;
                            this.exceptionHandler.manageErrorWithLongChain(error.status);
                            observer.next(false);
                            observer.complete();
                        }
                    );
            }
        );
    }


    loadCompanyId(): Observable<any> {
        return this.datasource.sendGetRequest<GenericResponse<StringDTO>>
        (this.backendUrlsSrv.getCompanyIdBadgeUrl()).pipe(
            map(
                (succ: GenericResponse<StringDTO>)=>{
                    this.companyId = succ.data.value;
                }
            )
        );
        
    }


    loadTurnstileDetails(): Observable<any> {
        let params: HttpParams = new HttpParams()
        params = params.set('turnstileId', this.currentTurnstileId+'');

        return this.datasource.sendGetRequest<GenericResponse<TurnstileDTO>>(this.backendUrlsSrv.findTurnstileDetailsUrl(), params).pipe(
            map(
                (succ: GenericResponse<TurnstileDTO>)=>{
                    this.turnstileDetails = succ.data;
                }
            )
        );
        
    }

    realodAllTurnstileAttendances(): Observable<any> {
        return this.loadTurnstileAttendancesCall(this.buildQueryPredicate());
    }

    private loadTurnstileAttendancesCall(predicate: SPredicate): Observable<any> {

        return this.datasource.sendGetRequest<GenericResponse<Page<UserAttendanceDTO>>>(
            this.backendUrlsSrv.getLoadAllTurnstileAttendancesUrl(), predicate.params, true
        ).pipe(
            map(
                (response: GenericResponse<Page<UserAttendanceDTO>>) => {
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
        this.predicateBuider.addStringQueryParamForFilter("turnstileId", this.currentTurnstileId+'', queryParameters);
        this.predicateBuider.addDateQueryParamForFilter("startDate", this.dateFromFilter, queryParameters);
        this.predicateBuider.addDateQueryParamForFilter("endDate", this.dateToFilter, queryParameters);

        return queryParameters;
    }



    buildQueryPredicate(): SPredicate {
        let pagingAndSorting = new PagingAndSorting(this.pageIndex, this.currentPageSize, this.currentSortBy.getSortBy(), this.currentSortBy.getDir());

        return this.predicateBuider.buildPredicate(this.buildFilters(), pagingAndSorting);
    }


    delete(attendance: UserAttendanceDTO) {
        let params: HttpParams = new HttpParams()
        params = params.append('attendanceId', attendance.id+'');

        return this.datasource.sendDeleteRequest(this.backendUrlsSrv.deleteUserAttendanceUrl(), params);
    }


    registerNewAttendaceWithSwitchingType(userProfileId: string, turnstileId: number){
        let request = {
            userProfileId: userProfileId,
            turnstileId: turnstileId,
        };

        return this.datasource.makePostJsonObject<GenericResponse<UserAttendanceDTO>>(
            this.backendUrlsSrv.createUserSwitchedAttendanceUrl(), request).pipe(
            map(
                (res: GenericResponse<UserAttendanceDTO>)=>{
                    this.currentLoadedData.unshift(res.data);
              
                    return res;
                }
            )
        )
    }

    registerNewAttendace(userProfileId: string, turnstileId: number, type: string, timestamp?: Date){
        let request = {
            timestamp: timestamp,
            userProfileId: userProfileId,
            turnstileId: turnstileId,
            type: type
        };

        return this.datasource.makePostJsonObject<GenericResponse<UserAttendanceDTO>>(this.backendUrlsSrv.createUserAttendanceUrl(), request).pipe(
            map(
                (res: GenericResponse<UserAttendanceDTO>)=>{
                    this.currentLoadedData.unshift(res.data);
              
                    return res;
                }
            )
        )
    }

}