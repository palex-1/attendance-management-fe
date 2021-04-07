import { Injectable } from "@angular/core";
import { ResetableService } from "../resetable-service.model";
import { ChainExceptionHandler } from "../../../util/exceptions/chain-exception-handler.service";
import { forkJoin, of, Observable, throwError } from "rxjs";
import { Params, Router } from "@angular/router";
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import { IncaricoDetailsDTO } from "../../dtos/incarico/incarico-details-dto.model";
import { RestDataSource } from "../../rest.datasource";
import { GenericResponse } from "../../dtos/generic-response.model";
import { map, catchError } from "rxjs/operators";
import { BackendUrlsService } from "../../backend-urls.service";
import { GrantedPermissionsDTO } from "../../dtos/granted-permission.dto";
import { ImpiegatoSmallDTO } from "../../dtos/impiegato/impiegato-small-dto.model";
import { SPredicate } from "src/app/util/querying/s-predicate.model";
import { OrderEvent } from "src/app/util/order-event.model";
import { PagingAndSorting } from "src/app/util/querying/paging-and-sorting.model";
import { SPredicateBuilder } from "src/app/util/querying/s-predicate-builder.service";
import { QueryParameter } from "src/app/util/querying/query-parameter.model";
import { FilterElement, FilterType } from "src/app/dashboard/components/custom-filters/custom-filters.component";
import { TeamIncaricoAddRequestDTO } from "../../dtos/incarico/team-incarico-add-request.dto";
import { StringDTO } from "../../dtos/string-dto.model";
import { ComponenteIncaricoDTO } from "../../dtos/incarico/componente-incarico.dto";
import { ComponenteTeamUpdateDTO } from "../../dtos/incarico/componente-team-update.dto";
import { Page } from 'src/app/util/querying/page.model';

const DEFAULT_PAGE_SIZE: number = 5;

@Injectable()
export class DettagliIncaricoService implements ResetableService{
    
    dataAreLoaded: boolean = false;
    currentIncaricoLoaded: IncaricoDetailsDTO = null;
    updateOperationInProgress: boolean = false;
    currentGrantedPermissionOnIncarico: GrantedPermissionsDTO = null;
    currentTaskId: number = null;
    
    public currentSortBy: OrderEvent = new OrderEvent("", "");
  
    public totalElements: number = 0;
    public totalPages: number = 0;
    public numberOfElements: number = 0;
    public pageIndex: number = 0;
    public currentPageSize: number = DEFAULT_PAGE_SIZE;
    public currentLoadedTeamComponenets: ComponenteIncaricoDTO[] = [];

    private filtersInizialized: boolean = false;
    teamCommessaFilters: FilterElement[] = [];
    
    nomeFilter :FilterElement = {
        id: 'nomeImpiegatoCUSTOMIZED', i18nKeyLabel: 'label.name', name: "DettagliIncaricoService.nomeImpiegatoCUSTOMIZED",
        value: null, type: FilterType.TEXT
    }

    cognomeFilter :FilterElement = {
        id: 'cognomeImpiegatoCUSTOMIZED', i18nKeyLabel: 'label.surname', name: "DettagliIncaricoService.cognomeImpiegatoCUSTOMIZED",
        value: null, type: FilterType.TEXT
    }

    emailFilter: FilterElement = {
        id: 'emailCUSTOMIZED', i18nKeyLabel: 'label.email', name: "DettagliIncaricoService.emailCUSTOMIZED",
        value: null, type: FilterType.TEXT
    }

    numeroTelefonoFilter: FilterElement = {
        id: 'numeroTelefonoCUSTOMIZED', i18nKeyLabel: 'label.phone-number', name: "DettagliIncaricoService.numeroTelefonoCUSTOMIZED",
        value: null, type: FilterType.TEXT
    }
    
