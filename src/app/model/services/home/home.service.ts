import { Injectable } from '@angular/core';
import { ResetableService } from '../resetable-service.model';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { BackendUrlsService } from '../../backend-urls.service';
import { RestDataSource } from '../../rest.datasource';
import { GenericResponse } from '../../dtos/generic-response.model';
import { HomeDTO } from '../../dtos/profile/home.dto';
import { map, catchError } from 'rxjs/operators';
import { DateUtils } from 'src/app/util/dates/date-utils';
import { CompletedTaskDTO } from '../../dtos/incarico/completed-task.dto';


@Injectable()
export class HomeService implements ResetableService {
    
    private dataAreLoaded: boolean = false;

    public home: HomeDTO = new HomeDTO();
    public completedTaskOfMonth: CompletedTaskDTO[] = [];

    /** A map of <string, number> where the string is the task code and the number the number of hours worked */
    public mapTaskCodeAndHours = new Map();

    private currentSelectedDay: Date = DateUtils.buildUTCDate();

    constructor(private datasource: RestDataSource, private backendUrlsSrv: BackendUrlsService,
                    private exceptionHandler: ChainExceptionHandler) { 
    }

    reset(): void {
        this.dataAreLoaded = false;
        this.currentSelectedDay = DateUtils.buildUTCDate();
        this.mapTaskCodeAndHours = new Map();
        this.completedTaskOfMonth = [];
    }   

    areDataLoaded(): boolean {
        return this.dataAreLoaded;
    }

    onResolveFailure(error: HttpErrorResponse): void {
    }


    loadInitialInformation(routeParams?: Params): Observable<any> {
        if(this.dataAreLoaded){
            return of(true);
        }

        let functionToCall = forkJoin(
                this.loadUserHome(),
                this.loadAllCompletedTasksOfMonth()
            )

        return Observable.create(
            (observer) => {

                functionToCall.subscribe(
                  (successful) => {
                      this.dataAreLoaded = true;
                      observer.next(true);
                      observer.complete(); 
                    }
                    ,error => {
                      this.dataAreLoaded = false;
                      this.exceptionHandler.manageErrorWithLongChain(error.status);
                      observer.next(false);
                      observer.complete();
                  }
                );
            }
        );
    }

    private loadUserHome(): Observable<GenericResponse<HomeDTO>>{
        return this.datasource.sendGetRequest<GenericResponse<HomeDTO>>(this.backendUrlsSrv.getHomeEndpoint())
        .pipe(
            map(
                (res: GenericResponse<HomeDTO>)=>{
                    this.home = res.data;

                    if(this.home!=null && this.home.lastUpdateDate!=null){
                        this.home.lastUpdateDate = DateUtils.buildDateFromStrOrDate(this.home.lastUpdateDate);
                    }

                    return res;
                }
            )
            ,catchError( 
                (err)=>{
                    return throwError(err); 
            })
        )
    }


    private buildMapTaskWorkHours(){
        this.mapTaskCodeAndHours = new Map();

        for(let i=0; i<this.completedTaskOfMonth.length; i++){
            let taskCode: string = this.completedTaskOfMonth[i].taskCode.taskCode;
            let registeredHours: number = this.completedTaskOfMonth[i].workedHours;
            
            let oldValue = this.mapTaskCodeAndHours.get(taskCode)

            if(oldValue==null){
                this.mapTaskCodeAndHours.set(taskCode, registeredHours);
            }else{
                this.mapTaskCodeAndHours.set(taskCode, oldValue + registeredHours);
            }
        }

        let descendingOrderedMap = new Map([...this.mapTaskCodeAndHours.entries()].sort(([k, v], [k2, v2])=> {
            if (v > v2) {
              return -1; //Descending order
            }
            if (v < v2) {
              return 1;
            }
            return 0; 
          }));

        this.mapTaskCodeAndHours = descendingOrderedMap;
    }

    
    private loadAllCompletedTasksOfMonth(): Observable<any>{
        let params = new HttpParams();
        params = params.append('month', this.currentSelectedDay.getUTCMonth()+'');
        params = params.append('year', this.currentSelectedDay.getUTCFullYear()+'');
    
        return this.datasource.sendGetRequest<GenericResponse<any>>(
          this.backendUrlsSrv.getFindCompletedTaskOfMonthEndpoint(), params, true)
            .pipe(
                map((response: GenericResponse<CompletedTaskDTO[]>) => {
                  this.completedTaskOfMonth = response.data;
    
                  for(let i=0; i<this.completedTaskOfMonth.length; i++){
                    this.completedTaskOfMonth[i].day = DateUtils.buildDateFromStrOrDate(this.completedTaskOfMonth[i].day);
                  }

                  this.buildMapTaskWorkHours();
    
                  return true;
              }),
              catchError((err) =>  {
                return throwError(err); 
              })
            );
      }

}