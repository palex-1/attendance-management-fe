import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CompareAttendanceAndWorkedHours, AttendanceOfDays } from 'src/app/model/services/impiegato/compare-attendance-and-worked-hours.service';
import { MonthPickEvent } from 'src/app/dashboard/components/monthpicker/monthpicker.component';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { UserAttendanceDTO } from 'src/app/model/dtos/turnstile/user-attendance-dto.model';

declare const $: any;

@Component({
  selector: 'app-employee-attendances-info',
  templateUrl: './employee-attendances-info.component.html',
  styleUrls: ['./employee-attendances-info.component.scss']
})
export class EmployeeAttendancesInfoComponent implements OnInit {

  @ViewChild("attedancesModal", { static: true })
  attedancesModal: ElementRef;

  loadingData: boolean = false;

  currentAttendances: UserAttendanceDTO[] = [];

  private currentSelectedDate: Date = null;

  constructor(private compareAttendanceAndWorkedHours: CompareAttendanceAndWorkedHours,
    private loader: LoadingService, private exceptionHandler: ChainExceptionHandler) { 

  }



  ngOnInit(): void {
  }

  get initialSelectedDate(): Date{
    if(this.currentSelectedDate!=null){
      return this.currentSelectedDate;
    }

    if(this.compareAttendanceAndWorkedHours.currentSelectedMonth == null || 
            this.compareAttendanceAndWorkedHours.currentSelectedYear==null){
        return null;
    }
    this.currentSelectedDate = new Date(this.compareAttendanceAndWorkedHours.currentSelectedYear, 
                this.compareAttendanceAndWorkedHours.currentSelectedMonth + 1, 1);
    
    return this.currentSelectedDate;
  }

  private openDialog(){
    $(this.attedancesModal.nativeElement).modal()
  }

  closeDialog(){
    $(this.attedancesModal.nativeElement).modal('hide');
  }


  get choosedDate(): boolean {
    if(this.compareAttendanceAndWorkedHours.currentSelectedYear == null ||
          this.compareAttendanceAndWorkedHours.currentSelectedMonth == null){
      return false;
    }
    return true;
  }

  dateChanges(event: MonthPickEvent) {
    if (event == null) {
      this.compareAttendanceAndWorkedHours.currentSelectedYear = null;
      this.compareAttendanceAndWorkedHours.currentSelectedMonth = null;
    } else {
      this.compareAttendanceAndWorkedHours.currentSelectedYear = event.year;
      this.compareAttendanceAndWorkedHours.currentSelectedMonth = event.month;
      this.loadAttendance();
    }
  }


  loadAttendance() {
    if (this.loadingData) {
      return;
    }
    this.loader.startLoading();

    this.loadingData = true;

    this.compareAttendanceAndWorkedHours.loadData().subscribe(
      (succ) => {
        this.loader.endLoading();
        this.loadingData = false;
      },
      err => {
        this.exceptionHandler.manageErrorWithLongChain(err.status);
        this.loader.endLoading();
        this.loadingData = false;
      }
    )
  }

  get attendanceLogs(): AttendanceOfDays[]{
    if(this.compareAttendanceAndWorkedHours.attendancesOfMonthLogs==null){
      return [];
    }
    return this.compareAttendanceAndWorkedHours.attendancesOfMonthLogs;
  }

  getBackgroundColorForAttendance(attendance: AttendanceOfDays): string{
    if(attendance.hoursRegistered==0){
      return null;
    }

    if(attendance.hoursRegistered>=attendance.sumHoursOfAttendance){
      return '#ff6384';
    }else{
      return '#4bc0c0'
    }
  }

  openDetails(attendance: AttendanceOfDays){
    this.currentAttendances = attendance.userAttendance;

    if(this.currentAttendances==null){
      this.currentAttendances = [];
    }

    this.openDialog();    
  }


}
