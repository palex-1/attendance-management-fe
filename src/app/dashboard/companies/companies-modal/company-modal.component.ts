import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { CompanyDTO } from 'src/app/model/dtos/company/company.dto';
import { CompaniesService } from 'src/app/model/services/settings/companies.service';

declare const $: any;

@Component({
  selector: 'app-company-modal',
  templateUrl: './company-modal.component.html',
  styleUrls: ['./company-modal.component.scss']
})
export class CompanyModalComponent implements OnInit {
  
  @ViewChild("companyModal", { static: true })
  companyModal: ElementRef;

  @Output()
  onUpdateCompany: EventEmitter<CompanyDTO> = new EventEmitter();

  private companyIdToUpdate: number = null;

  name: string;
  description : string;

  addModeEnabled: boolean = null;
  editModeEnabled: boolean = null;

  addOperationInProgress: boolean = false;
  updateOperationInProgress: boolean = false;

  constructor(private authoritiesService: AuthoritiesService, private companiesService: CompaniesService,
                private notifier: MessageNotifierService, private exceptionHandler: ChainExceptionHandler) { 
                  
  }

  ngOnInit(): void {
  }

  hasAuthority(authority: string[]){
    return this.authoritiesService.hasAuthority(authority);
  }

  private clearAllFields(){
    this.companyIdToUpdate = null;
    this.name = null;
    this.description = null;
    this.addOperationInProgress = false;
    this.updateOperationInProgress = false;
  }

  openAddDialog(){
    this.clearAllFields();
    this.addModeEnabled = true;
    this.editModeEnabled = false;

    this.openDialog();
  }

  openEditDialog(company: CompanyDTO){
    this.clearAllFields();
    this.addModeEnabled = false;
    this.editModeEnabled = true;

    this.companyIdToUpdate = company.id;
    this.name = company.name;
    this.description = company.description;

    this.openDialog();
  }


  private openDialog(){
    $(this.companyModal.nativeElement).modal({backdrop: 'static', keyboard: false})
  }

  get showLoader(){
    if(this.addOperationInProgress || this.updateOperationInProgress){
      return true;
    }
    return false;
  }



  closeDialog(){
    if(this.addOperationInProgress || this.updateOperationInProgress){
      return;
    }
    $(this.companyModal.nativeElement).modal('hide');
  }

  private checkIfCurrentDataAreFilled(): boolean{
    if(this.name==null || this.name=='' || this.description==null || this.description==''){
      return false;
    }
    return true
  }


  addNewCompany(){
    if(this.addOperationInProgress){
      return;
    }
    if(!this.checkIfCurrentDataAreFilled()){
      this.notifier.notifyWarningWithI18nAndStandardTitle("message.missing-data-to-continue");
      return;
    }


    let company: CompanyDTO = new CompanyDTO();
    company.name = this.name;
    company.description = this.description;
    

    this.addOperationInProgress = true;
    
    this.companiesService.addNewCompany(company).subscribe(
      succ=>{
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.company-successfully-added")
        this.addOperationInProgress = false;
        this.closeDialog();
      },
      (err: HttpErrorResponse)=>{
        this.addOperationInProgress = false;
        if(err.status==ChainExceptionHandler.CONFLICT_ERROR){
          this.notifier.notifySuccessWithI18nAndStandardTitle("message.company-already-exists")
          return;
        }

        this.exceptionHandler.manageErrorWithLongChain(err.status);
      }
    )
  }

  updateNewCompany(){
    if(this.updateOperationInProgress){
      return;
    }

    if(!this.checkIfCurrentDataAreFilled()){
      this.notifier.notifyWarningWithI18nAndStandardTitle("message.missing-data-to-continue");
      return;
    }

    let company: CompanyDTO = new CompanyDTO();
    company.name = this.name;
    company.description = this.description;
    company.id = this.companyIdToUpdate;

    this.updateOperationInProgress = true;

    this.companiesService.updateCompany(company).subscribe(
      (succ: GenericResponse<CompanyDTO>)=>{
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.successfully-updated")
        this.updateOperationInProgress = false;
        this.closeDialog();
        this.onUpdateCompany.emit(succ.data)
      },
      (err: HttpErrorResponse)=>{
        this.updateOperationInProgress = false;

        if(err.status==ChainExceptionHandler.CONFLICT_ERROR){
          this.notifier.notifySuccessWithI18nAndStandardTitle("message.company-already-exists")
          return;
        }

        this.exceptionHandler.manageErrorWithLongChain(err.status);
      }
    )
  }


}
