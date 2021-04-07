import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { IsMobileService } from '../../../util/sizing/is-mobile-service.service';
import { ImpiegatoSmallDTO } from '../../../model/dtos/impiegato/impiegato-small-dto.model';
import { OrderEvent } from '../../../util/order-event.model';
import { PaginationEvent } from '../../components/custom-paginator/custom-paginator.component';
import { DettagliIncaricoService } from 'src/app/model/services/incarico/dettagli-incarico.service';
import { FilterElement, FilterType } from '../../components/custom-filters/custom-filters.component';
import { AddTeamMemberModalComponent } from '../add-team-member-modal/add-team-member-modal.component';
import { ComponenteIncaricoDTO } from 'src/app/model/dtos/incarico/componente-incarico.dto';
import { RuoloIncarico } from 'src/app/model/dtos/incarico/ruolo-incarico.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';
import { TranslateService } from '@ngx-translate/core';
import { RuoloTeamTranslatePipe } from 'src/app/util/pipes/ruolo-team-translate.pipe';
import { ComponenteTeamUpdateDTO } from 'src/app/model/dtos/incarico/componente-team-update.dto';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';

declare const $: any;

@Component({
  selector: 'app-team-commessa',
  templateUrl: './team-commessa.component.html',
  styleUrls: ['./team-commessa.component.scss']
})
export class TeamCommessaComponent implements OnInit {

  @ViewChild('addMemberModalRef', { static: false })
  addMemberModalRef: AddTeamMemberModalComponent;

  @ViewChild('teamComponentDetails', { static: true })
  teamComponentDetails: ElementRef;

  areCollapsedFilters: boolean = false;
  updateOperationInProgress = false;

  public sortBy = new OrderEvent();

  nomeComponenteSelected: string = '';
  cognomeComponenteSelected: string = '';
  numTelefonoComponenteSelected: string = '';
  companyNameComponenteSelected: string = '';
  emailComponenteSelected: string = '';
  idComponenteSelected: number= -1;
  roleComponenteSelected: string = '';
  componenteUpdating: ComponenteIncaricoDTO = null;

  constructor(public authoritiesService: AuthoritiesService, private confirmer: CustomConfirmationService,
                private isMobileService: IsMobileService, private notifier: MessageNotifierService,
                  public dettagliCommessaService: DettagliIncaricoService, private translate: TranslateService,
                    private errorHandler: ChainExceptionHandler, private loader: LoadingService) { }

  ngOnInit() {
  }

