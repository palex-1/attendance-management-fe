import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { OrderEvent } from 'src/app/util/order-event.model';
import { ImpiegatoSmallDTO } from 'src/app/model/dtos/impiegato/impiegato-small-dto.model';
import { SPredicate } from 'src/app/util/querying/s-predicate.model';
import { PagingAndSorting } from 'src/app/util/querying/paging-and-sorting.model';
import { FilterElement, FilterType } from '../../components/custom-filters/custom-filters.component';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { SPredicateBuilder } from 'src/app/util/querying/s-predicate-builder.service';
import { DettagliIncaricoService } from 'src/app/model/services/incarico/dettagli-incarico.service';
import { QueryParameter } from 'src/app/util/querying/query-parameter.model';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { PaginationEvent } from '../../components/custom-paginator/custom-paginator.component';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { TeamIncaricoAddRequestDTO } from 'src/app/model/dtos/incarico/team-incarico-add-request.dto';
import { ComponenteTeamIncaricoDTO } from 'src/app/model/dtos/incarico/componente-team-incarico.dto';
import { StringDTO } from 'src/app/model/dtos/string-dto.model';
import { Page } from 'src/app/util/querying/page.model';

declare const $: any;
const DEFAULT_PAGE_SIZE: number = 5;

@Component({
  selector: 'app-add-team-member-modal',
  templateUrl: './add-team-member-modal.component.html',
  styleUrls: ['./add-team-member-modal.component.scss']
})
export class AddTeamMemberModalComponent implements OnInit, OnChanges {


  @ViewChild("addTeamMemberModal", { static: true })
  addTeamMemberModal: ElementRef;

  

  @Output()
  onSaveClick: EventEmitter<any> = new EventEmitter<any>();

  taskId: number;

  addOperationInProgress: boolean = false;


  private currentSortBy: OrderEvent = new OrderEvent("", "");
  sortBy = new OrderEvent();
  initialSelectedPage: number = 0;

  public totalElements: number = 0;
  public totalPages: number = 0;
  public numberOfElements: number = 0;
  public pageIndex: number = 0;
  public currentPageSize: number = DEFAULT_PAGE_SIZE;
  public currentLoadedNotTeamComponenets: ImpiegatoSmallDTO[] = [];

  teamCommessaFilters: FilterElement[] = [];
    
  nomeFilter :FilterElement = {
      id: 'nomeImpiegatoCUSTOMIZED', i18nKeyLabel: 'label.name', name: "AddTeamMemberModalComponent.nomeImpiegatoCUSTOMIZED",
      value: null, type: FilterType.TEXT
  }

  cognomeFilter :FilterElement = {
      id: 'cognomeImpiegatoCUSTOMIZED', i18nKeyLabel: 'label.surname', name: "AddTeamMemberModalComponent.cognomeImpiegatoCUSTOMIZED",
      value: null, type: FilterType.TEXT
  }

  emailFilter: FilterElement = {
      id: 'emailCUSTOMIZED', i18nKeyLabel: 'label.email', name: "AddTeamMemberModalComponent.emailCUSTOMIZED",
      value: null, type: FilterType.TEXT
  }

  numeroTelefonoFilter: FilterElement = {
      id: 'numeroTelefonoCUSTOMIZED', i18nKeyLabel: 'label.phone-number', name: "AddTeamMemberModalComponent.numeroTelefonoCUSTOMIZED",
      value: null, type: FilterType.TEXT
  }

  private codiceCommessaInternal: string = null;
  private initializingComponent: boolean = false;
  private dataAreLoaded: boolean = false;

  private showLoaderInModal: boolean = false;

  private componentiToAdd: ImpiegatoSmallDTO[] = [];

  




  constructor(public authoritiesService: AuthoritiesService, private exceptionHandler: ChainExceptionHandler,
                private predicateBuider: SPredicateBuilder, private dettagliIncaricoSrv: DettagliIncaricoService,
                  private notifier: MessageNotifierService) { 

  }

  ngOnInit() {
    if(this.taskId!=null){
      this.resetFilters();
      this.resetCheckboxes();
      this.loadTeamComponents();
    }
  }

