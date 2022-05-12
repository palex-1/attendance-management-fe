import { Injectable } from '@angular/core';
import { Router, Params } from '@angular/router';
import { RestDataSource } from '../../rest.datasource';
import { BackendUrlsService } from '../../backend-urls.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { CompletedTaskDTO } from '../../dtos/incarico/completed-task.dto';
import { DayWorkedDetails } from 'src/app/dashboard/planner-giornaliero/planner-giornaliero.component';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { GenericResponse } from '../../dtos/generic-response.model';
import { map, catchError } from 'rxjs/operators';
import { DateUtils } from 'src/app/util/dates/date-utils';
import { UserAttendanceDTO } from '../../dtos/turnstile/user-attendance-dto.model';
import { ResetableService } from '../resetable-service.model';
import { Pair } from '../../objects/pair.model';

export class AttendanceOfDays {
    date: Date;
    hoursRegistered : number;
    sumHoursOfAttendance: number;
    userAttendance: UserAttendanceDTO[];
    notAValidAttendanceSequence: boolean;
}

@Injectable()
export class CompareAttendanceAndWorkedHours implements ResetableService {
    

    public completedTaskOfMonth: CompletedTaskDTO[] = [];

    mapOfDailyWorkedHours: Map<string, number> = new Map();
    userAttendanceOfMonth: UserAttendanceDTO[] = [];

    public currentSelectedMonth: number = null;
    public currentSelectedYear: number = null;

    currentEmployeeId: number = null;
    dataAreLoaded: boolean = false;

    public attendancesOfMonthLogs: AttendanceOfDays [] = [];



    constructor(private router: Router, private datasource: RestDataSource, 
                    private backendUlrsSrv: BackendUrlsService, private exceptionHandler: ChainExceptionHandler){
    }

    areDataLoaded(): boolean {
        return this.dataAreLoaded;
    }

    onResolveFailure(error: HttpErrorResponse): void {
    }

    reset(): void {
        this.attendancesOfMonthLogs = [];
        this.currentEmployeeId = null;
        this.dataAreLoaded = false;
        this.completedTaskOfMonth = [];
        this.currentSelectedMonth = null;
        this.currentSelectedMonth = null;
        this.mapOfDailyWorkedHours = new Map();
    }


    loadInitialInformation(routeParams: Params, forceReload: boolean = false): Observable<boolean> {
        if (this.dataAreLoaded && !forceReload && routeParams['idEmployee']==this.currentEmployeeId) {
            return of(true);
        }
    
        //if employee is different reset page old content
        if(routeParams['idEmployee']!=this.currentEmployeeId){
            this.reset();
        }
    
        this.currentEmployeeId = routeParams['idEmployee'];


        //retrive this data only when is requested in the component
        return of(true);
    }


    loadData(): Observable<any>{
      return Observable.create(
        (observer) => {
           forkJoin(
                this.loadAttendanceOfMonthForUser(),
                this.loadAllCompletedTasksOfMonth()
            )
            .subscribe(
              (successful) => {
                this.dataAreLoaded = true;
                observer.next(true);
                observer.complete();

                this.createDetailsCompletedTasksAndAttendance();
              },
              error => {
                this.dataAreLoaded = false;
                this.exceptionHandler.manageErrorWithLongChain(error.status);
                observer.next(false);
                observer.complete();
              }
            );
        }
      );
    }

    private createDetailsCompletedTasksAndAttendance(){
        this.attendancesOfMonthLogs = [];

        let monthDate = new Date(this.currentSelectedYear, this.currentSelectedMonth, 1);
        monthDate.setDate(1);

        let initialMonthNum: number = monthDate.getMonth();

        while(initialMonthNum==monthDate.getMonth()){
            let attendanceOfDay = new AttendanceOfDays();
            attendanceOfDay.date = new Date(monthDate);
            attendanceOfDay.hoursRegistered = 0;

            if(this.mapOfDailyWorkedHours.get(monthDate.getDate()+'')!=null){
                attendanceOfDay.hoursRegistered = this.mapOfDailyWorkedHours.get(monthDate.getDate()+'');
            }

            let attendances: UserAttendanceDTO[] = this.extractAttendanceOfDays(monthDate.getDate());
            attendanceOfDay.userAttendance = attendances;

            let userAttedancesStatus: Pair<number, boolean> = this.calculateUserAttendanceSum(attendances)
            attendanceOfDay.sumHoursOfAttendance = userAttedancesStatus.key;
            attendanceOfDay.notAValidAttendanceSequence = userAttedancesStatus.value;

            
            this.attendancesOfMonthLogs.push(attendanceOfDay);

            monthDate.setDate(monthDate.getDate() + 1);
        }
    }

