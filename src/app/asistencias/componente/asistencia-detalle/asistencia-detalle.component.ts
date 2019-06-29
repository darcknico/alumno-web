import { Component, OnInit, Input } from '@angular/core';
import { Comision } from '../../../_models/comision';
import { Asistencia } from '../../../_models/asistencia';
import { ComisionService } from '../../../_services/comision.service';

@Component({
  selector: 'app-asistencia-detalle-component',
  templateUrl: './asistencia-detalle.component.html',
  styleUrls: ['./asistencia-detalle.component.scss']
})
export class AsistenciaDetalleComponent implements OnInit {
  @Input('collapsed') isCollapsed = false;
  @Input('asistencia') asistencia:Asistencia;
  comision:Comision=null;

  constructor(
    private comisionService:ComisionService,
  ) { }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.comisionService.sede(id_sede);
    this.comisionService.getById(this.asistencia.id_comision).subscribe(response=>{
      this.comision = response;
    });
  }

}