  ngOnChanges(changes: SimpleChanges){
    // if(this.initializingComponent){
    //   return;
    // }
    // if(changes.codiceCommessa!=null && changes.codiceCommessa!=undefined){
    //   if(changes.codiceCommessa.currentValue!=null && this.totalRecordsInternal!=changes.totalRecords.currentValue){
    //     this.totalRecordsInternal = changes.totalRecords.currentValue;
    //     this.refreshParametersValues()
    //   }
    // }
  }

  get showLoader(){
    return this.showLoaderInModal || this.addOperationInProgress;
  }

  resetPagingAndData() {
    this.totalElements = 0;
    this.totalPages = 0;
    this.numberOfElements = 0;
    this.pageIndex = 0;
    this.currentPageSize = DEFAULT_PAGE_SIZE;
    this.currentSortBy = new OrderEvent('', '');
    this.currentLoadedNotTeamComponenets = [];
  }

  resetFilters(){
    this.teamCommessaFilters = [];
    this.nomeFilter.value = null;
    this.cognomeFilter.value = null;
    this.emailFilter.value = null;
    this.numeroTelefonoFilter.value = null;
    this.teamCommessaFilters= [];
    this.teamCommessaFilters.push(
      this.nomeFilter, this.cognomeFilter, 
      this.emailFilter, this.numeroTelefonoFilter
    );
  }

  resetCheckboxes(){
    this.componentiToAdd = [];
  }

  openDialog(taskId: number){
    this.taskId = taskId;
    this.resetFilters();
    this.resetCheckboxes();
    this.resetPagingAndData();
    this.refreshNotTeamMembers();
    $(this.addTeamMemberModal.nativeElement).modal({backdrop: 'static', keyboard: false})
  }

  private closeDialog(){
    $(this.addTeamMemberModal.nativeElement).modal('hide');
  }

  closeAddDialog(){
    if(this.addOperationInProgress){
      this.notifier.notifyWarningWithI18nAndStandardTitle("general.wait-previous-request-completion");
      return;
    }
    this.closeDialog();
    this.resetFilters();
    this.resetCheckboxes();
  }

  addTeamMembers(){
    if(this.componentiToAdd==null || this.componentiToAdd.length==0){
      this.notifier.notifyWarningWithI18nAndStandardTitle("message.select-at-least-one-component")
      return;
    }
    if(this.addOperationInProgress){
      this.notifier.notifyWarningWithI18nAndStandardTitle("general.wait-previous-request-completion");
    }
    this.addOperationInProgress = true;
    let addRequest: TeamIncaricoAddRequestDTO = new TeamIncaricoAddRequestDTO();
    addRequest.componentsToCreate = [];

    for(let i: number=0; i<this.componentiToAdd.length; i++){
      let id = this.componentiToAdd[i].id;
      let toAdd: ComponenteTeamIncaricoDTO = new ComponenteTeamIncaricoDTO();
      toAdd.idImpiegato=id;
      addRequest.componentsToCreate.push(toAdd);
    }

    this.dettagliIncaricoSrv.addComponentsToTeam(this.taskId, addRequest)
    .subscribe(
      (succ: GenericResponse<StringDTO>)=>{
        this.addOperationInProgress = false;
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.team-component-successfully-added");
        this.onSaveClick.emit(addRequest);
        // this.removeFromCurrentComponentTheAdded(addRequest);
        this.resetCheckboxes();
        this.refreshNotTeamMembers();
      },
      (err: HttpErrorResponse)=>{
        this.manageErrorOnAddComponent(err);
        this.addOperationInProgress = false;
        this.resetCheckboxes();
        this.refreshNotTeamMembers();
      }
    )

  }

  private manageErrorOnAddComponent(error: HttpErrorResponse){
    let status = error.status;
    if(status==ChainExceptionHandler.CONFLICT_ERROR){ //bad request
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.some-team-component-was-already-added");
      return;
    }
    this.exceptionHandler.manageErrorWithLongChain(status);
  }

  componenteStatusChange(status: boolean, componente: ImpiegatoSmallDTO){
    if(status){ //add
      let found = false;
      for(let i=0; i<this.componentiToAdd.length && !found; i++){
        if(this.componentiToAdd[i].id==componente.id){
          found = true;
        }
      }
      if(!found){
        this.componentiToAdd.push(componente);
      }
    }else{ //remove
      let found = false;
      for(let i=0; i<this.componentiToAdd.length && !found; i++){
        if(this.componentiToAdd[i].id==componente.id){
          this.componentiToAdd.splice(i, 1);
          found = true;
        }
      }
    }
  }



