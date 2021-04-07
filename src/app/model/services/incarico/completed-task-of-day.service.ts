import { Injectable } from '@angular/core';
import { ResetableService } from '../resetable-service.model';
import { OrderEvent } from 'src/app/util/order-event.model';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { Params } from '@angular/router';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { RestDataSource } from '../../rest.datasource';
import { BackendUrlsService } from '../../backend-urls.service';
import { SPredicateBuilder } from 'src/app/util/querying/s-predicate-builder.service';
import { QueryParameter } from 'src/app/util/querying/query-parameter.model';
import { SPredicate } from 'src/app/util/querying/s-predicate.model';
import { PagingAndSorting } from 'src/app/util/querying/paging-and-sorting.model';
import { CompletedTaskDTO } from '../../dtos/incarico/completed-task.dto';
import { GenericResponse } from '../../dtos/generic-response.model';
import { catchError, map } from 'rxjs/operators';
import { Page } from 'src/app/util/querying/page.model';
import { StringDTO } from '../../dtos/string-dto.model';
import { SpecialTaskConfigDTO } from '../../dtos/incarico/special-task-config.model';
import { DateUtils } from 'src/app/util/dates/date-utils';
import { UserProfileContractDTO } from '../../dtos/impiegato/user-profile-contract-dto.model';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { FoodVoucherRequestDTO } from '../../dtos/incarico/food-voucher-request.model';
import { BooleanDTO } from '../../dtos/boolean-dto.model';
import { WorkTransferRequestDTO } from '../../dtos/incarico/work-transfer-request-dto.model';

const DEFAULT_PAGE_SIZE: number = 3;

@Injectable()
export class CompletedTaskOfDayService implements ResetableService {

  dataAreLoaded: boolean = false;

  public currentSortBy: OrderEvent = new OrderEvent("", "");

  public totalElements: number = 0;
  public totalPages: number = 0;
  public numberOfElements: number = 0;
  public pageIndex: number = 0;
  public currentPageSize: number = DEFAULT_PAGE_SIZE;
  public currentLoadedTasks: CompletedTaskDTO[] = [];
  public completedTaskOfMonth: CompletedTaskDTO[] = [];
  public specialTasksConfig: SpecialTaskConfigDTO[] = [];

  public currentSelectedDay = new Date;
  public userProfileContract: UserProfileContractDTO = new UserProfileContractDTO();

  currentFoodVoucherRequest: FoodVoucherRequestDTO = null;
  public foodVoucherAreEnabled: boolean = false;

  currentWorkTransferRequest: WorkTransferRequestDTO = null;



  constructor(private exceptionHandler: ChainExceptionHandler, private predicateBuider: SPredicateBuilder,
                private datasource: RestDataSource, private backendUrlsSrv: BackendUrlsService,
                  private notifier: MessageNotifierService) {

  }


  reset(): void {
    this.dataAreLoaded = false;
    this.currentLoadedTasks = [];
    this.resetFilters();
    this.resetPagingAndData();
  }

  resetPagingAndData() {
    this.totalElements = 0;
    this.totalPages = 0;
    this.numberOfElements = 0;
    this.pageIndex = 0;
    this.currentPageSize = DEFAULT_PAGE_SIZE;
    this.currentSortBy = new OrderEvent('', '');
    this.currentFoodVoucherRequest = null;
  }

  areDataLoaded(): boolean {
    return this.dataAreLoaded;
  }

  onResolveFailure(error: HttpErrorResponse): void {
  }

  resetFilters() {
  }


