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
import { Page } from "src/app/util/querying/page.model";

const DEFAULT_PAGE_SIZE: number = 5;

@Injectable()
export class SediLavorativeService implements ResetableService {

    dataAreLoaded: boolean = false;

    public currentSortBy: OrderEvent = new OrderEvent("", "");
  
    public totalElements: number = 0;
    public totalPages: number = 0;
    public numberOfElements: number = 0;
    public pageIndex: number = 0;
    public currentPageSize: number = DEFAULT_PAGE_SIZE;
    public currentLoadedSede: SedeDTO[] = [];
    public tipoSedi: string[] = [];

    private filtersInizialized: boolean = false;
    sediLavorativeFilters: FilterElement[] = [];

    nazioneSedeFilter :FilterElement = {
        id: 'nazioneCUSTOMIZED', i18nKeyLabel: 'gestione-sedi-lavorative.nation', name: 'SediLavorativeService.nazioneCUSTOMIZED',
        value: null, type: FilterType.TEXT
    }
    tipoSedeFilter :FilterElement = {
        id: 'companyBranchType', i18nKeyLabel: 'gestione-sedi-lavorative.sede-type', name: 'SediLavorativeService.companyBranchType',
        value: null, type: FilterType.SELECT
    }

    officeNameSedeFilter:FilterElement = {
        id: 'nomeSedeCUSTOMIZED', i18nKeyLabel: 'gestione-sedi-lavorative.name-office', name: 'SediLavorativeService.nomeSedeCUSTOMIZED',
        value: null, type: FilterType.TEXT
    }
    streetSedeFilter:FilterElement = {
        id: 'viaCUSTOMIZED', i18nKeyLabel: 'gestione-sedi-lavorative.street', name: 'SediLavorativeService.viaCUSTOMIZED',
        value: null, type: FilterType.TEXT
    }
    citySedeFilter:FilterElement = {
        id: 'cittaCUSTOMIZED', i18nKeyLabel: 'gestione-sedi-lavorative.city', name: 'SediLavorativeService.cittaCUSTOMIZED',
        value: null, type: FilterType.TEXT
    }
    provinceSedeFilter:FilterElement = {
        id: 'provinciaCUSTOMIZED', i18nKeyLabel: 'gestione-sedi-lavorative.province', name: 'SediLavorativeService.provinciaCUSTOMIZED',
        value: null, type: FilterType.TEXT
    }

    
    constructor(private datasource: RestDataSource, private backendUlrsSrv: BackendUrlsService,
                  private exceptionHandler: ChainExceptionHandler,
                    private predicateBuider: SPredicateBuilder,
                      private notifier: MessageNotifierService){

                      }

    reset(): void{
        this.dataAreLoaded = false;
        this.resetFilters();
        this.resetPagingAndData();
    }

    resetPagingAndData(){
        this.totalElements = 0;
        this.totalPages = 0;
        this.numberOfElements = 0;
        this.pageIndex = 0;
        this.currentPageSize = DEFAULT_PAGE_SIZE;
        this.currentLoadedSede = [];
        this.currentSortBy = new OrderEvent('', '');
    }

      
    areDataLoaded(): boolean{
        return this.dataAreLoaded;
    }

    onResolveFailure(error: HttpErrorResponse): void{
    }

    resetFilters(){
        this.filtersInizialized = false;
        this.sediLavorativeFilters = [];
        this.nazioneSedeFilter.value = null;
        this.tipoSedeFilter.value = null;
        this.officeNameSedeFilter.value = null;
        this.streetSedeFilter.value = null;
        this.citySedeFilter.value = null;
        this.provinceSedeFilter.value = null;
    }
ì
    initializeFilters(){
        this.filtersInizialized = false;
        this.sediLavorativeFilters = [];
        this.nazioneSedeFilter.value = null;
        this.tipoSedeFilter.value = null;
        this.officeNameSedeFilter.value = null;
        this.streetSedeFilter.value = null;
        this.citySedeFilter.value = null;
        this.provinceSedeFilter.value = null;

        this.sediLavorativeFilters.push(
            this.officeNameSedeFilter, this.streetSedeFilter, this.citySedeFilter, 
            this.provinceSedeFilter, this.nazioneSedeFilter, this.tipoSedeFilter
            );
        this.filtersInizialized = true;
    }


