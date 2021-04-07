import { Component, OnInit } from '@angular/core';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { DettagliIncaricoService } from '../../../model/services/incarico/dettagli-incarico.service';
import { IncaricoDetailsDTO } from '../../../model/dtos/incarico/incarico-details-dto.model';
import { DateUtils } from '../../../util/dates/date-utils';
import { ImpiegatoTinyDTO } from '../../../model/dtos/impiegato/impiegato-tiny-dto.model';
import { ChainExceptionHandler } from '../../../util/exceptions/chain-exception-handler.service';
import { GenericResponse } from '../../../model/dtos/generic-response.model';
import { MessageNotifierService } from '../../../dialogs/notifications/message-notifier.service';
import { StringUtils } from '../../../util/string/string-utils';
import { HttpErrorResponse } from '@angular/common/http';
import { IncaricoService } from '../../../model/services/incarico/incarico.service';
import { MonthPickEvent } from '../../components/monthpicker/monthpicker.component';
import { WorkTaskDTO } from 'src/app/model/dtos/incarico/work-task-dto.model';

@Component({
  selector: 'app-dettagli-commessa',
  templateUrl: './dettagli-commessa.component.html',
  styleUrls: ['./dettagli-commessa.component.scss']
})
export class DettagliCommessaComponent implements OnInit {

  //this change solve a bug related to change the codice commessa in address bar
  codiceCommessaDetails: string = '';
  pivaCommessaDetails: string = '';
  descrizioneCommessaDetails: string = '';
  fatturabileCheckCommessaDetails: boolean = true;
  dataAttivazioneCommessaDetails: Date = null;
  dataDisattivazioneCommessaDetails: Date = null;
  nameSurnameProjectManager: string = '';
  nameSurnameDeliveryManager: string = '';
  nameSurnameAccountManager: string = '';
  nameSurnameQAReviewer: string = '';
  isEnabledForAllUserCheckCommessaDetails: boolean = false;
  isAbsenceTask: boolean = false;

  currentUserCanEditCommessa: boolean = false;

  constructor(public authoritiesService: AuthoritiesService,
                public dettagliCommessaService: DettagliIncaricoService,
                  private notifier: MessageNotifierService, private gestioneCommesseSrv: IncaricoService,
                    private exceptionHandler: ChainExceptionHandler,) {


  }

  ngOnInit() {
    this.currentUserCanEditCommessa = this.authoritiesService.hasAuthorityLocalCheck(['INCARICO_UPDATE']);
    this.inizializeIncarico();
  }

  openAddDialog(){

  }

  onChangeDisattivazioneCommessa(event: MonthPickEvent){
    let parkDate = null;
    if(event!=null){
      parkDate = new Date(Date.UTC(event.year, event.month, event.day));
    }
    this.dataDisattivazioneCommessaDetails = parkDate;
  }

  onChangeAttivazioneCommessa(event: MonthPickEvent){
    let parkDate = null;
    if(event!=null){
      parkDate = new Date(Date.UTC(event.year, event.month, event.day));
    }
    this.dataAttivazioneCommessaDetails = parkDate;
  }

  inizializeIncarico(){
    
    if(this.dettagliCommessaService.currentIncaricoLoaded!=null){
      let incarico: IncaricoDetailsDTO = this.dettagliCommessaService.currentIncaricoLoaded;
      if(incarico.task!=null){
        this.codiceCommessaDetails = incarico.task.taskCode;
        this.pivaCommessaDetails = incarico.task.clientVat;
        this.descrizioneCommessaDetails = incarico.task.taskDescription;
        this.fatturabileCheckCommessaDetails = incarico.task.billable;
        this.dataAttivazioneCommessaDetails = DateUtils.buildDateFromStrOrDate(incarico.task.activationDate);
        this.dataDisattivazioneCommessaDetails = DateUtils.buildDateFromStrOrDate(incarico.task.deactivationDate);
        this.isEnabledForAllUserCheckCommessaDetails = incarico.task.isEnabledForAllUsers;
        this.isAbsenceTask = incarico.task.isAbsenceTask;
      }
      
      this.nameSurnameProjectManager = this.composeNameAndSurname(incarico.projectManager);
      this.nameSurnameDeliveryManager = this.composeNameAndSurname(incarico.deliveryManager);
      this.nameSurnameAccountManager = this.composeNameAndSurname(incarico.accountManager);
      this.nameSurnameQAReviewer = this.composeNameAndSurname(incarico.qaReviewer);
    }
  }
  

