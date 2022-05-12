import { Component, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  @ViewChild('barChart', { static: true }) 
  private chartRef;
  
  chart: any;


  constructor() { }
  

  ngOnInit()
  {
    let dataPoints = [12, 19, 3, 5, 2, 3];
    let dataPoints2 = [1, 9, 5, 3, 4, 3];
    let labels = ['Jun 2', 'Jun 5', 'Jun 8', 'Jun 11', 'Jun 14', 'Jun 17'];

    this.chart = new Chart(this.chartRef.nativeElement.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels, // your labels array
        datasets: [
          {
            label: 'Opened',
            backgroundColor: '#ed1c24a6',
            data: dataPoints, // your data array
            borderColor: '#28a7457d'
          },
          {
            label: 'Closed',
            backgroundColor: '#b6babd80',
            data: dataPoints2, // your data array
            borderColor: '#ffc1075e'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          x: {
            //beginAtZero: true,
            display: true
          },
          y: {
            display: true,
            // stacked: true
          },
        }
      }
    });


  }
}