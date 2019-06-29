import { Component, OnInit, Input } from '@angular/core';
import { Movimiento } from '../../../_models/movimiento';

@Component({
  selector: 'app-egreso-component',
  templateUrl: './egreso.component.html',
  styleUrls: ['./egreso.component.scss']
})
export class EgresoComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  @Input('egresos') dataSource:Movimiento[];
  
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
