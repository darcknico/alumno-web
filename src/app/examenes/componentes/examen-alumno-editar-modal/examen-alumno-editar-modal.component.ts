import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { ExamenAlumno } from '../../../_models/examen';
import { TipoAsistenciaAlumno } from '../../../_models/asistencia';
import { AsistenciaService } from '../../../_services/asistencia.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-examen-alumno-editar-modal',
  templateUrl: './examen-alumno-editar-modal.component.html',
  styleUrls: ['./examen-alumno-editar-modal.component.scss']
})
export class ExamenAlumnoEditarModalComponent implements OnInit {
  
  alumno:ExamenAlumno;
  formulario:FormGroup;
  tipos:TipoAsistenciaAlumno[];
  public onClose: Subject<boolean>;

  constructor(
    private asistenciaService:AsistenciaService,
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    ) { 
      this.formulario = this.fb.group({
        id_tipo_asistencia_alumno:['',Validators.required],
        nota:'',
        observaciones:'',
      });
    }

  ngOnInit() {
    this.onClose = new Subject();
    this.asistenciaService.tipos().subscribe(response=>{
      this.tipos = response;
    });
  }

  get f(){
    return this.formulario.controls;
  }
  onShow(alumno:ExamenAlumno){
    this.alumno = alumno;
    this.f.id_tipo_asistencia_alumno.setValue(alumno.id_tipo_asistencia_alumno);
    this.f.nota.setValue(alumno.nota);
    this.f.observaciones.setValue(alumno.observaciones);
  }

  confirmar(){
    if(!this.formulario.valid){
      return;
    }
    this.alumno.id_tipo_asistencia_alumno = this.f.id_tipo_asistencia_alumno.value;
    this.alumno.nota = this.f.nota.value;
    this.alumno.observaciones = this.f.observaciones.value;
    
    this.onClose.next(true);
    this.bsModalRef.hide();

  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}
