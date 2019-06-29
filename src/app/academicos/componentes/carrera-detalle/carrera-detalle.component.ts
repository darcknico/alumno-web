import { Component, OnInit, Input } from '@angular/core';
import { Carrera } from '../../../_models/carrera';
import { PlanEstudio } from '../../../_models/plan_estudio';

@Component({
  selector: 'app-componente-carrera-detalle',
  templateUrl: './carrera-detalle.component.html',
  styleUrls: ['./carrera-detalle.component.scss']
})
export class CarreraDetalleComponent implements OnInit {

  @Input('collapsed') isCollapsed = false;
  @Input('carrera') carrera:Carrera=null;
  @Input('plan_estudio') plan_estudio:PlanEstudio=null;

  constructor() { }

  ngOnInit() {
  }

}
