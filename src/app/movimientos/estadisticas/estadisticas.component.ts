import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MovimientoService, FiltroMovimiento } from '../../_services/movimiento.service';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { AlumnoService } from '../../_services/alumno.service';
import { SedeService } from '../../_services/sede.service';
import { Sede } from '../../_models/sede';
import { UsuarioSede } from '../../_models/usuario';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit {
  sede:UsuarioSede;
  $planes:Observable<any>;
  $mensual:Observable<any>;
  @ViewChild("ingresosDoughnutCanvas") ingresosDoughnutCanvas: ElementRef;
  @ViewChild("egresosDoughnutCanvas") egresosDoughnutCanvas: ElementRef;
  @ViewChild("barCanvas") barCanvas: ElementRef;

  hoy;
  backgroundColor = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 159, 64, 0.2)",
  ];
  hoverBackgroundColor = ["#FF6384", "#36A2EB", "#FFCE56", "#FF6384", "#36A2EB", "#FFCE56"];

  request = <FiltroMovimiento>{
    length:7,
  };
  
  constructor(
    private sedeService:SedeService,
    private alumnoService:AlumnoService,
    private movimientoService:MovimientoService,
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.hoy = moment();
    this.sede = this.sedeService.getSede();
    this.$planes = this.alumnoService.estadisticas_planes();
    this.request.fecha_fin = this.hoy.format('YYYY-MM-DD');
    this.request.fecha_inicio = this.hoy.subtract(1,'months').format('YYYY-MM-DD');

    this.request.id_tipo_egreso_ingreso = 1;
    this.$mensual = this.movimientoService.estadisticas_mensual(this.request);
    this.refrescar();
  }

  refrescar(){
    this.request.id_tipo_egreso_ingreso = 1;
    this.request.length = 7;
    this.movimientoService.estadisticas_tipo(this.request).subscribe((response:any)=>{
      let label = [];
      let data = [];
      response.forEach(item => {
        label.push(item.nombre);
        data.push(item.total);
      });
      this.ingresosDoughnutCanvas = new Chart(this.ingresosDoughnutCanvas.nativeElement, {
        type: "pie",
        data: {
          labels: label,
          datasets: [
            {
              label: "# of Votes",
              data: data,
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
            text: 'Ranking tipos de Ingresos',
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
                return data.labels[tooltipItems.index] + ' ' + str;
              }
            }
          },
        }
      });
    });
    this.request.id_tipo_egreso_ingreso = 0;
    this.movimientoService.estadisticas_tipo(this.request).subscribe((response:any)=>{
      let label = [];
      let data = [];
      response.forEach(item => {
        label.push(item.nombre);
        data.push(item.total);
      });
      this.egresosDoughnutCanvas = new Chart(this.egresosDoughnutCanvas.nativeElement, {
        type: "pie",
        data: {
          labels: label,
          datasets: [
            {
              label: "# of Votes",
              data: data,
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
            text: 'Ranking tipos de Egresos',
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
                return data.labels[tooltipItems.index] + ' ' + str;
              }
            }
          },
        }
      });
    });

    this.movimientoService.estadisticas_diaria(this.request).subscribe((response:any)=>{
      let label = [];
      let data1 = [];
      let data2 = [];
      response.forEach(item => {
        label.push(item.fecha);
        data1.push(item.total_ingresos);
        data2.push(item.total_egresos);
      });
      this.barCanvas = new Chart(this.barCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: label,
          datasets: [
            {
              label: "Ingresos",
              backgroundColor: "#3e95cd",
              data: data1
            }, {
              label: "Egresos",
              backgroundColor: "#8e5ea2",
              data: data2
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: 'Movimientos por Dia'
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
                return moment(data.labels[tooltipItems.index]).format('DD/MM') + ' ' + str;
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
                  tooltipFormat: 'DD/MMMM',
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
  }
}
