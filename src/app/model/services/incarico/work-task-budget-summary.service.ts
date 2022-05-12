import { Injectable } from '@angular/core';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { BackendUrlsService } from '../../backend-urls.service';
import { Router } from '@angular/router';
import { RestDataSource } from '../../rest.datasource';
import { Observable, forkJoin, throwError, map, catchError } from 'rxjs';
import { WorkTaskBudgetSummaryDTO } from '../../dtos/incarico/work-task-budget-summary.model';
import { GenericResponse } from '../../dtos/generic-response.model';
import { DateUtils } from 'src/app/util/dates/date-utils';

const DEFAULT_NUMBER_OF_DAYS_TO_VIEW = 30;

@Injectable()
export class WorkTaskBudgetSummaryService {

  dataAreLoaded: boolean = false;

  dateStartFilter: Date = null;
  dateEndFilter: Date = null;

  currentTaskId: number = null;

  workTaskSummary: WorkTaskBudgetSummaryDTO = null;
  totalExpenses: number = null;
  totalHrExpenses: number = null;
  residualBudget: number[] = [];
  humanCostCumulated: number[] = [];
  expensesCostCumulated: number[] = [];

  numberOfDaysToView: number = DEFAULT_NUMBER_OF_DAYS_TO_VIEW


  constructor(private exceptionHandler: ChainExceptionHandler, private backendUrlsSrv: BackendUrlsService,
    private datasource: RestDataSource, private router: Router) {

  }

  //this is called by DettagliIncaricoService
  resetTaskId(taskId: number) {
    this.currentTaskId = taskId;
    this.reset();
  }

  resetData(): void {
    this.workTaskSummary = null;
    this.totalExpenses = null;
    this.totalHrExpenses = null;
    this.residualBudget = [];
    this.humanCostCumulated = [];
    this.expensesCostCumulated = [];
  }

  //this is called by DettagliIncaricoService
  reset(): void {
    this.dataAreLoaded = false;
    this.numberOfDaysToView = DEFAULT_NUMBER_OF_DAYS_TO_VIEW
    this.resetFilters();
    this.resetData();
  }

  resetFilters() {
    this.dateStartFilter = null;
    this.dateEndFilter = null;
  }

  
  loadBudgetSummary(daysToView: number): Observable<boolean> {
    let currentDate = DateUtils.buildUTCDate();
    let initialDate = DateUtils.buildUTCDate();
    initialDate.setDate(initialDate.getDate() - daysToView);
    
    let request = {
      dateFrom: initialDate,
      dateTo: currentDate,
      binsForTheRange: 10,
      addExpensesReport: true,
      addHumanExpensesReport: true
    }
    
    return this.datasource.makePostJsonObjectForm<GenericResponse<WorkTaskBudgetSummaryDTO>>(
      this.backendUrlsSrv.getBudgetSummaryCreateUrl(this.currentTaskId + ''), request, true
    ).pipe(
      map((response: GenericResponse<WorkTaskBudgetSummaryDTO>) => {
        this.workTaskSummary = response.data;

        this.buildSupportVariables();
        this.dataAreLoaded = true;
        
        return true;
      }),
      catchError((err) => {
        this.dataAreLoaded = false;
        return throwError(err);
      })
    );
  }

  private buildSupportVariables(){
    this.totalExpenses = 0;
    this.totalHrExpenses = 0;
    this.residualBudget = [];
    this.humanCostCumulated = [];
    this.expensesCostCumulated = [];

    let currentTotalBudget: number = this.workTaskSummary.totalBudget;

    for(let i=0; i<this.workTaskSummary.expensesCostSummary.length && i<this.workTaskSummary.humanCostSummary.length; i++){
            
      this.totalExpenses = this.totalExpenses + this.workTaskSummary.expensesCostSummary[i];
      this.totalHrExpenses = this.totalHrExpenses + this.workTaskSummary.humanCostSummary[i];

      currentTotalBudget = this.workTaskSummary.totalBudget - (this.totalExpenses + this.totalHrExpenses)
      this.residualBudget[i] =  currentTotalBudget


      this.humanCostCumulated.push(this.totalHrExpenses)
      this.expensesCostCumulated.push(this.totalExpenses)
    }

  }

}
