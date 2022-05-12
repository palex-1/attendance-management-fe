import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FileInputUploadComponent, FileUploadEvent } from '../../components/file-input-upload/file-input-upload.component';
import { MyExpenseReportsDetailsService } from 'src/app/model/services/expenses/my-expense-report-details.service';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { Router } from '@angular/router';
import { TicketDownloadService } from 'src/app/model/services/system/ticket-download.service';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { ExpenseReportElementDTO } from 'src/app/model/dtos/expenses/expense-report-element-dto.model';
import { StringDTO } from 'src/app/model/dtos/string-dto.model';
import { TicketDownloadDTO } from 'src/app/model/dtos/ticket-download.dto';
import { StringUtils } from 'src/app/util/string/string-utils';
import { ExpenseReportDTO } from 'src/app/model/dtos/expenses/expense-report-dto.model';
import { StandardErrorCode } from 'src/app/util/standard-error-code';
import { MonthPickEvent } from '../../components/monthpicker/monthpicker.component';
import { UserExpenseReportsDetailsService } from 'src/app/model/services/expenses/user-expense-report-details.service';
import { ExpenseReportStatusPipe } from 'src/app/util/pipes/expense-report-status.pipe';

declare const $: any;

@Component({
  selector: 'app-user-expense-report-details',
  templateUrl: './user-expense-report-details.component.html',
  styleUrls: ['./user-expense-report-details.component.scss']
})
export class UserExpenseReportDetailsComponent implements OnInit {

  @ViewChild('expenseDetailsModal', { static: true }) 
  expenseDetailsModal: ElementRef;
  
  @ViewChild('expenseElemFileInput', { static: false }) 
  expenseElemFileInput: FileInputUploadComponent;

  private expenseReportElemFile: File = null;
  fileProgress: number = 0;

  creatingExpenseInProgress: boolean = false;
  addingExpenseInProgress: boolean = false;
  updatingReportInProgress: boolean = false;


  amountOfCurrentSelectedExpense: number = null;
  descriptionOfCurrentSelectedExpense: string = '';
  acceptedOfCurrentSelectedExpense: boolean = null;
  updatingExpenseReportElement: boolean = false;
  currentSelectedExpenseReportElementId: number = null;
  
  constructor(private userExpenseReportDetailsService: UserExpenseReportsDetailsService, private exceptionHandler: ChainExceptionHandler,
                private confirmer: CustomConfirmationService, private loader: LoadingService,
                  private notifier: MessageNotifierService, private router: Router, 
                    private ticketDownloadService: TicketDownloadService) { 

  }
  
  ngOnInit(): void {
  }

  reloadData(){
    this.loader.startLoading();

    this.userExpenseReportDetailsService.realodAllExpenseReports().subscribe(
      (succ: GenericResponse<any>)=>{
        this.loader.endLoading();
      },
      (error: HttpErrorResponse)=>{
        this.loader.endLoading();
        this.exceptionHandler.manageErrorWithLongChain(error.status)
      }
    )

  }

  downloadExpenseElement(elem: ExpenseReportElementDTO){
    this.loader.startLoading();

    this.userExpenseReportDetailsService.downloadExpenseElement(elem)
    .subscribe(
      (succ: GenericResponse<TicketDownloadDTO>) => {
        this.loader.endLoading();
        this.ticketDownloadService.executeFileDownloadWithBrowser(succ.data);
      },
      (err:HttpErrorResponse)=>{
        this.loader.endLoading();
        this.exceptionHandler.manageErrorWithLongChain(err.status);
      }
    )
  }

  refuseCurrentSelectesExpense(){
    if(this.updatingExpenseReportElement){
      return;
    }
    this.updatingExpenseReportElement = true;

    this.userExpenseReportDetailsService.refuseExpenseReportElement(this.currentSelectedExpenseReportElementId)
    .subscribe(
      (succ: GenericResponse<ExpenseReportElementDTO>)=>{
        this.updatingExpenseReportElement = false;
        this.reloadData();
        //close or change the status
        //this.acceptedOfCurrentSelectedExpense = succ.data.accepted;
        this.closeExpenseElementDetails();
      },
      (err: HttpErrorResponse)=>{
        this.manageErrorUpdatingReportElementDetails(err);
        this.updatingExpenseReportElement = false;
      }
    )

  }

  acceptCurrentSelectesExpense(){
    if(this.updatingExpenseReportElement){
      return;
    }
    this.updatingExpenseReportElement = true;

    this.userExpenseReportDetailsService.acceptExpenseReportElement(this.currentSelectedExpenseReportElementId)
    .subscribe(
      (succ: GenericResponse<ExpenseReportElementDTO>)=>{
        this.updatingExpenseReportElement = false;
        this.reloadData();
        //close or change the status
        //this.acceptedOfCurrentSelectedExpense = succ.data.accepted;
        this.closeExpenseElementDetails();
      },
      (err: HttpErrorResponse)=>{
        this.manageErrorUpdatingReportElementDetails(err);
        this.updatingExpenseReportElement = false;
      }
    )
    
  }

  manageErrorUpdatingReportElementDetails(error: HttpErrorResponse){

    if(error.status==ChainExceptionHandler.UNPROCESSABLE_ENTITY){
      let subcode = error.error.subcode;
      if(subcode==StandardErrorCode.SUBMISSION_FOR_THIS_DATE_IS_LOCKED){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.submissions-for-this-date-are-locked");
        return;
      }   
      if(subcode==StandardErrorCode.EXPENSE_REPORT_NOT_IN_PROCESSING_STATUS){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.expense-report-not-in-processing-status");
        return;
      }   
    }
    
    this.exceptionHandler.manageErrorWithLongChain(error.status);
  }

