import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { AlumnoService } from '../../_services/alumno.service';
import { InscripcionService } from '../../_services/inscripcion.service';
import { PlanPagoService } from '../../_services/plan_pago.service';
import { CarreraService } from '../../_services/carrera.service';
import { DiariaService } from '../../_services/diaria.service';
import { Diaria } from '../../_models/diaria';
import { Usuario } from '../../_models/usuario';
import { AuthenticationService } from '../../_services/authentication.service';
import { Chart } from 'chart.js';
import { HomeService } from '../../_services/home.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  id_sede:number;
  estadisticas_alumno:any;
  estadisticas_inscripcion:any;
  estadisticas_plan_pago:any;
  estadisticas_carrera:any;

  ultimas:Diaria[];
  usuario:Usuario;

  @ViewChild("barCanvas") barCanvas: ElementRef;
  @ViewChild("doughnutCanvas") doughnutCanvas: ElementRef;
  @ViewChild("lineCanvas") lineCanvas: ElementRef;

  private barChart: Chart;
  private doughnutChart: Chart;
  private lineChart: Chart;
  private resumen$:Observable<any>;

  constructor(
    private alumnoService:AlumnoService,
    private inscripcionService:InscripcionService,
    private planPagoService:PlanPagoService,
    private carreraService:CarreraService,
    private diariaService:DiariaService,
    private authenticationService:AuthenticationService,
    private homeService:HomeService,
  ){
    this.id_sede = +localStorage.getItem('id_sede');
    this.inscripcionService.sede(this.id_sede);

    this.alumnoService.estadisticas().subscribe(response=>{
      this.estadisticas_alumno = response;
    });
    this.inscripcionService.estadisticas().subscribe(response=>{
      this.estadisticas_inscripcion = response;
    });
    this.planPagoService.estadisticas().subscribe(response=>{
      this.estadisticas_plan_pago = response;
    });
    this.carreraService.estadisticas().subscribe(response=>{
      this.estadisticas_carrera = response;
    });
    this.diariaService.ultimos().subscribe(response=>{
      this.ultimas = response;
    });

    this.authenticationService.usuario$.subscribe((usuario:Usuario)=>{
      this.usuario = usuario;
    });
  }
  
  ngOnInit(): void {
    this.usuario = this.authenticationService.localUsuario();
    /*
    // generate random values for mainChart
    for (let i = 0; i <= this.mainChartElements; i++) {
      this.mainChartData1.push(this.random(50, 200));
      this.mainChartData2.push(this.random(80, 100));
      this.mainChartData3.push(65);
    }
    */

    moment.locale('es');
    this.homeService.estadisticas_pagos().subscribe((response:any)=>{
      let fechas = [];
      let montos = [];
      response.forEach(item => {
        fechas.push(item.fecha);
        montos.push(item.total);
      });
      this.barChart = new Chart(this.barCanvas.nativeElement, {
        type: "bar",
        data: {
          labels: fechas,
          datasets: [
            {
              data: montos,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
              ],
              borderColor: [
                "rgba(255,99,132,1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(255,99,132,1)",
                "rgba(54, 162, 235, 1)",
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Pagos de la ultima semana',
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItems, data) {
                let value = data.datasets[0].data[tooltipItems.index];
                let str;
                if (parseInt(value) >= 1000) {
                    str = '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                  str = '$' + value;
                }
                return moment(data.labels[tooltipItems.index]).format('dddd') + ' ' + str;
              }
            }
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  callback: function(value, index, values) {
                    if (parseInt(value) >= 1000) {
                       return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    } else {
                       return '$' + value;
                    }
                 }
                }
              }
            ],
            xAxes: [
              {
                type: 'time',
                time: {
                  parser: 'YYYY-MM-DD',
                  tooltipFormat: 'dddd DD',
                  unit: 'day',
                  unitStepSize: 1,
                  displayFormats: {
                    'day': 'DD/MM'
                  }
                }
              }
            ],
          }
        }
      });
    });

    this.homeService.estadisticas_carreras().subscribe((response:any)=>{
      let productos = [];
      let totales = [];
      response.forEach(item => {
        productos.push(item.nombre);
        totales.push(item.total);
      });
      this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
        type: "doughnut",
        data: {
          labels: productos,
          datasets: [
            {
              label: "# of Votes",
              data: totales,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF6384", "#36A2EB", "#FFCE56"]
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: 'Mas Inscripciones por carrera del corriente año',
          },
        }
      });
    });
    
    this.homeService.estadisticas_obligaciones().subscribe((response:any)=>{
      let fechas = [];
      let montos = [];
      response.forEach(item => {
        fechas.push(moment([item.anio,item.mes-1,1]));
        montos.push(item.total);
      });
      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: "line",
        data: {
          labels: fechas,
          datasets: [
            {
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: montos,
              spanGaps: false
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Proyección cuotas del corriente año',
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItems, data) {
                let value = data.datasets[0].data[tooltipItems.index];
                let str;
                if (parseInt(value) >= 1000) {
                    str = '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                  str = '$' + value;
                }
                return moment(data.labels[tooltipItems.index]).format('MMMM YYYY') + ' ' + str;
              }
            }
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  callback: function(value, index, values) {
                    if (parseInt(value) >= 1000) {
                       return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    } else {
                       return '$' + value;
                    }
                 }
                }
              }
            ],
            xAxes: [
              {
                type: 'time',
                time: {
                  tooltipFormat: 'MMMM',
                  unit: 'month',
                  unitStepSize: 1,
                  displayFormats: {
                    'month': 'MMM/YY'
                  }
                }
              }
            ],
          }
        },
      });
    });
  }
}
