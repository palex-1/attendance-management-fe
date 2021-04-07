import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MonthPickEvent } from '../../components/monthpicker/monthpicker.component';
import { MyExpenseReportsDetailsService } from 'src/app/model/services/expenses/my-expense-report-details.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { FileInputUploadComponent, FileUploadEvent } from '../../components/file-input-upload/file-input-upload.component';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { StringUtils } from 'src/app/util/string/string-utils';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { ExpenseReportDTO } from 'src/app/model/dtos/expenses/expense-report-dto.model';
import { Router } from '@angular/router';
import { HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { StandardErrorCode } from 'src/app/util/standard-error-code';
import { ExpenseReportElementDTO } from 'src/app/model/dtos/expenses/expense-report-element-dto.model';
import { StringDTO } from 'src/app/model/dtos/string-dto.model';
import { TicketDownloadDTO } from 'src/app/model/dtos/ticket-download.dto';
import { TicketDownloadService } from 'src/app/model/services/system/ticket-download.service';

declare const $: any;


@Component({
  selector: 'app-my-expense-report-details',
  templateUrl: './my-expense-report-details.component.html',
  styleUrls: ['./my-expense-report-details.component.scss']
})
export class MyExpenseReportDetailsComponent implements OnInit {

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

  constructor(private myExpenseReportsDetailsService: MyExpenseReportsDetailsService, private exceptionHandler: ChainExceptionHandler,
                private confirmer: CustomConfirmationService, private loader: LoadingService,
                  private notifier: MessageNotifierService, private router: Router, private ticketDownloadService: TicketDownloadService) { 

  }
  
  ngOnInit(): void {
    this.myExpenseReportsDetailsService.resetExpenseReportElementData();
  }

  reloadData(){
    this.loader.startLoading();

    this.myExpenseReportsDetailsService.realodAllMyExpenseReports().subscribe(
      (succ: GenericResponse<any>)=>{
        this.loader.endLoading();
      },
      (error: HttpErrorResponse)=>{
        this.loader.endLoading();
        this.exceptionHandler.manageErrorWithLongChain(error.status)
      }
    )

  }

  openDetailsDialog(elem: ExpenseReportElementDTO){
    this.amountOfCurrentSelectedExpense = elem.amount;
    this.descriptionOfCurrentSelectedExpense = elem.description;
    this.acceptedOfCurrentSelectedExpense = elem.accepted;

    $(this.expenseDetailsModal.nativeElement).modal()
  }

  deleteExpenseElement(elem: ExpenseReportElementDTO){
    let that = this;
    this.confirmer.askConfirmationWithStandardTitleI18nNoRejectCallback("message.sure-to-delete-expense", 
    ()=>{
      that.executeDeleteExpenseElement(elem)
    })
  }

  executeDeleteExpenseElement(elem: ExpenseReportElementDTO) {
    this.loader.startLoading();

    this.myExpenseReportsDetailsService.deleteExpenseReportElement(elem).subscribe(
      (succ: GenericResponse<StringDTO>)=>{
        this.loader.endLoading();
        this.reloadData();
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.deleted-expense");
      },
      (error: HttpErrorResponse)=>{
        this.loader.endLoading();
        this.manageErrorUpdatingReportDetails(error);
      }
    )
  }

  downloadExpenseElement(elem: ExpenseReportElementDTO){
    this.loader.startLoading();

    this.myExpenseReportsDetailsService.downloadExpenseElement(elem)
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

  

  get creationModeEnabled(): boolean {
    return this.myExpenseReportsDetailsService.creationMode;
  }
  
  get expenses(): ExpenseReportElementDTO[] {
    if(this.myExpenseReportsDetailsService.expenses==null){
      return [];
    }
    return this.myExpenseReportsDetailsService.expenses;
  }

  get isProcessedCurrentExpense(){
    if(this.myExpenseReportsDetailsService.currentReport!=null){
      if( this.myExpenseReportsDetailsService.currentReport.status=='PARTIALLY_ACCEPTED'
        || this.myExpenseReportsDetailsService.currentReport.status=='ACCEPTED'
         ||  this.myExpenseReportsDetailsService.currentReport.status=='REFUSED'){
        return true;
      }
    }
    return false;
  }

  get isBlockedEditing(){
    if(this.myExpenseReportsDetailsService.currentReport!=null){
      if(this.myExpenseReportsDetailsService.currentReport.status!='TO_BE_PROCESSED'){
        return true;
      }
    }
    return false;
  }



  addNewExpense(){
    if(this.addingExpenseInProgress){
      return;
    }

    if(StringUtils.nullOrEmpty(this.description) || this.amount==null || this.expenseReportElemFile==null){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.fill-all-fields");
      return;
    }

    if(this.amount<=0){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.bad-data");
      return;
    }
    
    this.addingExpenseInProgress = true;
    this.loader.startLoading();

    let reportId = this.myExpenseReportsDetailsService.currentReport.id;

    this.myExpenseReportsDetailsService.addNewExpenseReportDetails(
      reportId, this.description, this.amount, this.expenseReportElemFile)
      .subscribe(
        (event)=>{
          if (event.type === HttpEventType.UploadProgress) {
            // This is an upload progress event. Compute and show the % done:
            let percentDone = Math.round(100 * event.loaded / event.total);

            if(percentDone > 1){
              percentDone = percentDone - 1;
            }
            this.fileProgress = percentDone;

          } else if (event instanceof HttpResponse) {
            this.fileProgress = 0;
            this.addingExpenseInProgress = false;
            this.notifier.notifySuccessWithI18nAndStandardTitle("message.expense-report-details-added");
            this.loader.endLoading();
            this.expenseElemFileInput.resetForm();
            this.myExpenseReportsDetailsService.resetExpenseReportElementData();
            this.reloadData();
          } 
        },
        (error: HttpErrorResponse) => {
          this.loader.endLoading();
          this.addingExpenseInProgress = false;
          this.manageErrorUpdatingReportDetails(error);
          this.fileProgress = 0;
        }
      );
  }


  updateReportDetails(){
    if(this.updatingReportInProgress){
      return;
    }

    if(StringUtils.nullOrEmpty(this.title) || StringUtils.nullOrEmpty(this.location) || 
                  this.myExpenseReportsDetailsService.dateOfExpence==null){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.fill-all-fields");
      return;
    }

    this.updatingReportInProgress = true;
    this.loader.startLoading();

    let reportId = this.myExpenseReportsDetailsService.currentReport.id;

    this.myExpenseReportsDetailsService.updateExpenseReport(reportId, this.title, this.location, 
      this.myExpenseReportsDetailsService.dateOfExpence)
      .subscribe(
          (succ: GenericResponse<ExpenseReportDTO>)=>{
            this.loader.endLoading();
            this.notifier.notifySuccessWithI18nAndStandardTitle("message.save-completed")
            this.updatingReportInProgress = false;
            this.myExpenseReportsDetailsService.currentReport = succ.data;
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

  createExpenseReport(){
    if(this.creatingExpenseInProgress){
      return;
    }
    
    if(StringUtils.nullOrEmpty(this.title) || StringUtils.nullOrEmpty(this.location) || 
                  this.myExpenseReportsDetailsService.dateOfExpence==null){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.fill-all-fields");
      return;
    }

    if(StringUtils.nullOrEmpty(this.description) || this.amount==null || this.expenseReportElemFile==null){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.fill-all-fields");
      return;
    }

    if(this.amount<=0){
      this.notifier.notifyErrorWithI18nAndStandardTitle("message.bad-data");
      return;
    }

    this.creatingExpenseInProgress = true;
    this.loader.startLoading();


    this.myExpenseReportsDetailsService.createNewExpenseReport(this.title, this.location, 
      this.myExpenseReportsDetailsService.dateOfExpence)
      .subscribe(
        (succ: GenericResponse<ExpenseReportDTO>)=>{
          let generatedReport: ExpenseReportDTO = succ.data;
          this.notifier.notifySuccessWithI18nAndStandardTitle("message.expense-created");

          this.myExpenseReportsDetailsService.addNewExpenseReportDetails(
            generatedReport.id, this.description, this.amount, this.expenseReportElemFile)
            .subscribe(
              (event)=>{
                if (event.type === HttpEventType.UploadProgress) {
                  // This is an upload progress event. Compute and show the % done:
                  let percentDone = Math.round(100 * event.loaded / event.total);
    
                  if(percentDone > 1){
                    percentDone = percentDone - 1;
                  }
                  this.fileProgress = percentDone;
    
                } else if (event instanceof HttpResponse) {
                  this.fileProgress = 0;
                  this.creatingExpenseInProgress = false;
                  this.notifier.notifySuccessWithI18nAndStandardTitle("message.expense-report-details-added");
                  this.loader.endLoading();
                  this.expenseElemFileInput.resetForm();
                  this.myExpenseReportsDetailsService.resetExpenseReportElementData();
                  this.router.navigateByUrl("dashboard/myExpenseReportDetails/"+generatedReport.id);
                } 
              },
              (error: HttpErrorResponse) => {
                this.loader.endLoading();
                this.creatingExpenseInProgress = false;
                this.exceptionHandler.manageErrorWithLongChain(error.status);
                this.fileProgress = 0;
                this.router.navigateByUrl("dashboard/myExpenseReportDetails/"+generatedReport.id);
              }
            );

          
        },
        (error: HttpErrorResponse) =>{
          this.manageErrorOnExpenseReportCreation(error)
          this.creatingExpenseInProgress = false;
          this.loader.endLoading();
        }
      )


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
    return this.myExpenseReportsDetailsService.dateOfExpence;
  }

  onChangeDateOfExpence(event: MonthPickEvent){
    let parkDate = null;
    if(event!=null){
      parkDate = new Date(Date.UTC(event.year, event.month, event.day));
    }
    this.myExpenseReportsDetailsService.dateOfExpence = parkDate;
  }

  fileChoosedOnDetails(choosedFile: FileUploadEvent){
    if(choosedFile.files.length>0){
      this.expenseReportElemFile = choosedFile.files[0];
    }else{
      this.expenseReportElemFile = null;
    }
  }

  get status(){
    return this.myExpenseReportsDetailsService.status;
  }

  get title(){
    return this.myExpenseReportsDetailsService.title;
  }

  set title(value: string){
    this.myExpenseReportsDetailsService.title = value;
  }

  get location(){
    return this.myExpenseReportsDetailsService.location;
  }

  set location(value: string){
    this.myExpenseReportsDetailsService.location = value;
  }

  get description(){
    return this.myExpenseReportsDetailsService.description;
  }

  set description(value: string){
    this.myExpenseReportsDetailsService.description = value;
  }

  get amount(){
    return this.myExpenseReportsDetailsService.amount;
  }

  set amount(value: number){
    this.myExpenseReportsDetailsService.amount = value;
  }

  get notes(){
    if(this.myExpenseReportsDetailsService.currentReport!=null){
      return this.myExpenseReportsDetailsService.currentReport.notes;
    }
    return '';
  }


}