  closeExpenseElementDetails(){
    if(this.updatingExpenseReportElement){
      return;
    }
    $(this.expenseDetailsModal.nativeElement).modal('hide')
  }

  openDetailsDialog(elem: ExpenseReportElementDTO){
    this.amountOfCurrentSelectedExpense = elem.amount;
    this.descriptionOfCurrentSelectedExpense = elem.description;
    this.acceptedOfCurrentSelectedExpense = elem.accepted;
    this.currentSelectedExpenseReportElementId = elem.id;

    $(this.expenseDetailsModal.nativeElement).modal({backdrop: 'static', keyboard: false})
  }


  get expenses(): ExpenseReportElementDTO[] {
    if(this.userExpenseReportDetailsService.expenses==null){
      return [];
    }
    return this.userExpenseReportDetailsService.expenses;
  }

  get isProcessedCurrentExpense(){
    if(this.userExpenseReportDetailsService.currentReport!=null){
      if( this.userExpenseReportDetailsService.currentReport.status=='PARTIALLY_ACCEPTED'
        || this.userExpenseReportDetailsService.currentReport.status=='ACCEPTED'
         ||  this.userExpenseReportDetailsService.currentReport.status=='REFUSED'){
        return true;
      }
    }
    return false;
  }

  get allStatuses(): string[] {
    return ExpenseReportStatusPipe.ALL_STATUSES;
  }
  
  updateReportDetails(){
    if(this.updatingReportInProgress){
      return;
    }

    if(StringUtils.nullOrEmpty(this.status)){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.fill-all-fields");
      return;
    }

    this.updatingReportInProgress = true;
    this.loader.startLoading();

    let reportId = this.userExpenseReportDetailsService.currentReport.id;

    this.userExpenseReportDetailsService.updateExpenseReport(reportId, this.status, this.notes)
      .subscribe(
          (succ: GenericResponse<ExpenseReportDTO>)=>{
            this.loader.endLoading();
            this.notifier.notifySuccessWithI18nAndStandardTitle("message.save-completed")
            this.updatingReportInProgress = false;
          },
          (error: HttpErrorResponse) => {
            this.loader.endLoading();
            this.updatingReportInProgress = false;
            this.manageErrorUpdatingReportDetails(error);
          }
        );
  }


  manageErrorUpdatingReportDetails(error: HttpErrorResponse){

    if(error.status==ChainExceptionHandler.UNPROCESSABLE_ENTITY){
      let subcode = error.error.subcode;
      if(subcode==StandardErrorCode.SUBMISSION_FOR_THIS_DATE_IS_LOCKED){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.submissions-for-this-date-are-locked");
        return;
      }
      if(subcode==StandardErrorCode.USER_IS_NOT_AN_EMPLOYEE){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.user-is-not-an-employee-in-this-date");
        return;
      }
      if(subcode==StandardErrorCode.REPORT_CANNOT_BE_MODIFIED){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.expense-report-cannot-be-modified");
        return;
      }
      
    }
    
    this.exceptionHandler.manageErrorWithLongChain(error.status);
  }

  manageErrorOnExpenseReportCreation(error: HttpErrorResponse) {

    if(error.status==ChainExceptionHandler.UNPROCESSABLE_ENTITY){
      let subcode = error.error.subcode;
      if(subcode==StandardErrorCode.SUBMISSION_FOR_THIS_DATE_IS_LOCKED){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.submissions-for-this-date-are-locked");
        return;
      }
      if(subcode==StandardErrorCode.USER_IS_NOT_AN_EMPLOYEE){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.user-is-not-an-employee-in-this-date");
        return;
      }
      
    }
    this.exceptionHandler.manageErrorWithLongChain(error.status);
  }

  get dateOfExpence(){
    return this.userExpenseReportDetailsService.dateOfExpence;
  }

  onChangeDateOfExpence(event: MonthPickEvent){
    let parkDate = null;
    if(event!=null){
      parkDate = new Date(Date.UTC(event.year, event.month, event.day));
    }
    this.userExpenseReportDetailsService.dateOfExpence = parkDate;
  }

  fileChoosedOnDetails(choosedFile: FileUploadEvent){
    if(choosedFile.files.length>0){
      this.expenseReportElemFile = choosedFile.files[0];
    }else{
      this.expenseReportElemFile = null;
    }
  }

  get inChargeBy(){
    return this.userExpenseReportDetailsService.inChargeBy;
  }

  get madeBy(){
    return this.userExpenseReportDetailsService.madeBy;
  }

  get expenseTaskCode(){
    return this.userExpenseReportDetailsService.expenseTaskCode;
  }

  get processedBy(){
    return this.userExpenseReportDetailsService.processedBy;
  } 

  get title(){
    return this.userExpenseReportDetailsService.title;
  }

  set title(value: string){
    this.userExpenseReportDetailsService.title = value;
  }

  get location(){
    return this.userExpenseReportDetailsService.location;
  }

  set location(value: string){
    this.userExpenseReportDetailsService.location = value;
  }

  get status(){
    return this.userExpenseReportDetailsService.status;
  }

  set status(value: string){
    this.userExpenseReportDetailsService.status = value;
  }

  get amount(){
    return this.userExpenseReportDetailsService.amount;
  }

  set amount(value: number){
    this.userExpenseReportDetailsService.amount = value;
  }

  get notes(){
    return this.userExpenseReportDetailsService.currentReport.notes;
  }

  set notes(value: string){
    this.userExpenseReportDetailsService.currentReport.notes = value;
  }
}
