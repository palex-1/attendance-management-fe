import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { EmployeePaycheckService } from 'src/app/model/services/impiegato/employee-paycheck.service';
import { PaginationEvent } from 'src/app/dashboard/components/custom-paginator/custom-paginator.component';
import { OrderEvent } from 'src/app/util/order-event.model';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { PaycheckDTO } from 'src/app/model/dtos/impiegato/paycheck-dto.model';
import { FileUploadEvent, FileInputUploadComponent } from 'src/app/dashboard/components/file-input-upload/file-input-upload.component';
import { MonthPickEvent, MonthpickerComponent } from 'src/app/dashboard/components/monthpicker/monthpicker.component';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { StandardErrorCode } from 'src/app/util/standard-error-code';
import { TicketDownloadService } from 'src/app/model/services/system/ticket-download.service';
import { TicketDownloadDTO } from 'src/app/model/dtos/ticket-download.dto';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';

declare const $: any;

@Component({
  selector: 'app-employee-paycheck',
  templateUrl: './employee-paycheck.component.html',
  styleUrls: ['./employee-paycheck.component.scss']
})
export class EmployeePaycheckComponent implements OnInit {
  
  @ViewChild('cedolinoFileModal', { static: true }) 
  cedolinoFileModal: ElementRef;

  @ViewChild('cedolinoFileInput', { static: true }) 
  cedolinoFileInput: FileInputUploadComponent;
  
  @ViewChild('paycheckUploadDate', { static: true }) 
  paycheckUploadDate: MonthpickerComponent;
  
  
  monthsNumber: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  public sortBy = new OrderEvent();

  private paycheckModalFile: File = null;
  private yearModalPaycheck: number = null;
  private monthModalPaycheck: number = null;
  titlePaycheckModal: string = '';
  fileProgress: number = 0;
  checkFiscalCode: boolean = false;
  forceAdd: boolean = false;

  uploadPaycheckInProgress: boolean = false;


  constructor(private loader: LoadingService, public authoritiesService: AuthoritiesService,
                private employeePaychecksService: EmployeePaycheckService, private notifier: MessageNotifierService,
                  private exceptionHandler: ChainExceptionHandler, private ticketDownloadService: TicketDownloadService,
                    private confirmer: CustomConfirmationService) { }

  ngOnInit(): void {
  }

  delete(paycheck: PaycheckDTO){
    let that = this;

    this.confirmer.askConfirmationWithStandardTitleI18nNoRejectCallback('message.sure-to-delete-paycheck', 
    ()=>{
      that.executePaycheckDelete(paycheck)
    })    
  }

  executePaycheckDelete(paycheck: PaycheckDTO){
    this.loader.startLoading();

    this.employeePaychecksService.deletePaycheck(paycheck)
    .subscribe(
      (succ: GenericResponse<TicketDownloadDTO>) => {
        this.loader.endLoading();
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.paycheck-successfully-deleted")
        this.refreshUserPaychecks();
      },
      (err:HttpErrorResponse)=>{
        this.exceptionHandler.manageErrorWithLongChain(err.status);
        this.loader.endLoading();
      }
    )
  }

