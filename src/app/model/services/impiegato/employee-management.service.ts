import { Injectable } from "@angular/core";
import { ResetableService } from "../resetable-service.model";
import { Observable, of, forkJoin, throwError } from "rxjs";
import { Params } from "@angular/router";
import { OrderEvent } from "../../../util/order-event.model";
import { SedeDTO } from "../../dtos/sedi/sede-dto.model";
import { RestDataSource } from "../../rest.datasource";
import { ChainExceptionHandler } from "../../../util/exceptions/chain-exception-handler.service";
import { SPredicateBuilder } from "../../../util/querying/s-predicate-builder.service";
import { MessageNotifierService } from "../../../dialogs/notifications/message-notifier.service";
import { SPredicate } from "../../../util/querying/s-predicate.model";
import { PagingAndSorting } from "../../../util/querying/paging-and-sorting.model";
import { QueryParameter } from "../../../util/querying/query-parameter.model";
import { GenericResponse } from "../../dtos/generic-response.model";
import { catchError, map } from "rxjs/operators";
import { StringDTO } from "../../dtos/string-dto.model";
import { HttpHeaders, HttpParams, HttpErrorResponse } from "@angular/common/http";
import { BackendUrlsService } from "../../backend-urls.service";
import { FilterElement, FilterType } from "src/app/dashboard/components/custom-filters/custom-filters.component";
import { UserProfileDTO } from "../../dtos/profile/user-profile.dto";
import { Page } from "src/app/util/querying/page.model";
import { PermissionUserGroupLabel } from "../../dtos/profile/permission-user-group-label.dto";
import { CompanyDTO } from "../../dtos/company/company.dto";
import { UserLevelDTO } from "../../dtos/profile/user-level.dto";

const DEFAULT_PAGE_SIZE: number = 5;

@Injectable()
export class EmployeeManagementService implements ResetableService {
  
    

    dataAreLoaded: boolean = false;

    public currentSortBy: OrderEvent = new OrderEvent("", "");
  
    public totalElements: number = 0;
    public totalPages: number = 0;
    public numberOfElements: number = 0;
    public pageIndex: number = 0;
    public currentPageSize: number = DEFAULT_PAGE_SIZE;
    public currentLoadedUserData: UserProfileDTO[] = [];

    public permissionsUserGroupsLabels: PermissionUserGroupLabel[] = [];
    public companies: CompanyDTO[] = [];
    public levels: UserLevelDTO[] = [];
    public employmentOffices: string[] = [];

    public fiscalCodeFilter: string = '';
    public nameFilter: string = '';
    public surnameFilter: string = '';
    public emailFilter: string = '';
    public phoneNumberFilter: string = '';


    constructor(private datasource: RestDataSource, private backendUlrsSrv: BackendUrlsService,
                  private exceptionHandler: ChainExceptionHandler, private predicateBuider: SPredicateBuilder,
                      private notifier: MessageNotifierService){

    }

    reset(): void{
        this.dataAreLoaded = false;
        this.currentLoadedUserData = [];
        this.permissionsUserGroupsLabels = [];
        this.employmentOffices = [];
        this.levels = [];
        this.resetFilters();
        this.resetPagingAndData();
    }

    resetPagingAndData(){
        this.totalElements = 0;
        this.totalPages = 0;
        this.numberOfElements = 0;
        this.pageIndex = 0;
        this.currentPageSize = DEFAULT_PAGE_SIZE;
        this.companies = [];
        this.currentSortBy = new OrderEvent('', '');
    }

    areDataLoaded(): boolean{
        return this.dataAreLoaded;
    }

    onResolveFailure(error: HttpErrorResponse): void{
    }

    resetFilters(){
        this.fiscalCodeFilter = '';
        this.nameFilter = '';
        this.surnameFilter = '';
        this.emailFilter = '';
        this.phoneNumberFilter = '';
    }

    loadInitialInformation(routeParams: Params, forceReload : boolean = false): Observable<boolean>{
        if(this.dataAreLoaded && !forceReload){
            return of(true);
          }
          return Observable.create(
              (observer) => {
                forkJoin(
                  this.loadAllEmployees(),
                  this.buildUserGroupType(),
                  this.loadAllCompanies(),
                  this.loadAllUserLevels(),
                  this.loadAllEmploymentOffices()
                  )
                  .subscribe(
                    (successful) => {
                        this.dataAreLoaded = true;
                        observer.next(true);
                        observer.complete(); 
                      },
                    error =>{
                        
                        this.dataAreLoaded = false;
                        this.exceptionHandler.manageErrorWithLongChain(error.status);
                        observer.next(false);
                        observer.complete();
                    }
                  );
              }
          );
    }

