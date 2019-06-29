import { Component, OnInit, Input } from '@angular/core';
import { Movimiento } from '../../../_models/movimiento';

@Component({
  selector: 'app-ingreso-component',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.scss']
})
export class IngresoComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  @Input('ingresos') dataSource:Movimiento[];
  
  constructor() { }

  ngOnInit() {
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      paging:false,
      searching:false,
      lengthChange:false,
      info:false,
      ordering:false,
    };
  }

}