  downloadPaycheck(paycheck: PaycheckDTO){
    this.loader.startLoading();

    this.employeePaychecksService.downloadPaycheck(paycheck)
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

  private clearUploadModal(){
    this.paycheckModalFile = null;
    this.yearModalPaycheck = null;
    this.monthModalPaycheck = null;
    this.titlePaycheckModal = '';
    this.checkFiscalCode = false;
    this.forceAdd = false;
    this.fileProgress = 0;
  }

  openUploadDialog(){
    this.paycheckUploadDate.resetComponent();
    this.cedolinoFileInput.resetForm();
    this.clearUploadModal();
    $(this.cedolinoFileModal.nativeElement).modal({backdrop: 'static', keyboard: false})
  }

  closeDialog(){
    if(this.uploadPaycheckInProgress){
      return;
    }
    $(this.cedolinoFileModal.nativeElement).modal('hide');
  }

  uploadPaycheck(){
    if(this.uploadPaycheckInProgress){
      return;
    }
    if(this.paycheckModalFile==null){
      this.notifier.notifyWarningWithI18nAndStandardTitle('message.select-an-upload-a-file');
      return;
    }

    if(this.monthModalPaycheck==null || this.yearModalPaycheck==null){
      this.notifier.notifyWarningWithI18nAndStandardTitle('message.select-month');
      return;
    }

    if(this.monthModalPaycheck<0 || this.yearModalPaycheck<0){
      this.notifier.notifyWarningWithI18nAndStandardTitle('message.bad-data');
      return;
    }

    this.uploadPaycheckInProgress = true;


    this.employeePaychecksService.uploadNewPaycheck(this.titlePaycheckModal, this.paycheckModalFile, this.monthModalPaycheck, 
                this.yearModalPaycheck, this.checkFiscalCode, this.forceAdd)
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
                this.fileProgress = 100;
                this.uploadPaycheckInProgress = false;
                this.notifier.notifySuccessWithI18nAndStandardTitle("message.paycheck-upload-completed");
                this.closeDialog();
              } 
            },
            (error:HttpErrorResponse) => {
              this.uploadPaycheckInProgress = false;
              this.manageErrorOnUploadPaycheck(error);
              this.uploadPaycheckInProgress = false;
              this.fileProgress = 0;
            }
        );
  }

  

  manageErrorOnUploadPaycheck(error: HttpErrorResponse) {
    let subcode = error.error.subcode;

    if(error.status==ChainExceptionHandler.CONFLICT_ERROR){
      if(subcode==StandardErrorCode.ALREADY_EXISTS_A_PAYOUT_IN_MONTH_AND_DATE){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.already-added-in-same-month-and-year-paycheck")
        return;
      }
    }

    if(error.status==ChainExceptionHandler.UNPROCESSABLE_ENTITY){
      if(subcode==StandardErrorCode.FISCAL_CODE_OF_USER_IS_NOT_FOUND_IN_PAYCHECK){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.check-piva-paycheck-failed");
        return;
      }
    }
    
    if(error.status==ChainExceptionHandler.BAD_DATA){
      if(subcode==StandardErrorCode.UNSUPPORTED_FILE_EXTENSIONS){
        this.notifier.notifyErrorWithI18nAndStandardTitle("message.unsupported-file-extension");
        return;
      }
    }

    this.exceptionHandler.manageErrorWithLongChain(error.status);
  }


  paycheckModalDateChanges(event: MonthPickEvent){
    if(event==null){
      this.yearModalPaycheck = null;
      this.monthModalPaycheck = null;
    }else{
      this.yearModalPaycheck = event.year;
      this.monthModalPaycheck = event.month;
    }
  }

  fileChoosedOnModal(choosedFile: FileUploadEvent){
    if(choosedFile.files.length>0){
      this.paycheckModalFile = choosedFile.files[0];
    }else{
      this.paycheckModalFile = null;
    }
  }

  hasAuthority(authority: string[]){
    return this.authoritiesService.hasAuthority(authority);
  }

  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  }

  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.employeePaychecksService.currentSortBy = event;
    this.refreshUserPaychecks();
  }

  filtersChanged(){
    this.refreshUserPaychecks();
  }
  
  getCurrentPageIndex(): number{
    return this.employeePaychecksService.pageIndex;
  }

  getTotalRecords(): number{
    return this.employeePaychecksService.totalElements;
  }

  getCurrentPageSize(): number{
    return this.employeePaychecksService.currentPageSize;
  }

  refreshUserPaychecks(){
    this.loader.startLoading();

    this.employeePaychecksService.realodPaychecks().subscribe(
      succ=>{
        this.loader.endLoading();
      },
      err=>{
        this.loader.endLoading();
      }
    );
  }

  resetFilters(){
    this.employeePaychecksService.resetFilters();
    this.refreshUserPaychecks();
  }

  changePage(event: PaginationEvent) {
    this.employeePaychecksService.pageIndex = event.selectedPage;
    this.employeePaychecksService.currentPageSize = event.pageSize;
    this.refreshUserPaychecks();
  }
  
  get paychecks(){
    return this.employeePaychecksService.currentLoadedData;
  }


  get yearFilter(){
    return this.employeePaychecksService.yearFilter;
  }

  set yearFilter(year: number){
    this.employeePaychecksService.yearFilter = year;
  }
  
  get monthFilter(){
    return this.employeePaychecksService.monthFilter;
  }

  set monthFilter(month: number){
    if(month+''==null || month+''==''){
      this.employeePaychecksService.monthFilter = null;
    }else{
      this.employeePaychecksService.monthFilter = month;
    }
    
  } 

  

}
