import { Injectable } from '@angular/core';
import { WorkTaskSummaryDTO } from '../../dtos/incarico/work-task-summary.model';
import { OrderEvent } from 'src/app/util/order-event.model';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { BackendUrlsService } from '../../backend-urls.service';
import { SPredicateBuilder } from 'src/app/util/querying/s-predicate-builder.service';
import { Router, Params } from '@angular/router';
import { RestDataSource } from '../../rest.datasource';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { PagingAndSorting } from 'src/app/util/querying/paging-and-sorting.model';
import { SPredicate } from 'src/app/util/querying/s-predicate.model';
import { QueryParameter } from 'src/app/util/querying/query-parameter.model';
import { map, catchError } from 'rxjs/operators';
import { GenericResponse } from '../../dtos/generic-response.model';
import { Page } from 'src/app/util/querying/page.model';
import { ResetableService } from '../resetable-service.model';
import { GrantedPermissionsDTO } from '../../dtos/granted-permission.dto';
import { WorkTaskExpensesDTO } from '../../dtos/incarico/work-task-expenses-dto.model';
import { PairDTO } from '../../dtos/pair-dto.model';

const DEFAULT_PAGE_SIZE: number = 5;

@Injectable()
export class WorkTaskExpensesService implements ResetableService {

  dataAreLoaded: boolean = false;
  
  public currentSortBy: OrderEvent = new OrderEvent("", "");
  
  public totalElements: number = 0;
  public totalPages: number = 0;
  public numberOfElements: number = 0;
  public pageIndex: number = 0;
  public currentPageSize: number = DEFAULT_PAGE_SIZE;
  public currentLoadedData: WorkTaskExpensesDTO[] = [];
  public expenseTypesMap = {}

  currentGrantedPermissionOnIncaricoExpenses: GrantedPermissionsDTO = null;

  dateStartFilter: Date = null;
  dateEndFilter: Date = null;
  titleFilter: string = '';
  expenseTypeFilter: string = '';

  currentTaskId: number = null;

  constructor(private exceptionHandler: ChainExceptionHandler,
                private router: Router, private backendUrlsSrv: BackendUrlsService,
                    private datasource: RestDataSource, private predicateBuider: SPredicateBuilder) { 

  }

  reset(): void {
    this.dataAreLoaded = false;
    this.resetFilters();
    this.resetPagingAndData();
  }

  resetFilters(){
    this.dateStartFilter = null;
    this.dateEndFilter = null;
    this.titleFilter = '';
    this.expenseTypeFilter = '';
  }

  resetPagingAndData() {
    this.totalElements = 0;
    this.totalPages = 0;
    this.numberOfElements = 0;
    this.pageIndex = 0;
    this.currentPageSize = DEFAULT_PAGE_SIZE;
    this.currentSortBy = new OrderEvent('', '');
    this.currentLoadedData = [];
    this.expenseTypesMap = {}
  }

  areDataLoaded(): boolean {
    return this.dataAreLoaded;
  }

  onResolveFailure(error: HttpErrorResponse): void {
  }

  loadInitialInformation(routeParams: Params, forceReload : boolean = false): Observable<boolean>{

      let idCommessa: number = routeParams['taskId'];
      this.currentTaskId = idCommessa;
      
      return this.loadAllData();
  }


  loadAllData(): Observable<any>{
    return Observable.create(
        (observer) => {
          forkJoin(
              this.loadCurrentPermissionForTaskExpenses()
            )
            .subscribe(
              (successful) => {
                  this.dataAreLoaded = true;
                  observer.next(true);
                  observer.complete(); 
                },
              (error: HttpErrorResponse) =>{
                  
                  this.dataAreLoaded = false;
                  this.exceptionHandler.manageErrorWithLongChain(error.status);
                  observer.next(false);
                  observer.complete();

                  if(error.status==ChainExceptionHandler.NOT_FOUND){
                      this.router.navigateByUrl('dashboard/taskManage');
                  }
              }
            );
        }
    );
  }

  reloadTaskExpenses(): Observable<any>{
    return this.loadTaskCodeExpenses();
  }

  private loadCurrentPermissionForTaskExpenses(){
    return Observable.create(
        (observer) => {
            this.datasource.sendGetRequest<GenericResponse<GrantedPermissionsDTO>>(
                this.backendUrlsSrv.getTaskExpensesPermissionGrantedUrl(this.currentTaskId+''), new HttpParams(), 
                    true, false, true
            ).subscribe(
                (response)=>{
                        this.currentGrantedPermissionOnIncaricoExpenses = response.data;
                        
                        if(this.currentGrantedPermissionOnIncaricoExpenses!=null && 
                            this.currentGrantedPermissionOnIncaricoExpenses.readPermission){

                              forkJoin(
                                this.reloadTaskExpenses(),
                                this.loadExpensesTypes()
                              ).subscribe(
                                    (succ)=>{
                                        observer.next(true);
                                        observer.complete();
                                        return true;
                                    },
                                    (err)=>{
                                        observer.next(false);
                                        observer.complete();
                                        throwError(err);
                                    }
                                )

                                return false;
                    
                        }else{
                            observer.next(true);
                            observer.complete();
                            return true;
                        }         
                    },
                    (err)=>{
                        if(err.status==ChainExceptionHandler.UNAUTHORIZED || err.status==ChainExceptionHandler.FORBIDDEN){
                            this.router.navigateByUrl('dashboard/taskManage');
                        }

                        observer.next(false);
                        observer.complete();
                        throwError(err);

                        return false;
                    }
                )
            
        }
    );
  }

