import { Component, OnInit } from '@angular/core';
import { Inscripcion } from '../../../_models/inscripcion';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { InscripcionService } from '../../../_services/inscripcion.service';
import { AsistenciaAlumno } from '../../../_models/asistencia';

@Component({
  selector: 'app-inscripcion-asistencia-modal',
  templateUrl: './inscripcion-asistencia-modal.component.html',
  styleUrls: ['./inscripcion-asistencia-modal.component.scss']
})
export class InscripcionAsistenciaModalComponent implements OnInit {

  dataSource:AsistenciaAlumno[];
  dtOptions: DataTables.Settings = {};
  inscripcion:Inscripcion;
  public onClose: Subject<boolean>;

  constructor(
    public inscripcionService:InscripcionService,
    public bsModalRef: BsModalRef,
  ) { 
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      searching:false,
      info:false,
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
    };
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  onShow(inscripcion:Inscripcion){
    this.inscripcion = inscripcion;
    this.inscripcionService.sede(this.inscripcion.id_sede);
    this.inscripcionService.asistencias(this.inscripcion.id).subscribe(response=>{
      this.dataSource = response;
    })
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
