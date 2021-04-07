import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { AuthoritiesService } from '../../model/services/auth/authorities.service';
import { IsMobileService } from '../../util/sizing/is-mobile-service.service';
import { OrderEvent } from '../../util/order-event.model';
import { Subject } from 'rxjs';
import { SedeDTO } from '../../model/dtos/sedi/sede-dto.model';
import { ChangeFilterEvent } from '../../directives/filter-change-collector.directive';
import { SediLavorativeService } from '../../model/services/sede/sedi-lavorative.service';
import { MessageNotifierService } from '../../dialogs/notifications/message-notifier.service';
import { ChainExceptionHandler } from '../../util/exceptions/chain-exception-handler.service';
import { AppConstans } from '../../app.constants';
import { GenericResponse } from '../../model/dtos/generic-response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { PaginationEvent } from '../components/custom-paginator/custom-paginator.component';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';

declare const $: any;

@Component({
  selector: 'app-sedi-lavorative',
  templateUrl: './sedi-lavorative.component.html',
  styleUrls: ['./sedi-lavorative.component.scss']
})
export class SediLavorativeComponent implements OnInit {

  areCollapsedFilters: boolean = false;
  public sortBy = new OrderEvent();

  nazioneSedeToAdd: string = null;
  tipoSedeToAdd: string = null;
  provinceSedeToAdd: string = null;
  citySedeToAdd: string = null;
  streetSedeToAdd: string = null;
  officeNameSedeToAdd: string = null;
  capSedeToAdd: string = null;
  addOperationInProgress: boolean = false;
  

  idSedeToUpdate: number = -1;
  nazioneSedeToUpdate: string = null;
  tipoSedeToUpdate: string = null;
  provinceSedeToUpdate: string = null;
  citySedeToUpdate: string = null;
  streetSedeToUpdate: string = null;
  officeNameSedeToUpdate: string = null;
  capSedeToUpdate: string = null;
  updateOperationInProgress: boolean = false;

  nazioneSedeDetails: string = null;
  tipoSedeDetails: string = null;
  provinceSedeDetails: string = null;
  citySedeDetails: string = null;
  streetSedeDetails: string = null;
  officeNameSedeDetails: string = null;
  capSedeDetails: string = null;

  constructor(public authoritiesService: AuthoritiesService, private loader: LoadingService,
                public isMobileService: IsMobileService,
                  public sediLavorativeSrv: SediLavorativeService,
                    private notifier: MessageNotifierService,
                      private exceptionHandler: ChainExceptionHandler) { }

