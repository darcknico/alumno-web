import { Component, OnInit, Input } from '@angular/core';
import { Docente } from '../../../_models/usuario';

@Component({
  selector: 'app-componente-docente-detalle',
  templateUrl: './docente-detalle.component.html',
  styleUrls: ['./docente-detalle.component.scss']
})
export class DocenteDetalleComponent implements OnInit {

  @Input('collapsed') isCollapsed = false;
  @Input('item') item:Docente=null;
  constructor() { }

  ngOnInit() {
  }
}