    loadAllEmploymentOffices(): Observable<any>{
        return this.datasource.sendGetRequest<GenericResponse<any>>(this.backendUlrsSrv.getFindAllEmploymentOfficeUrl(), null, true)
        .pipe(
            map(
                (res: GenericResponse<StringDTO[]>)=>{
                    this.employmentOffices = [];

                    for(let i=0; i<res.data.length; i++){
                        this.employmentOffices.push(res.data[i].value);
                    }
                }
            )
        );
    }

    loadAllEmployees(): Observable<any>{
        return this.getAllEmployee(this.buildQueryPredicate());
    }
    
    private buildFilters(): QueryParameter[]{
        let queryParameters: QueryParameter[] = [];
        this.predicateBuider.addStringQueryParamForFilter("cf", this.fiscalCodeFilter, queryParameters);
        this.predicateBuider.addStringQueryParamForFilter("name", this.nameFilter, queryParameters);
        this.predicateBuider.addStringQueryParamForFilter("surname", this.surnameFilter, queryParameters);
        this.predicateBuider.addStringQueryParamForFilter("email", this.emailFilter, queryParameters);
        this.predicateBuider.addStringQueryParamForFilter("phoneNumber", this.phoneNumberFilter, queryParameters);
        
        return queryParameters;
    }

    buildUserGroupType(): Observable<any>{
        
        return this.datasource.sendGetRequest<GenericResponse<any>>(this.backendUlrsSrv.getAllPermissionUserGroup(), null, true)
        .pipe(
            map(
                (res: GenericResponse<PermissionUserGroupLabel[]>)=>{
                    this.permissionsUserGroupsLabels = res.data;
                }
            )
        );
    }

    loadAllCompanies(): Observable<any>{
        
        return this.datasource.sendGetRequest<GenericResponse<any>>(this.backendUlrsSrv.getAllCompanies(), null, true)
        .pipe(
            map(
                (res: GenericResponse<CompanyDTO[]>)=>{
                    this.companies = res.data;
                }
            )
        );
    }

    loadAllUserLevels(): Observable<any>{
        
        return this.datasource.sendGetRequest<GenericResponse<any>>(this.backendUlrsSrv.getAllUserLevels(), null, true)
        .pipe(
            map(
                (res: GenericResponse<UserLevelDTO[]>)=>{
                    this.levels = res.data;
                }
            )
        );
    }
 
    
    private getAllEmployee(predicate: SPredicate): Observable<any>{
        return this.datasource.sendGetRequest<GenericResponse<Page<UserProfileDTO>>>(this.backendUlrsSrv.getAllUsers(), predicate.params, true)
        .pipe(
            map((response: GenericResponse<Page<SedeDTO>>) => {
              this.numberOfElements = response.data.numberOfElements;
              this.totalPages = response.data.totalPages;
              this.totalElements = response.data.totalElements;
              this.currentLoadedUserData = response.data.content;
              return true;
            }),
            catchError((err) =>  {
              return throwError(err); 
            })
          );
        
    }

    sendAddNewEmployee(form): Observable<GenericResponse<UserProfileDTO>> {
        return this.datasource.makePostJsonObject<GenericResponse<UserProfileDTO>>(this.backendUlrsSrv.inviteUserProfile(), form);
    }

    buildQueryPredicate(): SPredicate {
        let pagingAndSorting = new PagingAndSorting(this.pageIndex, this.currentPageSize, this.currentSortBy.getSortBy(), this.currentSortBy.getDir());
        
        return this.predicateBuider.buildPredicate(this.buildFilters(), pagingAndSorting);
    }

    pushOnTopEmployees(profile: UserProfileDTO): void{
        this.currentLoadedUserData.unshift(profile);
        this.totalElements = this.totalElements + 1;
    }



    sendDisableUserAccount(user: UserProfileDTO) : Observable<GenericResponse<UserProfileDTO>>{
        let params: HttpParams = new HttpParams();
        params = params.append('userProfileId', user.id+'');

        return this.datasource.makePutJsonObject(this.backendUlrsSrv.disableAccountEndpoint(), {}, params);
    }
    sendEnableUserAccount(user: UserProfileDTO): Observable<GenericResponse<UserProfileDTO>>{
        let params: HttpParams = new HttpParams();
        params = params.append('userProfileId', user.id+'');

        return this.datasource.makePutJsonObject(this.backendUlrsSrv.enableAccountEndpoint(), {}, params);
    }
}