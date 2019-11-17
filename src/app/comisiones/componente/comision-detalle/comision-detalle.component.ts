import { Component, OnInit, Input } from '@angular/core';
import { Comision } from '../../../_models/comision';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comision-detalle-component',
  templateUrl: './comision-detalle.component.html',
  styleUrls: ['./comision-detalle.component.scss']
})
export class ComisionDetalleComponent implements OnInit {

  @Input('collapsed') isCollapsed = false;
  @Input('comision') comision:Comision=null;
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }
  editar(){
    this.router.navigate(['/comisiones/'+this.comision.id+'/editar']);
  }

}
