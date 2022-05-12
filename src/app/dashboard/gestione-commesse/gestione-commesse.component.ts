import { Component, OnInit, AfterViewInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { AuthoritiesService } from '../../model/services/auth/authorities.service';
import { OrderEvent } from '../../util/order-event.model';
import { IsMobileService } from '../../util/sizing/is-mobile-service.service';
import { IncaricoService } from '../../model/services/incarico/incarico.service';
import { MessageNotifierService } from '../../dialogs/notifications/message-notifier.service';
import { ChainExceptionHandler } from '../../util/exceptions/chain-exception-handler.service';
import { CustomConfirmationService } from '../../dialogs/confirmation/custom-confirmation.service';
import { TranslateService } from '@ngx-translate/core';
import { StringUtils } from 'src/app/util/string/string-utils';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { PaginationEvent } from '../components/custom-paginator/custom-paginator.component';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { MonthPickEvent } from '../components/monthpicker/monthpicker.component';
import { WorkTaskDTO } from 'src/app/model/dtos/incarico/work-task-dto.model';

declare const $: any;

@Component({
  selector: 'app-gestione-commesse',
  templateUrl: './gestione-commesse.component.html',
  styleUrls: ['./gestione-commesse.component.scss']
})
export class GestioneCommesseComponent implements OnInit {

  @ViewChild('addNewCommessaModal', { static: false })
  addNewCommessaModal: ElementRef;

  codiceCommessaToAdd: string = '';
  pivaCommessaToAdd: string = '';
  descrizioneCommessaToAdd: string = '';
  dataAttivazioneCommessaToAdd: Date = null;
  dataDisattivazioneCommessaToAdd: Date = null;
  fatturabileCheckCommessaToAdd: boolean = true;
  isEnabledForAllUsersToAdd: boolean = false;
  isAbsenceTaskToAdd: boolean = false;
  totalBudgetToAdd: number = 0

  public sortBy = new OrderEvent();

  areCollapsedFilters: boolean = false;
  addOperationInProgress = false;

  deleteInProgress: boolean = false;
  deactivationInProgress: boolean = false;

  filterRequestsInProgress: number = 0;

  constructor(private authoritiesService: AuthoritiesService,
                private isMobileService: IsMobileService,
                  private gestioneCommesseSrv: IncaricoService,
                    private notifier: MessageNotifierService,
                      private exceptionHandler: ChainExceptionHandler,
                        private confirmer: CustomConfirmationService,
                          private translate: TranslateService,
                            private router: Router, private loader: LoadingService) { 

  }

  ngOnInit() {
  }

  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  } 

  hasAuthority(authority: string[]){
    return this.authoritiesService.hasAuthority(authority);
  }

  filtersChanged(event){
    this.refreshCommesse();
  }

  get gestioneCommessaFilters(){
    return this.gestioneCommesseSrv.gestioneCommessaFilters;
  }

  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.gestioneCommesseSrv.currentSortBy = event;
    this.refreshCommesse();
  }

  openAddDialog(){
    $(this.addNewCommessaModal.nativeElement).modal('toggle')
    $(this.addNewCommessaModal.nativeElement).modal('show');
  }

  closeAddDialog(){
    $(this.addNewCommessaModal.nativeElement).modal('hide');
    this.clearAddIncaricoForm();
  }
  

  opendDetails(incarico: WorkTaskDTO){
    this.router.navigateByUrl('dashboard/taskManage/'+incarico.id);
  }


  clearAddIncaricoForm(): void{
    this.codiceCommessaToAdd = '';
    this.pivaCommessaToAdd = '';
    this.descrizioneCommessaToAdd = '';
    this.dataAttivazioneCommessaToAdd = null;
    this.dataDisattivazioneCommessaToAdd = null;
    this.fatturabileCheckCommessaToAdd = true;
    this.isEnabledForAllUsersToAdd = false;
    this.isAbsenceTaskToAdd = false;
    this.totalBudgetToAdd = 0
  }

  addNewCommessa(){
    let taskToAdd: WorkTaskDTO = new WorkTaskDTO();
    taskToAdd.taskCode = StringUtils.nullOrEmpty(this.codiceCommessaToAdd) ? null:this.codiceCommessaToAdd.trim();
    taskToAdd.clientVat = StringUtils.nullOrEmpty(this.pivaCommessaToAdd) ? null:this.pivaCommessaToAdd.trim();
    taskToAdd.taskDescription = StringUtils.nullOrEmpty(this.descrizioneCommessaToAdd) ? null:this.descrizioneCommessaToAdd.trim();
    taskToAdd.billable = this.fatturabileCheckCommessaToAdd;
    taskToAdd.activationDate = this.dataAttivazioneCommessaToAdd;
    taskToAdd.deactivationDate = this.dataDisattivazioneCommessaToAdd;
    taskToAdd.isEnabledForAllUsers = this.isEnabledForAllUsersToAdd;
    taskToAdd.isAbsenceTask = this.isAbsenceTaskToAdd;


    if(taskToAdd.taskCode==null  || taskToAdd.taskCode.length < 1 
        || taskToAdd.taskDescription==null || taskToAdd.taskDescription.length < 1 || taskToAdd.isAbsenceTask==null
        || taskToAdd.activationDate==null || taskToAdd.billable==null || taskToAdd.isEnabledForAllUsers==null){
          this.notifier.notifyWarningWithI18nAndStandardTitle("generic.missing-data-to-continue");
          return;
    }
        
    if(taskToAdd.isAbsenceTask){
        taskToAdd.totalBudget = 0
    }else{
        if(this.totalBudgetToAdd==null){
          this.notifier.notifyWarningWithI18nAndStandardTitle("generic.missing-data-to-continue");
          return;
        }
        taskToAdd.totalBudget = this.totalBudgetToAdd
    }
    
    if(taskToAdd.deactivationDate!=null && taskToAdd.deactivationDate<taskToAdd.activationDate){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.activation-date-after-deactivation");
      return;
    }

    this.executeAddIncarico(taskToAdd);
  }

  activationDateToAddChanged(event: MonthPickEvent){
    let parkDate = null;
    if(event!=null){
      parkDate = new Date(Date.UTC(event.year, event.month, event.day));
    }
    this.dataAttivazioneCommessaToAdd = parkDate;
  }

  deactivationDateToAddChanged(event: MonthPickEvent){
    let parkDate = null;
    if(event!=null){
      parkDate = new Date(Date.UTC(event.year, event.month, event.day));
    }
    this.dataDisattivazioneCommessaToAdd = parkDate;
  }

  deleteIncarico(codiceIncarico: string){
    if(this.deleteInProgress){
      this.notifier.notifyWarningWithI18nAndStandardTitle("generic.message-wait-for-completion");
      return;
    }
    let that = this;
    this.confirmer.askConfirmationWithStandardTitle(
      this.translate.instant("gestione-commesse.delete-confirmation") +" '"+codiceIncarico+"'", 
      ()=> {
        that.executeDeleteIncarico(codiceIncarico);
      }, 
      () => {} 
    );
  }

  executeDeleteIncarico(codiceIncarico: string){
    this.deleteInProgress = true;
    this.gestioneCommesseSrv.deleteIncarico(codiceIncarico).subscribe(
      succ=>{
        this.notifier.notifySuccessWithI18nAndStandardTitle("gestione-commesse.deleted-successfully");
        this.deleteInProgress = false;
        this.refreshCommesse();
      },
      (err: HttpErrorResponse)=>{
        this.manageErrorOnDeleteCommessa(err.status);
        this.deleteInProgress = false;
      }
    )
  }

  manageErrorOnDeleteCommessa(status : number){
    if(status==ChainExceptionHandler.NOT_ACCEPTABLE){
      this.notifier.notifyErrorWithI18nAndStandardTitle("gestione-commesse.commessa-in-use-error");
      return;
    }
    if(status==ChainExceptionHandler.NOT_FOUND){
      this.notifier.notifyErrorWithI18nAndStandardTitle("gestione-commesse.commessa-not-found");
      this.refreshCommesse();
      return;
    }
    this.exceptionHandler.manageErrorWithLongChain(status);
  }


  executeAddIncarico(commessa: WorkTaskDTO){
    if(this.addOperationInProgress){
      this.notifier.notifyWarningWithI18nAndStandardTitle("generic.message-wait-for-completion");
      return;
    }
    this.addOperationInProgress = true;

    this.gestioneCommesseSrv.sendAddNewIncaricoRequest(commessa)
    .subscribe(
        succ => {
                this.notifier.notifySuccessWithI18nAndStandardTitle("gestione-commesse.successfully-added");
                this.addOperationInProgress = false;
                this.closeAddDialog();
            },
        (error: HttpErrorResponse)=>{
                this.manageAddCommessaError(error.status);
                this.addOperationInProgress = false;
            }
        );
  }

  manageAddCommessaError(status): void{
    if(status==ChainExceptionHandler.CONFLICT_ERROR){
      this.notifier.notifyErrorWithI18nAndStandardTitle("gestione-commesse.already-added");
      return;
    }
    if(status==ChainExceptionHandler.NOT_ACCEPTABLE){
      this.notifier.notifyErrorWithI18nAndStandardTitle("gestione-commesse.date-activation-after-deactivation");
      return;
    }
    this.exceptionHandler.manageErrorWithLongChain(status);
  }

  get currentCommesse(){
    return this.gestioneCommesseSrv.currentLoadedCommesse;
  }

  getCurrentPageIndex(): number{
    return this.gestioneCommesseSrv.pageIndex;
  }

  getTotalRecords(): number{
    return this.gestioneCommesseSrv.totalElements;
  }

  getCurrentPageSize(): number{
    return this.gestioneCommesseSrv.currentPageSize;
  }

  changePage(event: PaginationEvent) {
    this.gestioneCommesseSrv.pageIndex = event.selectedPage;
    this.gestioneCommesseSrv.currentPageSize = event.pageSize;
    this.refreshCommesse();
  }

  refreshCommesse(){
    this.loader.startLoading();

    return this.gestioneCommesseSrv.loadInitialInformation(undefined, true).subscribe(
      succ=>{
        this.loader.endLoading();
        //this.checkPaginationItegrity(); //WORKAROUND BUG PRIME NG
      },
      err=>{
        this.loader.endLoading();
      }
    );
  }



}
