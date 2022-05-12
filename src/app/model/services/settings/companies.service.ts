import { Injectable } from '@angular/core';
import { ResetableService } from '../resetable-service.model';
import { OrderEvent } from 'src/app/util/order-event.model';
import { RestDataSource } from '../../rest.datasource';
import { BackendUrlsService } from '../../backend-urls.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { SPredicateBuilder } from 'src/app/util/querying/s-predicate-builder.service';
import { HttpErrorResponse, HttpEvent, HttpParams, HttpResponse } from '@angular/common/http';
import { Params } from '@angular/router';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { SPredicate } from 'src/app/util/querying/s-predicate.model';
import { GenericResponse } from '../../dtos/generic-response.model';
import { map, catchError } from 'rxjs/operators';
import { Page } from 'src/app/util/querying/page.model';
import { QueryParameter } from 'src/app/util/querying/query-parameter.model';
import { PagingAndSorting } from 'src/app/util/querying/paging-and-sorting.model';
import { CompanyDTO } from '../../dtos/company/company.dto';

const DEFAULT_PAGE_SIZE: number = 5;

@Injectable()
export class CompaniesService implements ResetableService {
  
  public currentSortBy: OrderEvent = new OrderEvent("", "");

  dataAreLoaded: boolean = false;

  public totalElements: number = 0;
  public totalPages: number = 0;
  public numberOfElements: number = 0;
  public pageIndex: number = 0;
  public currentPageSize: number = DEFAULT_PAGE_SIZE;
  public currentLoadedData: CompanyDTO[] = [];

  public nameFilter: string = '';
  public descriptionFilter: string = '';


  constructor(private datasource: RestDataSource, private backendUrlsSrv: BackendUrlsService,
                private exceptionHandler: ChainExceptionHandler,  private predicateBuider: SPredicateBuilder) { 
  }

  reset(): void {
    this.dataAreLoaded = false;
    this.resetFilters();
    this.resetPagingAndData();
  }

  resetFilters() {
    this.nameFilter = '';
    this.descriptionFilter = '';
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
          this.loadAllCompanies(this.buildQueryPredicate())
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
  
  realodAllCompanies(): Observable<any>{
    return this.loadAllCompanies(this.buildQueryPredicate());
  }


  private loadAllCompanies(predicate: SPredicate): Observable<any>{
    return this.datasource.sendGetRequest<GenericResponse<any>>(
                    this.backendUrlsSrv.getAllCompaniesEndpoint(), predicate.params, true)
    .pipe(
        map((response: GenericResponse<Page<CompanyDTO>>) => {
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
    this.predicateBuider.addStringQueryParamForFilter("name", this.nameFilter, queryParameters);
    this.predicateBuider.addStringQueryParamForFilter("description", this.descriptionFilter, queryParameters);

    return queryParameters;
  }


  addNewCompany(company: CompanyDTO): Observable<GenericResponse<CompanyDTO>>{
    return this.datasource.makePostJsonObject<GenericResponse<CompanyDTO>>(this.backendUrlsSrv.getAddCompanyUrl(), company)
    .pipe(
        map(
          (res: GenericResponse<CompanyDTO>)=>{
            this.currentLoadedData.unshift(res.data);
          
            return res;
        })
      );
  }

  updateCompany(company: CompanyDTO) {
    return this.datasource.makePutJsonObject<GenericResponse<CompanyDTO>>(this.backendUrlsSrv.getUpdateCompanyUrl(), company);
  }

  deleteCompany(company: CompanyDTO) {
    let params: HttpParams = new HttpParams();
    params = params.append('companyId', company.id+'');

    return this.datasource.sendDeleteRequest(this.backendUrlsSrv.getDeleteCompanyUrl(), params)
  }

}
