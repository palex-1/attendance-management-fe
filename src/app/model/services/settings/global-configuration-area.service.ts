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
import { StringDTO } from '../../dtos/string-dto.model';
import { GlobalConfigurationDTO } from '../../dtos/settings/global-configuration-dto.model';

const DEFAULT_PAGE_SIZE: number = 10;

@Injectable()
export class GlobalConfigurationAreaService implements ResetableService { 
  
  public currentSortBy: OrderEvent = new OrderEvent("", "");

  dataAreLoaded: boolean = false;

  public totalElements: number = 0;
  public totalPages: number = 0;
  public numberOfElements: number = 0;
  public pageIndex: number = 0;
  public currentPageSize: number = DEFAULT_PAGE_SIZE;
  public currentLoadedData: StringDTO[] = [];

  public areaFilter: string = '';

  constructor(private datasource: RestDataSource, private backendUrlsSrv: BackendUrlsService,
                private exceptionHandler: ChainExceptionHandler,  private predicateBuider: SPredicateBuilder) { 
  }

  reset(): void {
    this.dataAreLoaded = false;
    this.resetFilters();
    this.resetPagingAndData();
  }

  resetFilters() {
    this.areaFilter = '';
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
          this.loadAllGlobalConfigurations(this.buildQueryPredicate())
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
  
  reloadAllGlobalConfigurations(): Observable<any>{
    return this.loadAllGlobalConfigurations(this.buildQueryPredicate());
  }


  private loadAllGlobalConfigurations(predicate: SPredicate): Observable<any>{
    return this.datasource.sendGetRequest<GenericResponse<any>>(
                    this.backendUrlsSrv.getAllSettingAreaUrl(), predicate.params, true)
    .pipe(
        map((response: GenericResponse<Page<StringDTO>>) => {
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
    this.predicateBuider.addStringQueryParamForFilter("area", this.areaFilter, queryParameters);

    return queryParameters;
  }


  createSetting(area: string, key: string, value: string): Observable<any>{
    let form: GlobalConfigurationDTO = new GlobalConfigurationDTO();
    form.settingArea = area;
    form.settingKey = key;
    form.settingValue = value;

    return this.datasource.makePostJsonObject(this.backendUrlsSrv.getCreateSettingUrl(), form);
  }

  deleteConfigArea(area: string) {
    let params: HttpParams = new HttpParams();
      params = params.append('area', area);
  
      return this.datasource.sendDeleteRequest(this.backendUrlsSrv.getDeleteConfigAreaUrl(), params)
  }



  buildUrlForLogoImageLink() {
    return this.backendUrlsSrv.getUrlForLogoImageLink()
  } 

  updateLogoImage(choosenFile: File): Observable<any>{
      let formData: FormData = new FormData();
      formData.set('image', choosenFile);

      return this.datasource.uploadWithPost(this.backendUrlsSrv.getUrlUpdateLogoImage(), formData);
  }



}