  onAddNewMembers(event){
    this.refreshTeamMembers();
  }

  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  }

  getCurrentPageIndex(): number{
    return this.dettagliCommessaService.pageIndex;
  }

  getTotalRecords(): number{
    return this.dettagliCommessaService.totalElements;
  }

  getCurrentPageSize(): number{
    return this.dettagliCommessaService.currentPageSize;
  }

  get teamCommessaFilters(){
    return this.dettagliCommessaService.teamCommessaFilters;
  }

  refreshTeamMembers(){
    this.loader.startLoading();

    this.dettagliCommessaService.reloadTeamComponents(this.dettagliCommessaService.currentTaskId)
          .subscribe(
            succ=>{
              this.loader.endLoading();
            },
            error=>{
              this.errorHandler.manageErrorWithLongChain(error.status);
              this.loader.endLoading();
            }
          );
  }

  get componentiTeam(): ComponenteIncaricoDTO[]{
    if(this.dettagliCommessaService.currentLoadedTeamComponenets==null){
      return [];
    }
    return this.dettagliCommessaService.currentLoadedTeamComponenets;
  }

  filtersChanged(event){
    this.refreshTeamMembers();
  }

  changePage(event: PaginationEvent) {
    this.dettagliCommessaService.pageIndex = event.selectedPage;
    this.dettagliCommessaService.currentPageSize = event.pageSize;
    this.refreshTeamMembers();
  }


  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.dettagliCommessaService.currentSortBy = event;
    this.refreshTeamMembers();
  }

  get currentTaskId(): number{
    return this.dettagliCommessaService.currentTaskId;
  }

  openAddDialog(){
    this.addMemberModalRef.openDialog(this.currentTaskId);
  }

  hasUpdatePermission(): boolean {
    if(this.dettagliCommessaService.currentGrantedPermissionOnIncarico==null){
      return false;
    }
    return this.dettagliCommessaService.currentGrantedPermissionOnIncarico.updatePermission;
  }

  hasCreatePermission(): boolean {
    if(this.dettagliCommessaService.currentGrantedPermissionOnIncarico==null){
      return false;
    }
    return this.dettagliCommessaService.currentGrantedPermissionOnIncarico.creationPermission;
  }

  hasDeletePermission(): boolean {
    if(this.dettagliCommessaService.currentGrantedPermissionOnIncarico==null){
      return false;
    }
    return this.dettagliCommessaService.currentGrantedPermissionOnIncarico.deletePermission;
  }

  getNomeComponente(componente: ComponenteIncaricoDTO){
    if(componente==null || componente.impiegato==null || componente.impiegato.nome == null){
      return '';
    }
    return componente.impiegato.nome;
  }

  getCognomeComponente(componente: ComponenteIncaricoDTO){
    if(componente==null || componente.impiegato==null || componente.impiegato.cognome == null){
      return '';
    }
    return componente.impiegato.cognome;
  }

  getEmailComponente(componente: ComponenteIncaricoDTO){
    if(componente==null || componente.impiegato==null || componente.impiegato.email == null){
      return '';
    }
    return componente.impiegato.email;
  }

  getNumeroComponente(componente: ComponenteIncaricoDTO){
    if(componente==null || componente.impiegato==null || componente.impiegato.numero == null){
      return '';
    }
    return componente.impiegato.numero;
  }

  getNomeAziendaComponente(componente: ComponenteIncaricoDTO){
    if(componente==null || componente.impiegato==null || componente.impiegato.nomeAzienda == null){
      return '';
    }
    return componente.impiegato.nomeAzienda;
  }

  canDeleteComponente(componente: ComponenteIncaricoDTO){
    if(componente.ruolo==RuoloIncarico.RUOLO_GENERICO){
      return this.dettagliCommessaService.currentGrantedPermissionOnIncarico.deletePermission;
    }
    return this.authoritiesService.hasAuthority(["TEAM_INCARICO_DELETE"]);
  }

  canUpdateTeamComponentRole(){
    return this.authoritiesService.hasAuthority(["TEAM_INCARICO_CREATE"]);
  }

  askConfirmationForDelete(componente: ComponenteIncaricoDTO){
    let that = this;
    let nome = componente.impiegato != null && componente.impiegato.nome!=null ? componente.impiegato.nome:'';
    let cognome = componente.impiegato != null && componente.impiegato.cognome!=null ? componente.impiegato.cognome:'';
    this.confirmer.askConfirmationWithStandardTitle(
      MessageNotifierService.replacePlaceholderWithContent(
            this.translate.instant("message.delete-team-component-confirmation"),
            [nome, cognome]
        ), 
      ()=> {
        that.executeDeleteComponente(componente);
      }, 
      () => {} 
    );
  }

  deleteComponente(componente: ComponenteIncaricoDTO){
    this.askConfirmationForDelete(componente)
  }

  private executeDeleteComponente(componente: ComponenteIncaricoDTO){
    if(componente.ruolo==RuoloIncarico.RUOLO_GENERICO){
      this.deleteStandardComponent(componente);
    }else{
      this.deleteSpecialComponent(componente);
    }
  }

  deleteStandardComponent(componente: ComponenteIncaricoDTO){
    
    this.dettagliCommessaService.deleteStandardComponentFromTeam(this.currentTaskId, componente)
    .subscribe(
      (succ)=>{
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.team-component-deleted-successfully");
        this.refreshTeamMembers();
      },
      (err: HttpErrorResponse)=>{
        this.manageErrorOnDelete(err);
        this.refreshTeamMembers();
      }
    )
  }

  deleteSpecialComponent(componente: ComponenteIncaricoDTO){
    this.loader.startLoading();

    this.dettagliCommessaService.deleteSpecialComponentFromTeam(this.currentTaskId, componente)
    .subscribe(
      (succ)=>{
        this.loader.endLoading();
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.team-component-deleted-successfully");
        this.refreshTeamMembers();
        this.reloadSpecialComponent();
      },
      (err: HttpErrorResponse)=>{
        this.loader.endLoading();
        this.manageErrorOnDelete(err);
        this.refreshTeamMembers();
        this.reloadSpecialComponent();
      }
    )
  }

  reloadSpecialComponent(){
    this.loader.startLoading();

    return this.dettagliCommessaService.loadIncaricoDetails(this.currentTaskId)
        .subscribe(
          (succ)=>{
            this.closeDetailsDialog();
            this.updateOperationInProgress = false;
            this.loader.endLoading();
          },
          (err)=>{
            this.errorHandler.manageErrorWithLongChain(err.status);
            this.updateOperationInProgress = false;
            this.loader.endLoading();
          }
        );
  }

  manageErrorOnDelete(error: HttpErrorResponse){
    this.errorHandler.manageErrorWithLongChain(error.status);
  }

  openDetails(componente: ComponenteIncaricoDTO) {
    this.clearDetailsForm();

    this.nomeComponenteSelected = componente.impiegato.nome;
    this.cognomeComponenteSelected = componente.impiegato.cognome;
    this.numTelefonoComponenteSelected = componente.impiegato.numero;
    this.companyNameComponenteSelected = componente.impiegato.nomeAzienda;
    this.emailComponenteSelected = componente.impiegato.email;
    this.idComponenteSelected = componente.impiegato.id;
    this.roleComponenteSelected = componente.ruolo;
    this.componenteUpdating = componente;
    this.openDetailsDialog();
  }

  openDetailsDialog(){
    $(this.teamComponentDetails.nativeElement).modal({backdrop: 'static', keyboard: false})
  }

  closeDetailsDialog(){
    $(this.teamComponentDetails.nativeElement).modal('hide');
    this.clearDetailsForm();
  }

  clearDetailsForm(){
    this.nomeComponenteSelected = '';
    this.cognomeComponenteSelected = '';
    this.numTelefonoComponenteSelected = '';
    this.companyNameComponenteSelected = '';
    this.emailComponenteSelected = '';
    this.idComponenteSelected = -1;
    this.roleComponenteSelected = '';
    this.componenteUpdating = null;
  }

  updateCurrentSelectedTeamComponentRole(){
    if(this.updateOperationInProgress){
      return;
    }
    let park: ComponenteTeamUpdateDTO = new ComponenteTeamUpdateDTO();
    park.ruolo = this.roleComponenteSelected;
    if(this.componenteUpdating!=null && this.componenteUpdating.ruolo==park.ruolo){
      this.notifier.notifySuccessWithI18nAndStandardTitle("message.role-successfully-updated");
      return;
    }
    park.idImpiegato = this.idComponenteSelected;
    this.updateOperationInProgress = true;

    this.dettagliCommessaService.updateSpecialComponentTeam(this.currentTaskId, park)
    .subscribe(
      (succ)=>{
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.role-successfully-updated");
        this.reloadSpecialComponent();
      },
      (err)=>{
        this.manageErrorOnUpdateRole(err);
        this.updateOperationInProgress = false;
      }
    )
  }

  manageErrorOnUpdateRole(error: HttpErrorResponse){
    if(error.status==ChainExceptionHandler.CONFLICT_ERROR){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.in-team-a-user-with-role-exists-error")
      return;
    }
    this.errorHandler.manageErrorWithLongChain(error.status);
  }

  get allRoles(): string[]{
    return RuoloTeamTranslatePipe.getAllTeamRole();
  }

}
