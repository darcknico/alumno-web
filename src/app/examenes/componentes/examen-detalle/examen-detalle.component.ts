import { Component, OnInit, Input } from '@angular/core';
import { Examen } from '../../../_models/examen';
import { Comision } from '../../../_models/comision';
import { ComisionService } from '../../../_services/comision.service';

@Component({
  selector: 'app-examen-detalle-component',
  templateUrl: './examen-detalle.component.html',
  styleUrls: ['./examen-detalle.component.scss']
})
export class ExamenDetalleComponent implements OnInit {
  @Input('collapsed') isCollapsed = false;
  @Input('examen') examen:Examen;
  comision:Comision=null;

  constructor(
    private comisionService:ComisionService,
  ) { }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.comisionService.sede(id_sede);
    this.comisionService.getById(this.examen.id_comision).subscribe(response=>{
      this.comision = response;
    });
  }

}
