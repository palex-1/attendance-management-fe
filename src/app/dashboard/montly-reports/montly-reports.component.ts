import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { ReportsService } from 'src/app/model/services/reports/reports.service';
import { AuthoritiesService } from 'src/app/model/services/auth/authorities.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { OrderEvent } from 'src/app/util/order-event.model';
import { PaginationEvent } from '../components/custom-paginator/custom-paginator.component';
import { ReportDTO } from 'src/app/model/dtos/reports/report-dto.model';
import { TicketDownloadDTO } from 'src/app/model/dtos/ticket-download.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { TicketDownloadService } from 'src/app/model/services/system/ticket-download.service';
import { MonthpickerComponent, MonthPickEvent } from '../components/monthpicker/monthpicker.component';
import { CustomConfirmationService } from 'src/app/dialogs/confirmation/custom-confirmation.service';

declare const $: any;

@Component({
  selector: 'app-montly-reports',
  templateUrl: './montly-reports.component.html',
  styleUrls: ['./montly-reports.component.scss']
})
export class MontlyReportsComponent implements OnInit {
  
  @ViewChild('monthlyReportModal', { static: false }) 
  monthlyReportModal: ElementRef;

  @ViewChild('reportModalDetails', { static: false }) 
  reportModalDetails: ElementRef;
  
  @ViewChild('monthPickerModal', { static: false }) 
  monthPickerModal: MonthpickerComponent;

  
  public sortBy = new OrderEvent();

  generatingReport: boolean = false;

  selectedYear: number = null;
  selectedMonth: number = null;

  yearDetailsModal: number = null
  monthDetailsModal: number = null;
  statusDetailsModal: string = '';
  logsDetailsModal: string = '';
  deletedDetaildModal: boolean = null;

  constructor(private reportService: ReportsService, private authoritiesService: AuthoritiesService, 
                private exceptionHandler: ChainExceptionHandler, private notifier: MessageNotifierService,
                  private loader: LoadingService, private ticketDownloadService: TicketDownloadService,
                    private confirmer: CustomConfirmationService) {

  }

  ngOnInit(): void {
  }

  openCreateDialog(){
    this.selectedMonth = null;
    this.selectedYear = null;
    this.monthPickerModal.resetComponent();
    $(this.monthlyReportModal.nativeElement).modal({backdrop: 'static', keyboard: false})
  }

  closeDialog(){
    if(this.generatingReport){
      return;
    }
    $(this.monthlyReportModal.nativeElement).modal('hide');
  }

  generateReport(){
    if(this.generatingReport){
      return;
    }

    if(this.selectedMonth==null || this.selectedYear==null){
      this.notifier.notifyWarningWithI18nAndStandardTitle('message.select-month');
      return;
    }
    if(this.selectedMonth<0 || this.selectedYear<0){
      this.notifier.notifyWarningWithI18nAndStandardTitle('message.bad-data');
      return;
    }

    this.generatingReport = true;

    this.reportService.generateReport(this.selectedMonth, this.selectedYear).subscribe(
      (succ: GenericResponse<ReportDTO>)=>{
        this.generatingReport = false;
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.generation-report-request-added");
        this.closeDialog();
      },
      (err)=>{
        this.exceptionHandler.manageErrorWithLongChain(err.status);
        this.generatingReport = false;
      }
    )

  }

  canBeDownloaded(report: ReportDTO){
    return report.status=='COMPLETED';
  }

  canBeDeleted(report: ReportDTO){
    return report.status=='COMPLETED' || report.status=='ERROR';
  }

  delete(report: ReportDTO){
    let that = this;

    this.confirmer.askConfirmationWithStandardTitleI18nNoRejectCallback('message.sure-to-delete-report', 
    ()=>{
      that.executeReportDelete(report)
    })
  }

  executeReportDelete(report: ReportDTO){
    this.loader.startLoading();

    this.reportService.deleteReport(report)
    .subscribe(
      (succ: GenericResponse<ReportDTO>) => {
        this.loader.endLoading();
        this.notifier.notifySuccessWithI18nAndStandardTitle("message.report-deleted")
        this.refreshReports();
      },
      (err:HttpErrorResponse)=>{
        this.exceptionHandler.manageErrorWithLongChain(err.status);
        this.loader.endLoading();
      }
    )
  }

  openDialogDetails(report: ReportDTO){
    this.yearDetailsModal = report.year;
    this.monthDetailsModal = report.month + 1;
    this.statusDetailsModal = report.status;
    this.logsDetailsModal = report.logs;
    this.deletedDetaildModal = report.deleted;

    $(this.reportModalDetails.nativeElement).modal()
  }

  closeDialogDetails(){
    $(this.reportModalDetails.nativeElement).modal('hide');
  }

  getMonthValue(month: number){
    let park = month + 1;
    if(month<10){
      return '0'+park;
    }
    return park;
  }
 

  reportModalDateChanges(event: MonthPickEvent){
    if(event==null){
      this.selectedYear = null;
      this.selectedMonth = null;
    }else{
      this.selectedYear = event.year;
      this.selectedMonth = event.month;
    }
  }

  download(report: ReportDTO){
    this.loader.startLoading();

    this.reportService.downloadReport(report)
    .subscribe(
      (succ: GenericResponse<TicketDownloadDTO>) => {
        this.loader.endLoading()
        this.ticketDownloadService.executeFileDownloadWithBrowser(succ.data);
      },
      (err:HttpErrorResponse)=>{
        this.loader.endLoading()
        this.exceptionHandler.manageErrorWithLongChain(err.status);
      }
    )
  }

  hasAuthority(authority: string[]){
    return this.authoritiesService.hasAuthority(authority);
  }

  get initialSelectedPage(){
    return this.getCurrentPageIndex();
  }
  
  onSortChange(event: OrderEvent){
    this.sortBy = event;
    this.reportService.currentSortBy = event;
    this.refreshReports();
  }
  
  resetFilters(){
    this.reportService.resetFilters();
    this.refreshReports();
  }

  filtersChanged(){
    this.refreshReports();
  }
  
  getCurrentPageIndex(): number{
    return this.reportService.pageIndex;
  }

  getTotalRecords(): number{
    return this.reportService.totalElements;
  }

  getCurrentPageSize(): number{
    return this.reportService.currentPageSize;
  }

  refreshReports(){
    this.loader.startLoading();

    this.reportService.realodAllReports().subscribe(
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
    this.reportService.pageIndex = event.selectedPage;
    this.reportService.currentPageSize = event.pageSize;
    this.refreshReports();
  }
  
  
  get reports(): ReportDTO[]{
    return this.reportService.currentLoadedData;
  }


  get yearFilter(){
    return this.reportService.yearFilter;
  }

  set yearFilter(value: number){
    this.reportService.yearFilter = value;
  }

  get monthFilter(){
    return this.reportService.monthFilter;
  }

  set monthFilter(value: number){
    this.reportService.monthFilter = value;
  }

  get includeDeletedFilter(){
    return this.reportService.includeDeletedFilter;
  }

  set includeDeletedFilter(value: boolean){
    if(value==null || value+''=='null' || value+''==''){
      this.reportService.includeDeletedFilter = null;
    }else{
      this.reportService.includeDeletedFilter = value;
    }
  }

  showDeletedColumn(){
    return this.reportService.includeDeletedFilter==true;
  }
}
