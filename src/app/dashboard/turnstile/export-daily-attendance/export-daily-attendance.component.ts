import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { GenericResponse } from 'src/app/model/dtos/generic-response.model';
import { TicketDownloadDTO } from 'src/app/model/dtos/ticket-download.dto';
import { TicketDownloadService } from 'src/app/model/services/system/ticket-download.service';
import { TurnstileService } from 'src/app/model/services/turnstile/turnstile.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { StringUtils } from 'src/app/util/string/string-utils';
import { MonthPickEvent } from '../../components/monthpicker/monthpicker.component';

declare const $: any;

@Component({
  selector: 'app-export-daily-attendance',
  templateUrl: './export-daily-attendance.component.html',
  styleUrls: ['./export-daily-attendance.component.scss']
})
export class ExportDailyAttendanceComponent implements OnInit {

  @ViewChild("modalRef", { static: true })
  modalRef: ElementRef;


  exportOperationInProgress: boolean = false;
  showLoaderInModal: boolean = false;
  
  private day: Date = null;
  currentDay: Date = null;
  amount: number = 0;
  zoneField: string = "Europe/Rome";

  constructor(private turnstileService: TurnstileService, private notifier: MessageNotifierService, 
                private exceptionHandler: ChainExceptionHandler, private ticketDownloadService: TicketDownloadService) { 
  }

  ngOnInit() {
  }

  resetData(){
    this.day = null;
    this.currentDay = null;
    this.zoneField = "Europe/Rome";
  }

  get showLoader(){
    return this.showLoaderInModal || this.exportOperationInProgress;
  }

  openDialog(){
    $(this.modalRef.nativeElement).modal({backdrop: 'static', keyboard: false})
  }

  private closeDialog(){
    $(this.modalRef.nativeElement).modal('hide');
  }

  closeExportDialog(){
    if(this.exportOperationInProgress){
      return;
    }
    this.resetData();
    this.closeDialog();
  }

  dayChanged(date: MonthPickEvent){
    if(date==null){
      this.day = null;
    }else{
      this.day = new Date(Date.UTC(date.year, date.month, date.day));
    }
    this.currentDay = this.day;
  }


  exportAttendances(){
    if(this.exportOperationInProgress){
      return;
    }
    
    if(this.day==null){
      this.notifier.notifyWarningWithI18nAndStandardTitle("message.please-choose-a-day");
      return;
    }

    if(StringUtils.nullOrEmpty(this.zoneField)){
      this.notifier.notifyWarningWithI18nAndStandardTitle("message.bad-data");
      return;
    }

    let exportRequest = {
      day: this.day,
      exportLocale: this.zoneField
    }

    this.exportOperationInProgress = true;

    this.turnstileService.exportAttendance(exportRequest)
      .subscribe(
        (succ: GenericResponse<TicketDownloadDTO>)=>{
          this.exportOperationInProgress = false;
          this.closeExportDialog();
          this.ticketDownloadService.executeFileDownloadWithBrowser(succ.data);
        },
        (err: HttpErrorResponse)=>{
          this.exceptionHandler.manageErrorWithLongChain(err.status);
          this.exportOperationInProgress = false;
        }
      )
  }

}
