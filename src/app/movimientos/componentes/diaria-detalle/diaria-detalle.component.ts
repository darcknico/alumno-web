import { Component, OnInit, Input } from '@angular/core';
import { Diaria } from '../../../_models/diaria';

@Component({
  selector: 'app-diaria-detalle-component',
  templateUrl: './diaria-detalle.component.html',
  styleUrls: ['./diaria-detalle.component.scss']
})
export class DiariaDetalleComponent implements OnInit {

  @Input('diaria') diaria:Diaria;
  constructor() { }

  ngOnInit() {
  }

}