    constructor(private exceptionHandler: ChainExceptionHandler,
                    private router: Router, private backendUrlsSrv: BackendUrlsService,
                        private datasource: RestDataSource, private predicateBuider: SPredicateBuilder){

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
        this.currentLoadedTeamComponenets = [];
        this.currentSortBy = new OrderEvent('', '');
    }

    areDataLoaded(): boolean{
        return false; //always refresh
    }

    onResolveFailure(error: HttpErrorResponse): void {
    }

    resetFilters(){
        this.filtersInizialized = false;
        this.teamCommessaFilters = [];
        this.nomeFilter.value = null;
        this.cognomeFilter.value = null;
        this.emailFilter.value = null;
        this.numeroTelefonoFilter.value = null;
    }


    initializeFilters(){
        this.filtersInizialized = false;
        this.teamCommessaFilters= [];
        this.teamCommessaFilters.push(
          this.nomeFilter, this.cognomeFilter, 
          this.emailFilter, this.numeroTelefonoFilter
        );
        this.filtersInizialized = true;
      }

    loadInitialInformation(routeParams: Params, forceReload : boolean = false): Observable<boolean>{
        if(!this.filtersInizialized){
            this.initializeFilters();
        }
        //always reload
        // if(this.dataAreLoaded && !forceReload){//always reload
        //     return of(true);
        //   }
          let taskId: number = routeParams['taskId'];
          this.currentTaskId = taskId;
          
          return this.loadIncaricoDetails(taskId);
    }

