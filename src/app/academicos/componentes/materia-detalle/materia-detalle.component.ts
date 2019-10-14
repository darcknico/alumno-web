import { Component, OnInit, Input } from '@angular/core';
import { Materia } from '../../../_models/materia';

@Component({
  selector: 'app-componente-materia-detalle',
  templateUrl: './materia-detalle.component.html',
  styleUrls: ['./materia-detalle.component.scss']
})
export class MateriaDetalleComponent implements OnInit {

  @Input('collapsed') isCollapsed = false;
  @Input('item') item:Materia=null;
  constructor() { }

  ngOnInit() {
  }

}
