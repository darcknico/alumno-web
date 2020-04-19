import { Component, OnInit } from '@angular/core';
import { ExamenAlumno } from '../../../_models/examen';
import { Inscripcion } from '../../../_models/inscripcion';
import { Subject } from 'rxjs';
import { InscripcionService } from '../../../_services/inscripcion.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ExamenAlumnoService } from '../../../_services/examen_alumno.service';
import { ToastrService } from 'ngx-toastr';
import { AuxiliarFunction } from '../../../_helpers/auxiliar.function';

@Component({
  selector: 'app-inscripcion-examen-modal',
  templateUrl: './inscripcion-examen-modal.component.html',
  styleUrls: ['./inscripcion-examen-modal.component.scss']
})
export class InscripcionExamenModalComponent implements OnInit {

  dataSource:ExamenAlumno[];
  dtOptions: DataTables.Settings = {};
  inscripcion:Inscripcion;
  public onClose: Subject<boolean>;

  constructor(
    public service:ExamenAlumnoService,
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
    this.inscripcionService.examenes(this.inscripcion.id).subscribe(response=>{
      this.dataSource = response;
    })
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

  descargar(item:ExamenAlumno){
    AuxiliarFunction.descargar(this.toastr,this.service.reporte_constancia(item.id));
  }

  imprimir(item:ExamenAlumno){
    AuxiliarFunction.imprimir(this.toastr,this.service.reporte_constancia(item.id));
  }

}