  getCurrentPageIndex(): number{
    return this.pageIndex;
  }

  getTotalRecords(): number{
    return this.totalElements;
  }

  getCurrentPageSize(): number{
    return this.currentPageSize;
  }

  refreshNotTeamMembers(){
    this.loadTeamComponents();
  }

  changePage(event: PaginationEvent) {
    this.pageIndex = event.selectedPage;
    this.currentPageSize = event.pageSize;
    this.refreshNotTeamMembers();
  }

  filtersChanged(event){
    this.refreshNotTeamMembers();
  }

  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.currentSortBy = this.sortBy;
    this.refreshNotTeamMembers();
  }

  private removeFromCurrentComponentTheAdded(added: TeamIncaricoAddRequestDTO){
    if(added!=null && added.componentsToCreate!=null && added.componentsToCreate.length>0 && this.currentLoadedNotTeamComponenets!=null){
      for(let j=0; j<this.currentLoadedNotTeamComponenets.length;){
        let currentId = this.currentLoadedNotTeamComponenets[j].id;
        let found: boolean = false;

        for(let i=0; i<added.componentsToCreate.length && !found; i++){
          if(added.componentsToCreate[i]==currentId){
            found = true;
          }
        }
        if(found){
          this.currentLoadedNotTeamComponenets.splice(j, 1)
        }else{
          j++;
        }
      }

    }
    
  }

  private loadTeamComponents(){
    this.dataAreLoaded = false;
    this.showLoaderInModal = true;

    this.reloadNotTeamComponents(this.taskId).subscribe(
      (successful) => {
          this.dataAreLoaded = true;
          this.numberOfElements = successful.data.numberOfElements;
          this.totalPages = successful.data.totalPages;
          this.totalElements = successful.data.totalElements;
          this.currentLoadedNotTeamComponenets = successful.data.content;
          
          this.showLoaderInModal = false;
      },
      (error: HttpErrorResponse) =>{
          this.currentLoadedNotTeamComponenets = [];
          this.dataAreLoaded = false;
          this.exceptionHandler.manageErrorWithLongChain(error.status);
          this.showLoaderInModal = false;
      }
    );
  }  

  

  private reloadNotTeamComponents(codiceIncarico): Observable<GenericResponse<Page<ImpiegatoSmallDTO>>>{
    return this.dettagliIncaricoSrv.loadImpiegatiNotOfTeam(codiceIncarico, this.buildQueryPredicate())
  }

  private buildQueryPredicate(): SPredicate {
    let pagingAndSorting = new PagingAndSorting(this.pageIndex, this.currentPageSize, this.currentSortBy.getSortBy(), 
                this.currentSortBy.getDir());
    
    return this.predicateBuider.buildPredicate(this.buildFilters(), pagingAndSorting);
  }

  private buildFilters(): QueryParameter[]{
      let queryParameters: QueryParameter[] = [];
      this.addQueryParamForFilter(this.nomeFilter, queryParameters);
      this.addQueryParamForFilter(this.cognomeFilter, queryParameters);
      this.addQueryParamForFilter(this.numeroTelefonoFilter, queryParameters);
      this.addQueryParamForFilter(this.emailFilter, queryParameters);

      return queryParameters;
  }

  private addQueryParamForFilter(elem: FilterElement, queryParameters: QueryParameter[]){
      if(elem!=null && elem.value!=null && elem.value.trim()!=''){
          let descrizioneIncarico: QueryParameter = new QueryParameter(elem.id, elem.value);
          queryParameters.push(descrizioneIncarico);
      }
  }

  hasUpdatePermission(): boolean {
    if(this.dettagliIncaricoSrv.currentGrantedPermissionOnIncarico==null){
      return false;
    }
    return this.dettagliIncaricoSrv.currentGrantedPermissionOnIncarico.creationPermission;
  }

  hasCreatePermission(): boolean {
    if(this.dettagliIncaricoSrv.currentGrantedPermissionOnIncarico==null){
      return false;
    }
    return this.dettagliIncaricoSrv.currentGrantedPermissionOnIncarico.creationPermission;
  }

}