  composeNameAndSurname(impiegato: ImpiegatoTinyDTO){
    let nameAndSurname: string = '';
    if(impiegato==null){
      return nameAndSurname;
    }
    if(impiegato.nome!=null){
      nameAndSurname = nameAndSurname + impiegato.nome+" ";
    }
    if(impiegato.cognome!=null){
      nameAndSurname = nameAndSurname + impiegato.cognome;
    }

    return nameAndSurname;
  }


  updateCommessa(){
    let commessa: WorkTaskDTO = new WorkTaskDTO();
    commessa.id = this.dettagliCommessaService.currentIncaricoLoaded.task.id;
    commessa.taskCode =  StringUtils.nullOrEmpty(this.codiceCommessaDetails)? null:this.codiceCommessaDetails.trim();
    commessa.clientVat= StringUtils.nullOrEmpty(this.pivaCommessaDetails) ? null:this.pivaCommessaDetails.trim();
    commessa.taskDescription= StringUtils.nullOrEmpty(this.descrizioneCommessaDetails)==null ? null: this.descrizioneCommessaDetails.trim();
    commessa.billable= this.fatturabileCheckCommessaDetails;
    commessa.activationDate = this.dataAttivazioneCommessaDetails==null ? null: DateUtils.buildStartOfDayOfDate(this.dataAttivazioneCommessaDetails);
    commessa.deactivationDate = this.dataDisattivazioneCommessaDetails==null ? null: DateUtils.buildEndOfDayOfDate(this.dataDisattivazioneCommessaDetails);

    if(commessa.taskDescription==null || commessa.taskDescription.length < 1){
        this.notifier.notifyWarningWithI18nAndStandardTitle("generic.missing-data-to-continue");
        return;
    }
    
    this.executeUpdateCommessa(commessa);
  }

  executeUpdateCommessa(commessa: WorkTaskDTO){
    if(this.dettagliCommessaService.updateOperationInProgress){
      this.notifier.notifyWarningWithI18nAndStandardTitle("generic.message-wait-for-completion");
      return;
    }
    console.log(commessa)
    this.dettagliCommessaService.updateOperationInProgress = true;
    this.gestioneCommesseSrv.updateIncarico(commessa).subscribe(
      (succ: GenericResponse<WorkTaskDTO>)=>{
        this.dettagliCommessaService.currentIncaricoLoaded.task = succ.data;
        
        this.notifier.notifySuccessWithI18nAndStandardTitle("gestione-commesse.updated-successfully");
        this.dettagliCommessaService.updateOperationInProgress = false;
      },
      (err: HttpErrorResponse)=>{
        let res: GenericResponse<any> = err.error;
        this.manageErrorOnUpdateCommessa(res, err.status);
        this.dettagliCommessaService.updateOperationInProgress = false;
      }
    )

  }

  manageErrorOnUpdateCommessa(res: GenericResponse<any>, status : number){
    if(status==ChainExceptionHandler.NOT_FOUND){
      this.notifier.notifyErrorWithI18nAndStandardTitle("gestione-commesse.commessa-not-found");
      return;
    }
    if(status==ChainExceptionHandler.NOT_ACCEPTABLE){
      if(res.subcode==1){
        this.notifier.notifyErrorWithI18nAndStandardTitle("gestione-commesse.deactivation-date-moved-next");
      }else{
        this.notifier.notifyErrorWithI18nAndStandardTitle("gestione-commesse.date-activation-after-deactivation");
      }
      return;
    }
    if(status==ChainExceptionHandler.CONFLICT_ERROR){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.already-exists-task-with-this-code");
      return;
    }
    this.exceptionHandler.manageErrorWithLongChain(status);
  }

  
  get updateOperationInProgress(): boolean{
    return this.dettagliCommessaService.updateOperationInProgress;
  }
}