    private calculateUserAttendanceSum(attendances: UserAttendanceDTO[]): Pair<number, boolean> {
        let sum = 0;
        let notAValidAttendanceSequence: boolean = false;

        let currentFirstEnterAttendance: Date = null;

        let timeToHoursQuantity = (1000*60*60);

        for(let i=0; i<attendances.length; i++){
            //if no
            if(currentFirstEnterAttendance==null){
                if(attendances[i].type=='ENTER'){
                    //the user enter so we can register enter
                    currentFirstEnterAttendance = attendances[i].timestamp;
                }else{
                    //if is an exit and no enter is a not valid sequence
                    notAValidAttendanceSequence = true;
                }

            }else{//if there is a previous enter attendance
                if(attendances[i].type=='ENTER'){
                    //the user seems to enter two times
                    notAValidAttendanceSequence = true;
                }else{ //is exit so we can calculate the time
                    
                    var hours = Math.abs(attendances[i].timestamp.getTime() - currentFirstEnterAttendance.getTime()) / timeToHoursQuantity;
                    sum =  sum + hours;

                    currentFirstEnterAttendance = null;
                }
            }
        }

        //if there is no exits
        if(currentFirstEnterAttendance!=null){
            notAValidAttendanceSequence = true;
        }

        return Pair.pairOf(sum, notAValidAttendanceSequence);
    }

    private extractAttendanceOfDays(day: number): UserAttendanceDTO[] {
        let attendanceOfDay: UserAttendanceDTO[] = [];

        for(let i=0; i<this.userAttendanceOfMonth.length; i++){
            if(this.userAttendanceOfMonth[i].timestamp.getDate()==day){
                attendanceOfDay.push(this.userAttendanceOfMonth[i]);
            }
        }

        //order by date ascending
        attendanceOfDay.sort( (x,y)=>{
            if(x.timestamp>y.timestamp){
                return 1;
            }
            if(x.timestamp<y.timestamp){
                return -1;
            }
            return 0;
        })

        return attendanceOfDay;
    }

     


    loadAttendanceOfMonthForUser(): Observable<any> {
        let params = new HttpParams();
        params = params.append('month', this.currentSelectedMonth+'');
        params = params.append('year', this.currentSelectedYear+'');
        params = params.append('userProfileId', this.currentEmployeeId+'');

        
        return this.datasource.sendGetRequest<GenericResponse<UserAttendanceDTO[]>>(
            this.backendUlrsSrv.getFindAllAttendanceOfMonthEndpoint(), params, true)
              .pipe(
                  map((response: GenericResponse<UserAttendanceDTO[]>) => {
                    this.userAttendanceOfMonth = response.data;

                    for(let i=0; i<this.userAttendanceOfMonth.length; i++){
                      this.userAttendanceOfMonth[i].timestamp = DateUtils.buildDateFromStrOrDate(this.userAttendanceOfMonth[i].timestamp);
                    }
      
                    return true;
                }),
                catchError((err) =>  {
                  return throwError(err); 
                })
              );
    }


    private loadAllCompletedTasksOfMonth(): Observable<any>{
        let params = new HttpParams();
        params = params.append('month', this.currentSelectedMonth+'');
        params = params.append('year', this.currentSelectedYear+'');
        params = params.append('userProfileId', this.currentEmployeeId+'');

        return this.datasource.sendGetRequest<GenericResponse<any>>(
          this.backendUlrsSrv.getFindUserCompletedTaskOfMonthEndpoint(), params, true)
            .pipe(
                map((response: GenericResponse<CompletedTaskDTO[]>) => {
                  this.completedTaskOfMonth = response.data;
    
                  for(let i=0; i<this.completedTaskOfMonth.length; i++){
                    this.completedTaskOfMonth[i].day = DateUtils.buildDateFromStrOrDate(this.completedTaskOfMonth[i].day);
                  }
    
                  this.recreateStructureOfWorkedDays();

                  return true;
              }),
              catchError((err) =>  {
                return throwError(err); 
              })
            );
      }
      
    private recreateStructureOfWorkedDays(){
        this.mapOfDailyWorkedHours = new Map();
    
        if(this.completedTaskOfMonth.length==0){
          return;
        }
    
        for(let i=0; i<this.completedTaskOfMonth.length; i++){

          //if is not an absence task add the worked hours
          if(this.completedTaskOfMonth[i].taskCode.isAbsenceTask!=true){
            let date = this.completedTaskOfMonth[i].day;
            let currentTask: CompletedTaskDTO = this.completedTaskOfMonth[i];
            
            let day = date.getUTCDate();
            let parkStr = day+'';
      
            let oldValue = this.mapOfDailyWorkedHours.get(parkStr);
      
            if(oldValue==null){
              let value = currentTask.workedHours
      
              this.mapOfDailyWorkedHours.set(parkStr, value);
            }else{
              let value =  oldValue + currentTask.workedHours;
  
              this.mapOfDailyWorkedHours.set(parkStr, value);
            }
          }
        }
    
      }

}