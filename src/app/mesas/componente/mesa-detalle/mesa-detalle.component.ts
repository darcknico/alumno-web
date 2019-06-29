import { Component, OnInit, Input } from '@angular/core';
import { MesaExamen } from '../../../_models/mesa.examen';

@Component({
  selector: 'app-mesa-detalle-component',
  templateUrl: './mesa-detalle.component.html',
  styleUrls: ['./mesa-detalle.component.scss']
})
export class MesaDetalleComponent implements OnInit {

  @Input('collapsed') isCollapsed = false;
  @Input('mesa_examen')mesa_examen:MesaExamen;
  constructor() { }

  ngOnInit() {
  }

}