  loadInitialInformation(routeParams: Params, forceReload: boolean = false): Observable<boolean> {
    if (this.dataAreLoaded && !forceReload) {
      return of(true);
    }
    let parkDate = new Date();
    this.currentSelectedDay = new Date(Date.UTC(parkDate.getUTCFullYear(), parkDate.getUTCMonth(), parkDate.getUTCDate()))

    return Observable.create(
      (observer) => {
        forkJoin(
          this.loadAllCompletedTasksOfDay(this.buildQueryPredicate()),
          this.loadAllCompletedTasksOfMonth(),
          this.loadSpecialTaskConfig(),
          this.loadUserContractInfo(),
          this.loadFoodVoucherRequestOfSelectedDay(),
          this.checkIfFoodVoucherAreEnabled(),
          this.loadWorkTransferRequestOfSelectedDay()
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

  reloadAllCompletedTasksOfMonth(): Observable<any>{
    return forkJoin(
        this.loadAllCompletedTasksOfDay(this.buildQueryPredicate()),
        this.loadAllCompletedTasksOfMonth(),
        this.loadFoodVoucherRequestOfSelectedDay(),
        this.loadWorkTransferRequestOfSelectedDay()
      );
  }

  reloadAllCompletedTasksOfDay(){
    return forkJoin(
        this.loadAllCompletedTasksOfDay(this.buildQueryPredicate()),
        this.loadFoodVoucherRequestOfSelectedDay(),
        this.loadWorkTransferRequestOfSelectedDay()
      );
  }


  private checkIfFoodVoucherAreEnabled(){
    return this.datasource.sendGetRequest<GenericResponse<any>>(
      this.backendUrlsSrv.getCheckIfFoodVoucherAreEnabledEndpoint()).pipe(
        map((response: GenericResponse<BooleanDTO>) => {
          this.foodVoucherAreEnabled = response.data.value;

          return true;
      }),
      catchError((err) =>  {
        return throwError(err); 
      })
    );
  }

  private loadAllCompletedTasksOfMonth(): Observable<any>{
    let params = new HttpParams();
    params = params.append('month', this.currentSelectedDay.getUTCMonth()+'');
    params = params.append('year', this.currentSelectedDay.getUTCFullYear()+'');

    return this.datasource.sendGetRequest<GenericResponse<any>>(
      this.backendUrlsSrv.getFindCompletedTaskOfMonthEndpoint(), params, true)
        .pipe(
            map((response: GenericResponse<CompletedTaskDTO[]>) => {
              this.completedTaskOfMonth = response.data;

              for(let i=0; i<this.completedTaskOfMonth.length; i++){
                this.completedTaskOfMonth[i].day = DateUtils.buildDateFromStrOrDate(this.completedTaskOfMonth[i].day);
              }

              return true;
          }),
          catchError((err) =>  {
            return throwError(err); 
          })
        );
  }

  private loadSpecialTaskConfig(): Observable<any>{
    let params = new HttpParams();

    return this.datasource.sendGetRequest<GenericResponse<any>>(
      this.backendUrlsSrv.getFindSpecialTasksEndpoint(), params, true)
        .pipe(
            map((response: GenericResponse<SpecialTaskConfigDTO[]>) => {
              this.specialTasksConfig = response.data;
              
              this.specialTasksConfig.sort((a,b)=>{
                return a.name.localeCompare(b.name)
              })

              return true;
          }),
          catchError((err) =>  {
            return throwError(err); 
          })
        );
  }

  
  private loadUserContractInfo(): Observable<any>{
    return this.datasource.sendGetRequest<GenericResponse<any>>(
      this.backendUrlsSrv.getUserContractInfoEndpoint(), new HttpParams(), true)
        .pipe(
            map((response: GenericResponse<UserProfileContractDTO>) => {
              this.userProfileContract = null;

              if(response.data==null){
                this.notifier.notifyWarningWithI18nAndStandardTitle("message.contract-data-missing-in-planner");
              }else{
                this.userProfileContract = response.data;
                if(this.userProfileContract.hiringDate!=null){
                  this.userProfileContract.hiringDate = DateUtils.buildDateFromStrOrDate(this.userProfileContract.hiringDate);
                }
              }
              
              return true;
          }),
          catchError((err) =>  {
            return throwError(err); 
          })
        );
  }

  private loadAllCompletedTasksOfDay(predicate: SPredicate): Observable<any> {

    return this.datasource.sendGetRequest<GenericResponse<any>>(
      this.backendUrlsSrv.getMyCompletedTaskOfDayEndpoint(), predicate.params, true)
        .pipe(
            map((response: GenericResponse<Page<CompletedTaskDTO>>) => {
              this.numberOfElements = response.data.numberOfElements;
              this.totalPages = response.data.totalPages;
              this.totalElements = response.data.totalElements;
              this.currentLoadedTasks = response.data.content;

              return true;
          }),
          catchError((err) =>  {
            return throwError(err); 
          })
        );
  }

  loadFoodVoucherRequestOfSelectedDay(){
    let queryParameters: QueryParameter[] = [];

    if(this.currentSelectedDay!=null){
      this.predicateBuider.addDateQueryParamForFilter("day", this.currentSelectedDay, queryParameters);
    }
    let predicate: SPredicate = this.predicateBuider.buildPredicate(queryParameters, null);

    return this.datasource.sendGetRequest<GenericResponse<any>>(
      this.backendUrlsSrv.getFindMyFoodVoucherRequest(), predicate.params, true)
        .pipe(
            map((response: GenericResponse<FoodVoucherRequestDTO>) => {
              this.currentFoodVoucherRequest = response.data;

              return response;
          }),
          catchError((err) =>  {
            return throwError(err); 
          })
        );
  }


  loadWorkTransferRequestOfSelectedDay(){
    let queryParameters: QueryParameter[] = [];

    if(this.currentSelectedDay!=null){
      this.predicateBuider.addDateQueryParamForFilter("day", this.currentSelectedDay, queryParameters);
    }
    let predicate: SPredicate = this.predicateBuider.buildPredicate(queryParameters, null);

    return this.datasource.sendGetRequest<GenericResponse<any>>(
      this.backendUrlsSrv.getFindWorkTransferRequestUrl(), predicate.params, true)
        .pipe(
            map((response: GenericResponse<WorkTransferRequestDTO>) => {
              this.currentWorkTransferRequest = response.data;

              return response;
          }),
          catchError((err) =>  {
            return throwError(err); 
          })
        );

  }


  deleteWorkTransferRequest(){
    let params: HttpParams = new HttpParams();
    params = params.append("workTransferReqId", this.currentWorkTransferRequest.id+'');

    return this.datasource.sendDeleteRequest<GenericResponse<StringDTO>>(
            this.backendUrlsSrv.getDeleteMyWorkTransferRequest(), params).pipe(
              map((response: GenericResponse<StringDTO>) => {
                this.currentWorkTransferRequest = null;

                return response;
            }),
            catchError((err) =>  {
              return throwError(err); 
            })
          );
  }

  addOrUpdateWorkTransferRequest(type: string){
    let form = {
      day: this.currentSelectedDay.toISOString(),
      type: type
    }

    return this.datasource.makePostJsonObject<GenericResponse<WorkTransferRequestDTO>>(
            this.backendUrlsSrv.getCreateOrUpdateMyWorkTransferRequest(), form).pipe(
              map((response: GenericResponse<WorkTransferRequestDTO>) => {
                this.currentWorkTransferRequest = response.data;
                
                return response;
            }),
            catchError((err) =>  {
              return throwError(err); 
            })
          );
  }

  deleteFoodVoucherRequest(){
    let params: HttpParams = new HttpParams();
    params = params.append("foodVoucherId", this.currentFoodVoucherRequest.id+'');

    return this.datasource.sendDeleteRequest<GenericResponse<StringDTO>>(
            this.backendUrlsSrv.getDeleteMyFoodVoucherRequest(), params).pipe(
              map((response: GenericResponse<StringDTO>) => {
                this.currentFoodVoucherRequest = null;

                return response;
            }),
            catchError((err) =>  {
              return throwError(err); 
            })
          );
  }

  addFoodVoucherRequest(){
    let form = {
      day: this.currentSelectedDay.toISOString()
    }

    return this.datasource.makePostJsonObject<GenericResponse<FoodVoucherRequestDTO>>(
            this.backendUrlsSrv.getCreateMyFoodVoucherRequest(), form).pipe(
              map((response: GenericResponse<FoodVoucherRequestDTO>) => {
                this.currentFoodVoucherRequest = response.data;
                
                return response;
            }),
            catchError((err) =>  {
              return throwError(err); 
            })
          );
  }


  deleteCompletedTask(task: CompletedTaskDTO): Observable<GenericResponse<StringDTO>> {
    let params: HttpParams = new HttpParams();
    params = params.append("completedTaskId", task.id+'');

    return this.datasource.sendDeleteRequest<GenericResponse<StringDTO>>(
            this.backendUrlsSrv.getDeleteMyTaskEndpoint(), params);
  }

  addNewWorkedTask(taskCodeToAdd: string, currentTaskToAddSmartWorked: boolean, totalHoursTaskToAdd: number, 
          currentSelectedDay: Date): Observable<GenericResponse<CompletedTaskDTO>>{
    let form = {
      workedHours: totalHoursTaskToAdd,
      day: currentSelectedDay,
      smartworked: currentTaskToAddSmartWorked,
      taskCode: taskCodeToAdd
    }

    return this.datasource.makePostJsonObject<GenericResponse<CompletedTaskDTO>>(
                  this.backendUrlsSrv.getAddNewMyTaskEndpoint(), form)
                .pipe(
                    map( (response: GenericResponse<CompletedTaskDTO>) =>{
                        let added: CompletedTaskDTO = response.data;
                        this.pushOnTopCompletedTaskDTO(added);

                        return response;
                    }),
                    catchError((err) =>  {
                      return throwError(err); 
                    })
                );
  }

  pushOnTopCompletedTaskDTO(task: CompletedTaskDTO): void{
    this.currentLoadedTasks.unshift(task);
    this.totalElements = this.totalElements + 1;
}


  private buildFilters(): QueryParameter[] {
    let queryParameters: QueryParameter[] = [];

    if(this.currentSelectedDay!=null){
      this.predicateBuider.addDateQueryParamForFilter("day", this.currentSelectedDay, queryParameters);
    }

    return queryParameters;
  }

  buildQueryPredicate(): SPredicate {
    let pagingAndSorting = new PagingAndSorting(this.pageIndex, this.currentPageSize, this.currentSortBy.getSortBy(), this.currentSortBy.getDir());

    return this.predicateBuider.buildPredicate(this.buildFilters(), pagingAndSorting);
  }

}
