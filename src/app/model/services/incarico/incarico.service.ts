import { Injectable } from "@angular/core";
import { ResetableService } from "../resetable-service.model";
import { RestDataSource } from "../../rest.datasource";
import { ChainExceptionHandler } from "../../../util/exceptions/chain-exception-handler.service";
import { SPredicateBuilder } from "../../../util/querying/s-predicate-builder.service";
import { Observable, of, forkJoin, throwError } from "rxjs";
import { Params } from "@angular/router";
import { MessageNotifierService } from "../../../dialogs/notifications/message-notifier.service";
import { HttpParams, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { OrderEvent } from "../../../util/order-event.model";
import { GenericResponse } from "../../dtos/generic-response.model";
import { PagingAndSorting } from "../../../util/querying/paging-and-sorting.model";
import { SPredicate } from "../../../util/querying/s-predicate.model";
import { QueryParameter } from "../../../util/querying/query-parameter.model";
import { map, catchError } from "rxjs/operators";
import { BackendUrlsService } from "../../backend-urls.service";
import { FilterElement, FilterType } from "src/app/dashboard/components/custom-filters/custom-filters.component";
import { Page } from "src/app/util/querying/page.model";
import { WorkTaskDTO } from '../../dtos/incarico/work-task-dto.model';

const DEFAULT_PAGE_SIZE: number = 5;

@Injectable()
export class IncaricoService implements ResetableService{
    
    dataAreLoaded: boolean = false;
    addRemoveOperationInProgress: boolean = false;

    public currentSortBy: OrderEvent = new OrderEvent("", "");
  
    public totalElements: number = 0;
    public totalPages: number = 0;
    public numberOfElements: number = 0;
    public pageIndex: number = 0;
    public currentPageSize: number = DEFAULT_PAGE_SIZE;
    public currentLoadedCommesse: WorkTaskDTO[] = [];

   private filtersInizialized: boolean = false;

   gestioneCommessaFilters: FilterElement[] = [];

   descrizioneIncaricoFilter :FilterElement = {
        id: 'descrizioneIncaricoCUSTOMIZED', i18nKeyLabel: 'label.descrizione-commessa', name: 'IncaricoService.descrizioneIncaricoCUSTOMIZED',
        value: null, type: FilterType.TEXT
   }

   codiceIncaricoFilter :FilterElement = {
        id: 'codiceIncaricoCUSTOMIZED', i18nKeyLabel: 'label.codice-commessa', name: 'IncaricoService.codiceIncaricoCUSTOMIZED',
        value: null, type: FilterType.TEXT
   }

    constructor(private datasource: RestDataSource, private backendUrlsSrv: BackendUrlsService,
                  private exceptionHandler: ChainExceptionHandler,
                    private predicateBuider: SPredicateBuilder,
                        private notifier: MessageNotifierService) { 
          
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
        this.currentLoadedCommesse = [];
        this.currentSortBy = new OrderEvent('', '');
    }

    areDataLoaded(): boolean{
        return this.dataAreLoaded;
    }

    onResolveFailure(error: HttpErrorResponse): void{
    }

    resetFilters(){
        this.filtersInizialized = false;
        this.gestioneCommessaFilters = [];
        this.descrizioneIncaricoFilter.value = null;
        this.codiceIncaricoFilter.value = null;
    }

    initializeFilters(){
        this.filtersInizialized = false;
        this.gestioneCommessaFilters = [];
        this.descrizioneIncaricoFilter.value = null;
        this.codiceIncaricoFilter.value = null;
        this.gestioneCommessaFilters.push(this.codiceIncaricoFilter, this.descrizioneIncaricoFilter);
        this.filtersInizialized = true;
    }

    pushOnTopIncarico(incarico: WorkTaskDTO): void{
        this.currentLoadedCommesse.unshift(incarico);
        this.totalElements = this.totalElements + 1;
    }

    sendAddNewIncaricoRequest(incarico: WorkTaskDTO): Observable<any>{
        return this.datasource.makePostJsonObject<GenericResponse<any>>(
            this.backendUrlsSrv.getIncaricoUrl(), incarico, new HttpParams(), new HttpHeaders(), true)
        .pipe(
            map( (response: GenericResponse<WorkTaskDTO>) =>{
                let added: WorkTaskDTO = response.data;
                this.pushOnTopIncarico(added);
                return response;
            }),
            catchError((err) =>  {
              return throwError(err); 
            })
        );
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
                  this.getIncarichi(this.buildQueryPredicate())
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

    deleteIncarico(codiceIncarico: string): Observable<GenericResponse<any>>{
        return this.datasource.sendDeleteRequest<GenericResponse<any>>(
            this.backendUrlsSrv.getIncaricoUrl()+"/"+codiceIncarico, new HttpParams(), true);
    }

    deactivateIncarico(codiceIncarico: string): Observable<GenericResponse<any>>{
        return this.datasource.makePutJsonObject(
            this.backendUrlsSrv.getDisattivaIncaricoUrl()+"/"+codiceIncarico, undefined, new HttpParams(), new HttpHeaders(), true);
    }

    updateIncarico(incarico: WorkTaskDTO): Observable<any>{
        return this.datasource.makePutJsonObject(this.backendUrlsSrv.getIncaricoUrl(), incarico, new HttpParams(), new HttpHeaders(), true).pipe(
            map((succ: GenericResponse<WorkTaskDTO>)=>{
                let trovato: boolean = false;
                for(let i=0; i<this.currentLoadedCommesse.length && !trovato;i++){
                    if(this.currentLoadedCommesse[i].taskCode == succ.data.taskCode){
                        this.currentLoadedCommesse[i] = succ.data;
                        trovato = false;
                    }
                }
                return succ;
            }),
            catchError((err) =>  {
                return throwError(err); 
            })
        );
    }

    private buildFilters(): QueryParameter[]{
        let queryParameters: QueryParameter[] = [];
        if(this.descrizioneIncaricoFilter!=null && this.descrizioneIncaricoFilter.value!=null && this.descrizioneIncaricoFilter.value.trim()!=''){
            let descrizioneIncarico: QueryParameter = new QueryParameter(this.descrizioneIncaricoFilter.id, this.descrizioneIncaricoFilter.value);
            queryParameters.push(descrizioneIncarico);
        }
        if(this.codiceIncaricoFilter!=null && this.codiceIncaricoFilter.value!=null && this.codiceIncaricoFilter.value.trim()!=''){
            let codiceIncarico: QueryParameter = new QueryParameter(this.codiceIncaricoFilter.id, this.codiceIncaricoFilter.value);
            queryParameters.push(codiceIncarico);
        }

        return queryParameters;
    }

    buildQueryPredicate(): SPredicate {
        let pagingAndSorting = new PagingAndSorting(this.pageIndex, this.currentPageSize, this.currentSortBy.getSortBy(), this.currentSortBy.getDir());
        
        return this.predicateBuider.buildPredicate(this.buildFilters(), pagingAndSorting);
    }

    private getIncarichi(predicate: SPredicate){
        let funToCall;
        if(predicate!=null){
          funToCall = this.datasource.sendGetRequest<GenericResponse<any>>(
              this.backendUrlsSrv.getIncaricoUrl(), predicate.params, true);
        }else{
          funToCall = this.datasource.sendGetRequest<GenericResponse<any>>(
              this.backendUrlsSrv.getIncaricoUrl(), null, true);
        }
        return funToCall.pipe(
            map((response: GenericResponse<Page<WorkTaskDTO>>) => {
              this.numberOfElements = response.data.numberOfElements;
              this.totalPages = response.data.totalPages;
              this.totalElements = response.data.totalElements;
              this.currentLoadedCommesse = response.data.content;
              return true;
            }),
            catchError((err) =>  {
              return throwError(err); 
            })
          );
        
      }
      

}