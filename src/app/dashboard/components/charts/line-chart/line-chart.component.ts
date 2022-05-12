import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutPosition, ChartDataset } from 'chart.js';
import Chart from 'chart.js/auto';


export class LineChartData {
  public xLabels?: any[];
  public datasets: ChartDataset[];
}

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  @ViewChild('lineChart', { static: true }) 
  private chart: ElementRef;

  private lineChartData: LineChartData;

  constructor() { }

  ngOnInit(): void {
    
  }

  repaintChart(chartData: LineChartData, legendPosition: LayoutPosition, chartTitle: string){
    this.chart.nativeElement.innerHTML = '<canvas></canvas>';
    this.lineChartData = chartData;

    this.showChart(this.lineChartData, legendPosition, chartTitle);
  }

  showChart(chartData: LineChartData, legendPosition: LayoutPosition, chartTitle: string) {
    let displayTitle: boolean = false;
    if(chartTitle!=null){
      displayTitle = true
    }

    let chartP = new Chart(this.chart.nativeElement.children[0].getContext('2d'), {
      type: 'line',
      data: {
        datasets: chartData.datasets,

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: chartData.xLabels
      },
      options: {
        interaction: {
          mode: 'index',
          intersect: false,
        },
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false,
            text: chartTitle+''
          },
          legend: {
            display: true,
            position: legendPosition
          }
        }

      }
    });
  }
}
