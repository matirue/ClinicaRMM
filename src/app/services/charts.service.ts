import { Injectable } from '@angular/core';
import CanvasJS from 'canvasjs';
import html2canvas from 'html2canvas';
import { Chart } from 'angular-highcharts';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {

  options: any;

  constructor() {}

  agregarChart(chart: Chart){
    this.options = {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Linechart'
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: 'Line 1',
          data: [1, 2, 3]
        }
      ]
    }

    chart = new Chart(
      this.options
    )
  }
}
