import { Component, OnInit } from '@angular/core';
import { Inscripcion } from '../../../_models/inscripcion';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { InscripcionService } from '../../../_services/inscripcion.service';
import { AsistenciaAlumno } from '../../../_models/asistencia';
import { AsistenciaAlumnoService } from '../../../_services/asistencia_alumno.service';
import { ToastrService } from 'ngx-toastr';
import { AuxiliarFunction } from '../../../_helpers/auxiliar.function';

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
    public service:AsistenciaAlumnoService,
    public inscripcionService:InscripcionService,
    private toastr: ToastrService,
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

  descargar(item:AsistenciaAlumno){
    AuxiliarFunction.descargar(this.toastr,this.service.reporte_constancia(item.id));
  }

  imprimir(item:AsistenciaAlumno){
    AuxiliarFunction.imprimir(this.toastr,this.service.reporte_constancia(item.id));
  }

}
