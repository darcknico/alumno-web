import { Component, OnInit, Input } from '@angular/core';
import { Comision } from '../../../_models/comision';

@Component({
  selector: 'app-comision-detalle-component',
  templateUrl: './comision-detalle.component.html',
  styleUrls: ['./comision-detalle.component.scss']
})
export class ComisionDetalleComponent implements OnInit {

  @Input('collapsed') isCollapsed = false;
  @Input('comision') comision:Comision=null;
  constructor() { }

  ngOnInit() {
  }

}