    loadInitialInformation(routeParams: Params, forceReload : boolean = false): Observable<boolean>{
        if(!this.filtersInizialized){
            this.initializeFilters();
        }
        if(this.dataAreLoaded && !forceReload){
            return of(true);
          }
          return Observable.create(
              (observer) => {
                forkJoin(
                  this.loadSedi(),
                  this.getTipoSedi()
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

    

    loadSedi(): Observable<any>{
        return this.getSedi(this.buildQueryPredicate());
    }
    

    private buildFilters(): QueryParameter[]{
        let queryParameters: QueryParameter[] = [];
        this.addQueryParamForFilter(this.nazioneSedeFilter, queryParameters);
        this.addQueryParamForFilter(this.tipoSedeFilter, queryParameters);
        this.addQueryParamForFilter(this.officeNameSedeFilter, queryParameters);
        this.addQueryParamForFilter(this.streetSedeFilter, queryParameters);
        this.addQueryParamForFilter(this.citySedeFilter, queryParameters);
        this.addQueryParamForFilter(this.provinceSedeFilter, queryParameters);

        return queryParameters;
    }

    addQueryParamForFilter(elem: FilterElement, queryParameters: QueryParameter[]){
        if(elem!=null && elem.value!=null && elem.value.trim()!=''){
            let descrizioneIncarico: QueryParameter = new QueryParameter(elem.id, elem.value);
            queryParameters.push(descrizioneIncarico);
        }
    }

    private getTipoSedi(): Observable<any>{
        
        return this.datasource.sendGetRequest<GenericResponse<any>>(this.backendUlrsSrv.getSediLavorativeTipoSediUrl(), null, true).pipe(
            map(
                (res: GenericResponse<StringDTO[]> )=>{
                    this.tipoSedi = [];
                    this.tipoSedeFilter.options = [];
                    this.tipoSedeFilter.options.push(
                        { id: '', label: '' }
                    );
                    if(res!=null && res.data!=null){
                        let sedi: StringDTO[] = res.data;
                        for(let i=0; i<sedi.length; i++){
                            this.tipoSedeFilter.options.push(
                                { id: sedi[i].value, label: sedi[i].value }
                            );
                            this.tipoSedi.push(sedi[i].value);
                        }
                    }
                }
            )
        );
    }

    private getSedi(predicate: SPredicate): Observable<any>{
        let funToCall;
        if(predicate!=null){
          funToCall = this.datasource.sendGetRequest<GenericResponse<any>>(this.backendUlrsSrv.getSediLavorativeUrl(), predicate.params, true);
        }else{
          funToCall = this.datasource.sendGetRequest<GenericResponse<any>>(this.backendUlrsSrv.getSediLavorativeUrl(), null, true);
        }
        return funToCall.pipe(
            map((response: GenericResponse<Page<SedeDTO>>) => {
              this.numberOfElements = response.data.numberOfElements;
              this.totalPages = response.data.totalPages;
              this.totalElements = response.data.totalElements;
              this.currentLoadedSede = response.data.content;
              return true;
            }),
            catchError((err) =>  {
              return throwError(err); 
            })
          );
        
    }

    sendAddNewIncaricoRequest(sede: SedeDTO): Observable<any>{
        return this.datasource.makePostJsonObject<GenericResponse<any>>(this.backendUlrsSrv.getSediLavorativeUrl(), sede, new HttpParams(), new HttpHeaders(), true)
        .pipe(
            map( (response: GenericResponse<SedeDTO>) =>{
                let added: SedeDTO = response.data;
                this.pushOnTopIncarico(added);
                return response;
            }),
            catchError((err) =>  {
              return throwError(err); 
            })
        );
    }

    updateSede(sede: SedeDTO): Observable<any>{
        return this.datasource.makePutJsonObject<GenericResponse<any>>(this.backendUlrsSrv.getSediLavorativeUrl(), sede, new HttpParams(), new HttpHeaders(), true)
        .pipe(
          map((response: GenericResponse<SedeDTO>) =>{
                let updated: SedeDTO = response.data;
                let found: boolean = false;
                for(let i=0; i<this.currentLoadedSede.length && !found; i++){
                    if(updated.id==this.currentLoadedSede[i].id){
                        this.currentLoadedSede[i] = updated;
                        found = true;
                    }
                }
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

    pushOnTopIncarico(sede: SedeDTO): void{
        this.currentLoadedSede.unshift(sede);
        this.totalElements = this.totalElements + 1;
    }
}