  loadExpensesTypes(): Observable<any>{
    return this.datasource.sendGetRequest<GenericResponse<PairDTO[]>>
    (this.backendUrlsSrv.getTaskExpensesTypeFindAll(), new HttpParams(), true, false, false)
      .pipe(
        map(
          (res: GenericResponse<PairDTO[]>)=>{
            this.expenseTypesMap = {}

            res.data.forEach( elem => {
              this.expenseTypesMap[elem.key] = elem.value
            })

            //console.log(this.expenseTypesMap)

          }
        ),
        catchError((err) =>  {
          if(err.status==ChainExceptionHandler.UNAUTHORIZED || err.status==ChainExceptionHandler.FORBIDDEN){
            this.router.navigateByUrl('dashboard/taskManage');
          }
          return throwError(err); 
        })
      )
  }

  loadTaskCodeExpenses(): Observable<any> {
    let predicate: SPredicate = this.buildQueryPredicate();

    return this.datasource.sendGetRequest<GenericResponse<Page<WorkTaskExpensesDTO>>>
    (this.backendUrlsSrv.getTaskExpensesFindAll(this.currentTaskId+''), predicate.params, true, 
    false, true)
      .pipe(
        map(
          (res: GenericResponse<Page<WorkTaskExpensesDTO>>)=>{
            this.numberOfElements = res.data.numberOfElements;
            this.totalPages = res.data.totalPages;
            this.totalElements = res.data.totalElements;
            this.currentLoadedData = res.data.content;
          }
        ),
        catchError((err) =>  {
          if(err.status==ChainExceptionHandler.UNAUTHORIZED || err.status==ChainExceptionHandler.FORBIDDEN){
            this.router.navigateByUrl('dashboard/taskManage');
          }
          return throwError(err); 
        })
      )
  }

  findWorkedHoursDetails(taskId: number, predicate: SPredicate) {
    return this.datasource.sendGetRequest<GenericResponse<Page<WorkTaskSummaryDTO>>>
            (this.backendUrlsSrv.buildTaskSummaryDetailsEndpoint(taskId), predicate.params)
  }


  private buildFilters(): QueryParameter[]{
    let queryParameters: QueryParameter[] = [];

    this.predicateBuider.addDateQueryParamForFilter('startDate', this.dateStartFilter, queryParameters);
    this.predicateBuider.addDateQueryParamForFilter('endDate', this.dateEndFilter, queryParameters);
    this.predicateBuider.addStringQueryParamForFilter('title', this.titleFilter, queryParameters);
    this.predicateBuider.addStringQueryParamForFilter('expenseType', this.expenseTypeFilter, queryParameters);

    return queryParameters;
  }

  buildQueryPredicate(): SPredicate {
    let pagingAndSorting = new PagingAndSorting(this.pageIndex, this.currentPageSize, this.currentSortBy.getSortBy(), this.currentSortBy.getDir());
    
    return this.predicateBuider.buildPredicate(this.buildFilters(), pagingAndSorting);
  }



  addNewWorkTaskExpense(addExpenseRequest): Observable<GenericResponse<WorkTaskExpensesDTO>> {
    return this.datasource.makePostJsonObject<GenericResponse<WorkTaskExpensesDTO>>(
                          this.backendUrlsSrv.getTaskExpensesAddUrl(this.currentTaskId+''), addExpenseRequest
                        );
  }

  updateWorkTaskExpense(updateExpenseRequest): Observable<GenericResponse<WorkTaskExpensesDTO>> {
    return this.datasource.makePutJsonObject<GenericResponse<WorkTaskExpensesDTO>>(
                          this.backendUrlsSrv.getTaskExpensesUpdateUrl(this.currentTaskId+''), updateExpenseRequest
                        );
  }

  replaceExpense(expense: WorkTaskExpensesDTO){
    let index = 0;

    for(; index<this.currentLoadedData.length; index++){
      
      if(this.currentLoadedData[index].id===expense.id){
        this.currentLoadedData[index] = expense;
        
        return;
      }
    }
  }

  pushOnTopOfExpenses(expense: WorkTaskExpensesDTO) {
    this.currentLoadedData.unshift(expense);
    this.totalElements = this.totalElements + 1;
  } 

  deleteExpense(expense: WorkTaskExpensesDTO) {
    return this.datasource.sendDeleteRequest(
        this.backendUrlsSrv.getTaskExpensesDeleteUrl(this.currentTaskId+'', expense.id+'')
      )
  }

}
