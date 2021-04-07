import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Chart } from 'chart.js';


export class PieChartData {
  public data : number[];
  public backgroundColor : string[];
  public backgroundColorLabels : string[]
}

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  
  @ViewChild('pieChart', { static: true }) 
  private chart: ElementRef;

  private pieChartData: PieChartData;

  constructor() { }

  ngOnInit(): void {
  }

  repaintPie(chartData: PieChartData, legendPosition: string, chartTitle: string){
    this.chart.nativeElement.innerHTML = '<canvas></canvas>';
    this.pieChartData = chartData;

    this.showPie(this.pieChartData, legendPosition, chartTitle);
  }

  showPie(chartData: PieChartData, legendPosition: string, chartTitle: string){
    
    let chartP = new Chart(this.chart.nativeElement.children[0].getContext('2d'), {
      type: 'pie',
      data: {
            fill: true,
            datasets: [{
                data: chartData.data,
                backgroundColor: chartData.backgroundColor,
            }],

          // These labels appear in the legend and in the tooltips when hovering different arcs
          labels: chartData.backgroundColorLabels
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: chartTitle
        },
        legend: {
          display: true,
          position: legendPosition
        }
      }
  });
  }

}
