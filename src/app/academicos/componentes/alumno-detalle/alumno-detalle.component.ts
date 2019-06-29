import { Component, OnInit, Input } from '@angular/core';
import { Alumno } from '../../../_models/alumno';

@Component({
  selector: 'app-componente-alumno-detalle',
  templateUrl: './alumno-detalle.component.html',
  styleUrls: ['./alumno-detalle.component.scss']
})
export class AlumnoDetalleComponent implements OnInit {

  @Input('collapsed') isCollapsed = false;
  @Input('alumno') alumno:Alumno=null;
  constructor() { }

  ngOnInit() {
  }

}