    loadIncaricoDetails(taskId: number): Observable<any>{
        return Observable.create(
            (observer) => {
              forkJoin(
                  this.getIncarico(taskId),
                  this.loadCurrentPermissionAndTeamOfIncarico(taskId)
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


    private getIncarico(taskId: number): Observable<any>{
        let params: HttpParams = new HttpParams();

        return this.datasource.sendGetRequest<GenericResponse<IncaricoDetailsDTO>>(
                this.backendUrlsSrv.getIncaricoDetailsUrl()+'/'+taskId, params, true, false, true)
                .pipe(
                    map(
                        (response: GenericResponse<IncaricoDetailsDTO>)=>{
                            this.currentIncaricoLoaded = response.data;
                            return true;
                        }
                    ),
                    catchError((err) =>  {
                        if(err.status==ChainExceptionHandler.UNAUTHORIZED || err.status==ChainExceptionHandler.FORBIDDEN){
                            this.router.navigateByUrl('dashboard/taskManage');
                        }
                        return throwError(err); 
                    })
                );
            
    }

    reloadTeamComponents(taskId): Observable<any>{
        return this.loadTeamComponents(taskId, this.buildQueryPredicate());
    }

    private loadCurrentPermissionAndTeamOfIncarico(taskId: number): Observable<any>{
        
        return Observable.create(
            (observer) => {
                this.datasource.sendGetRequest<GenericResponse<GrantedPermissionsDTO>>(
                    this.backendUrlsSrv.getTeamIncaricoPermissionGrantedUrl()+'/'+taskId, new HttpParams(), true, false, true
                ).subscribe(
                    (response)=>{
                            this.currentGrantedPermissionOnIncarico = response.data;
                            
                            if(this.currentGrantedPermissionOnIncarico!=null && 
                                this.currentGrantedPermissionOnIncarico.readPermission){
                                    this.reloadTeamComponents(taskId)
                                    .subscribe(
                                        (succ)=>{
                                            observer.next(true);
                                            observer.complete();
                                            return true;
                                        },
                                        (err)=>{
                                            observer.next(false);
                                            observer.complete();
                                            Observable.throw(err);
                                        }
                                    )
                        
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
                            Observable.throw(err);
                        }
                    )
                
            }
        );
    }

 

    private buildFilters(): QueryParameter[]{
        let queryParameters: QueryParameter[] = [];
        this.addQueryParamForFilter(this.nomeFilter, queryParameters);
        this.addQueryParamForFilter(this.cognomeFilter, queryParameters);
        this.addQueryParamForFilter(this.numeroTelefonoFilter, queryParameters);
        this.addQueryParamForFilter(this.emailFilter, queryParameters);

        return queryParameters;
    }

    addQueryParamForFilter(elem: FilterElement, queryParameters: QueryParameter[]){
        if(elem!=null && elem.value!=null && elem.value.trim()!=''){
            let descrizioneIncarico: QueryParameter = new QueryParameter(elem.id, elem.value);
            queryParameters.push(descrizioneIncarico);
        }
    }


    buildQueryPredicate(): SPredicate {
        let pagingAndSorting = new PagingAndSorting(this.pageIndex, this.currentPageSize, this.currentSortBy.getSortBy(), this.currentSortBy.getDir());
        
        return this.predicateBuider.buildPredicate(this.buildFilters(), pagingAndSorting);
    }

    private loadTeamComponents(codiceIncarico: string, predicate: SPredicate): Observable<any>{
        return this.datasource.sendGetRequest<GenericResponse<Page<ComponenteIncaricoDTO>>>(
                    this.backendUrlsSrv.getTeamIncaricoUrl()+'/'+codiceIncarico, predicate.params, true
                ).pipe(
                    map(
                        (response: GenericResponse<Page<ComponenteIncaricoDTO>>)=>{
                            this.numberOfElements = response.data.numberOfElements;
                            this.totalPages = response.data.totalPages;
                            this.totalElements = response.data.totalElements;
                            this.currentLoadedTeamComponenets = response.data.content;
                            
                            return true;
                        }
                    ),
                    catchError((err) =>  {
                        return throwError(err); 
                    })
                )
    }


    loadImpiegatiNotOfTeam(codiceIncarico: string, predicate: SPredicate): Observable<GenericResponse<Page<ImpiegatoSmallDTO>>> {
        return this.datasource.sendGetRequest<GenericResponse<Page<ImpiegatoSmallDTO>>>(
            this.backendUrlsSrv.getAllImpiegatiNotOfIncaricoUrl()+'/'+codiceIncarico, predicate.params, true
        ).pipe(
            map(
                (response: GenericResponse<Page<ImpiegatoSmallDTO>>)=>{
                    return response;
                }
            ),
            catchError((err) =>  {
                return throwError(err); 
            })
        )
    }

    addComponentsToTeam(taskId: number, componentToAdd: TeamIncaricoAddRequestDTO): Observable<GenericResponse<StringDTO>>{
        return this.datasource.makePostJsonObjectForm<GenericResponse<StringDTO>>(
            this.backendUrlsSrv.getTeamIncaricoAddSimpleComponentGrantedUrl()+'/'+taskId, componentToAdd, true
        )
    }

    // deleteStandardComponent/{codiceIncarico}/{impiegatoId}

    deleteStandardComponentFromTeam(taskId: number, componente: ComponenteIncaricoDTO){
        return this.datasource.sendDeleteRequest<GenericResponse<StringDTO>>(
            this.backendUrlsSrv.getTeamIncaricoDeleteSimpleComponentUrl()+'/'+taskId+'/'+componente.impiegato.id,
            new HttpParams(), true
        );
    }

    updateSpecialComponentTeam(taskId: number, componente: ComponenteTeamUpdateDTO){
        return this.datasource.makePutJsonObjectForm<GenericResponse<StringDTO>>(
            this.backendUrlsSrv.getTeamIncaricoUpdateSpecialRoleUrl()+'/'+taskId, componente, true
        )
    }

    deleteSpecialComponentFromTeam(currentTaskId: number, componente: ComponenteIncaricoDTO){
        let params = new HttpParams();
        params = params.append('idImpiegato', componente.impiegato.id+'');
        params = params.append('ruolo', componente.ruolo);

        return this.datasource.sendDeleteRequest<GenericResponse<StringDTO>>(
            this.backendUrlsSrv.getTeamIncaricoDeleteSpecialComponentUrl()+'/'+currentTaskId,
            params, true
        );
    }
}