  ngOnInit() {
  }

  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  } 
  
  get sediLavorativeFilters(){
    return this.sediLavorativeSrv.sediLavorativeFilters;
  }

  filtersChanged(event){
    this.refreshSedi();
  }

  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.sediLavorativeSrv.currentSortBy = event;
    this.refreshSedi();
  }

  openAddDialog(){
    $('#sediLavorativeModal').modal('toggle')
    $('#sediLavorativeModal').modal('show');
  }

  closeAddDialog(){
    $('#sediLavorativeModal').modal('hide');
    this.clearAddSedeForm();
  }

  clearAddSedeForm(){
    this.nazioneSedeToAdd = '';
    this.tipoSedeToAdd= '';
    this.provinceSedeToAdd = '';
    this.citySedeToAdd = '';
    this.streetSedeToAdd = '';
    this.officeNameSedeToAdd = '';
    this.capSedeToAdd = '';
  }
  
  openDetailsDialog(sede: SedeDTO){
    this.clearDetailsDialog();
    this.nazioneSedeDetails = sede.nazione;
    this.tipoSedeDetails = sede.tipoSede;
    this.provinceSedeDetails = sede.provincia;
    this.citySedeDetails = sede.citta;
    this.streetSedeDetails = sede.via;
    this.officeNameSedeDetails = sede.nomeSede;
    this.capSedeDetails = sede.cap;
    $('#sediLavorativeReadModal').modal('toggle')
    $('#sediLavorativeReadModal').modal('show');
  }

  clearDetailsDialog(){
    this.nazioneSedeDetails= '';
    this.tipoSedeDetails= '';
    this.provinceSedeDetails= '';
    this.citySedeDetails= '';
    this.streetSedeDetails = '';
    this.officeNameSedeDetails = '';
    this.capSedeDetails = '';
  }

  clearUpdateSedeForm(){
    this.idSedeToUpdate = -1;
    this.nazioneSedeToUpdate= '';
    this.tipoSedeToUpdate= '';
    this.provinceSedeToUpdate= '';
    this.citySedeToUpdate= '';
    this.streetSedeToUpdate = '';
    this.officeNameSedeToUpdate = '';
    this.capSedeToUpdate = '';
  }

  openEditDialog(sede: SedeDTO){
    this.clearAddSedeForm();
    this.idSedeToUpdate = sede.id;
    this.nazioneSedeToUpdate= sede.nazione;
    this.tipoSedeToUpdate= sede.tipoSede;
    this.provinceSedeToUpdate= sede.provincia;
    this.citySedeToUpdate= sede.citta;
    this.streetSedeToUpdate = sede.via;
    this.officeNameSedeToUpdate = sede.nomeSede;
    this.capSedeToUpdate = sede.cap;
    $('#sediLavorativeUpdateModal').modal('toggle')
    $('#sediLavorativeUpdateModal').modal('show');
  }

  closeEditDialog(){
    $('#sediLavorativeUpdateModal').modal('hide');
    this.clearUpdateSedeForm();
  }

  updateSede(){
    let sede: SedeDTO = new SedeDTO();

    sede.cap = (this.capSedeToUpdate == null || this.capSedeToUpdate.trim()=='') ? null: this.capSedeToUpdate.trim();
    sede.citta = (this.citySedeToUpdate == null || this.citySedeToUpdate.trim()=='') ? null: this.citySedeToUpdate.trim();
    sede.nazione = (this.nazioneSedeToUpdate == null || this.nazioneSedeToUpdate.trim()=='') ? null: this.nazioneSedeToUpdate.trim();
    sede.nomeSede = (this.officeNameSedeToUpdate == null || this.officeNameSedeToUpdate.trim()=='') ? null: this.officeNameSedeToUpdate.trim();
    sede.provincia = (this.provinceSedeToUpdate == null || this.provinceSedeToUpdate.trim()=='') ? null: this.provinceSedeToUpdate.trim();
    sede.tipoSede = (this.tipoSedeToUpdate == null || this.tipoSedeToUpdate.trim()=='') ? null: this.tipoSedeToUpdate.trim();
    sede.via = (this.streetSedeToUpdate == null || this.streetSedeToUpdate.trim()=='') ? null: this.streetSedeToUpdate.trim();
    sede.id = this.idSedeToUpdate;

    if(sede.cap == null || sede.citta==null || sede.nazione==null 
      || sede.nomeSede==null || sede.provincia==null || sede.tipoSede==null || sede.via==null){
        this.notifier.notifyWarningWithI18nAndStandardTitle("generic.missing-data-to-continue");
        return;
    }
    this.executeUpdateSede(sede);

  }

  executeUpdateSede(sede: SedeDTO){
    if(this.updateOperationInProgress){
      this.notifier.notifyWarningWithI18nAndStandardTitle("generic.message-wait-for-completion");
      return;
    }
    this.updateOperationInProgress = true;
    this.sediLavorativeSrv.updateSede(sede).subscribe(
      (succ: GenericResponse<SedeDTO>)=>{
        this.notifier.notifySuccessWithI18nAndStandardTitle("gestione-sedi-lavorative.updated-successfully");
        this.updateOperationInProgress = false;
        this.closeEditDialog();
      },
      (err: HttpErrorResponse)=>{
        this.manageErrorOnUpdateSede(err.status);
        this.updateOperationInProgress = false;
      }
    );

  }

  manageErrorOnUpdateSede(status : number){
    if(status==ChainExceptionHandler.NOT_FOUND){
      this.notifier.notifyErrorWithI18nAndStandardTitle("gestione-sedi-lavorative.not-fount");
      this.refreshSedi();
      return;
    }
    if(status==ChainExceptionHandler.CONFLICT_ERROR){
      this.notifier.notifyErrorWithI18nAndStandardTitle("gestione-sedi-lavorative.sede-name-already-exist");
      return;
    }
    this.exceptionHandler.manageErrorWithLongChain(status);
  }

  addNewSede(){
    let sede: SedeDTO = new SedeDTO();

    sede.cap = (this.capSedeToAdd == null || this.capSedeToAdd.trim()=='') ? null: this.capSedeToAdd.trim();
    sede.citta = (this.citySedeToAdd == null || this.citySedeToAdd.trim()=='') ? null: this.citySedeToAdd.trim();
    sede.nazione = (this.nazioneSedeToAdd == null || this.nazioneSedeToAdd.trim()=='') ? null: this.nazioneSedeToAdd.trim();
    sede.nomeSede = (this.officeNameSedeToAdd == null || this.officeNameSedeToAdd.trim()=='') ? null: this.officeNameSedeToAdd.trim();
    sede.provincia = (this.provinceSedeToAdd == null || this.provinceSedeToAdd.trim()=='') ? null: this.provinceSedeToAdd.trim();
    sede.tipoSede = (this.tipoSedeToAdd == null || this.tipoSedeToAdd.trim()=='') ? null: this.tipoSedeToAdd.trim();
    sede.via = (this.streetSedeToAdd == null || this.streetSedeToAdd.trim()=='') ? null: this.streetSedeToAdd.trim();
    
    if(sede.cap == null || sede.citta==null || sede.nazione==null 
      || sede.nomeSede==null || sede.provincia==null || sede.tipoSede==null || sede.via==null){
        this.notifier.notifyWarningWithI18nAndStandardTitle("generic.missing-data-to-continue");
        return;
    }

    this.executeAddSede(sede);
  }

  executeAddSede(sede: SedeDTO){
    if(this.addOperationInProgress){
      this.notifier.notifyWarningWithI18nAndStandardTitle("generic.message-wait-for-completion");
      return;
    }
    this.addOperationInProgress = true;
    let that = this;
    this.sediLavorativeSrv.sendAddNewIncaricoRequest(sede)
    .subscribe(
        succ => {
                this.notifier.notifySuccessWithI18nAndStandardTitle("gestione-sede-lavorative.sede-added");
                this.addOperationInProgress = false;
                this.closeAddDialog();
            },
        (error: HttpErrorResponse)=>{
                this.manageAddCommessaError(error.status);
                this.addOperationInProgress = false;
            }
        );
  }

  manageAddCommessaError(status: number){
    if(status==ChainExceptionHandler.CONFLICT_ERROR){
      this.notifier.notifyErrorWithI18nAndStandardTitle("gestione-sedi-lavorative.sede-name-already-exist");
      return;
    }
    this.exceptionHandler.manageErrorWithLongChain(status);
  }

  refreshSedi(){
    this.loader.startLoading();

    return this.sediLavorativeSrv.loadSedi().subscribe(
      succ=>{
        this.loader.endLoading();
      },
      err=>{
        this.loader.endLoading();
        this.exceptionHandler.manageErrorWithLongChain(err.status)
      }
    );
  }

  changePage(event: PaginationEvent) {
    this.sediLavorativeSrv.pageIndex = event.selectedPage;
    this.sediLavorativeSrv.currentPageSize = event.pageSize;
    this.refreshSedi();
  }

  get currentSedi(){
    return this.sediLavorativeSrv.currentLoadedSede;
  }

  getCurrentPageIndex(): number{
    return this.sediLavorativeSrv.pageIndex;
  }

  getTotalRecords(): number{
    return this.sediLavorativeSrv.totalElements;
  }

  getCurrentPageSize(): number{
    return this.sediLavorativeSrv.currentPageSize;
  }

  get tipoSedi(): string[]{
    return this.sediLavorativeSrv.tipoSedi;
  }

}
