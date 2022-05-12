import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LayoutPosition } from 'chart.js';
import { LoadingService } from 'src/app/dialogs/loading/loading.service';
import { WorkTaskBudgetSummaryService } from 'src/app/model/services/incarico/work-task-budget-summary.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { DateFormatPipe } from 'src/app/util/pipes/date-format.pipe';
import { LineChartComponent, LineChartData } from '../../components/charts/line-chart/line-chart.component';

@Component({
  selector: 'app-work-task-budget-summary',
  templateUrl: './work-task-budget-summary.component.html',
  styleUrls: ['./work-task-budget-summary.component.scss']
})
export class WorkTaskBudgetSummaryComponent implements OnInit, AfterViewInit {

  @ViewChild("lineChartRef", { static: true })
  lineChartRef: LineChartComponent;

  legendPosition: LayoutPosition = 'top';

  chartData: LineChartData;

  constructor(private workTaskBudgetSummaryService: WorkTaskBudgetSummaryService, private dateFormat: DateFormatPipe,
                private exceptionHandler: ChainExceptionHandler, private translate: TranslateService,
                  private loader: LoadingService) {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    if(this.workTaskBudgetSummaryService.dataAreLoaded===false){
      this.reloadBudgetSummary();
    }else{
      this.repaintGraph();
    }
  }

  reloadBudgetSummary() {
    this.loader.startLoading();

    this.workTaskBudgetSummaryService.loadBudgetSummary(this.daysToView).subscribe(
      (succ: boolean) => {
        this.repaintGraph();
        this.loader.endLoading();
      },
      (error) => {
        this.exceptionHandler.manageErrorWithLongChain(error.status);
        this.loader.endLoading();
      }
    );
  }

  repaintGraph() {
    let labels = [];

    this.workTaskBudgetSummaryService.workTaskSummary.temporalRangeBinSummary.forEach(
      bin => {
        labels.push(
            this.dateFormat.transform(bin.dateEnd, 'short')
          )
      }
    )
    
    let datasetResidualBudget = this.buildChartDataset(
      this.translate.instant("label.residual-budget"),
      this.workTaskBudgetSummaryService.residualBudget,
      'rgb(255, 205, 51, 0.8)'
    )

    let datasetTotalExpenses = this.buildChartDataset(
      this.translate.instant("label.expenses"),
      this.workTaskBudgetSummaryService.expensesCostCumulated,
      'rgb(54, 162, 235, 0.8)'
    )

    let dataseTotalHrCost = this.buildChartDataset(
      this.translate.instant("label.total-hr-costs"),
      this.workTaskBudgetSummaryService.humanCostCumulated,
      'rgb(255, 99, 132, 0.8)'
    )

    let chartData: LineChartData = new LineChartData();
    chartData.datasets = [datasetResidualBudget, datasetTotalExpenses, dataseTotalHrCost]
    chartData.xLabels = labels


    this.lineChartRef.repaintChart(chartData, this.legendPosition, null);
  }

  private buildChartDataset(title, data, color) {
    let dataset = {
      label: title,
      data: data,
      fill: false,
      borderColor: color,
      tension: 0.1
    }

    return dataset
  }

  get taskCreationDays(){
    if (this.workTaskBudgetSummaryService.workTaskSummary == null || this.workTaskBudgetSummaryService.workTaskSummary.taskCreationDays == null) {
      return 0;
    }
    return this.workTaskBudgetSummaryService.workTaskSummary.taskCreationDays;
  }

  get daysToView() {
    return this.workTaskBudgetSummaryService.numberOfDaysToView;
  }

  set daysToView(days: number) {
    this.workTaskBudgetSummaryService.numberOfDaysToView = days;

    this.reloadBudgetSummary();
  }

  get totalBudget() {
    if (this.workTaskBudgetSummaryService.workTaskSummary == null || this.workTaskBudgetSummaryService.workTaskSummary.totalBudget == null) {
      return null;
    }
    return this.workTaskBudgetSummaryService.workTaskSummary.totalBudget;
  }

  get residualBudget() {
    if (this.workTaskBudgetSummaryService.residualBudget == null || this.workTaskBudgetSummaryService.residualBudget.length == 0) {
      return null;
    }
    return this.workTaskBudgetSummaryService.residualBudget[this.workTaskBudgetSummaryService.residualBudget.length - 1];
  }

  get totalExpenses() {
    if (this.workTaskBudgetSummaryService.totalExpenses == null) {
      return null;
    }
    return this.workTaskBudgetSummaryService.totalExpenses;
  }

  get totalHrCost() {
    if (this.workTaskBudgetSummaryService.totalHrExpenses == null) {
      return null;
    }
    return this.workTaskBudgetSummaryService.totalHrExpenses;
  }

}
