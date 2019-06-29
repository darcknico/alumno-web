import { Component, OnInit } from '@angular/core';
import { ComisionAlumno } from '../../_models/comision';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComisionAlumnoService } from '../../_services/comision_alumno.service';
import { TipoCondicionAlumno } from '../../_models/alumno';
import { AlumnoService } from '../../_services/alumno.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comision-alumno-editar-modal',
  templateUrl: './comision-alumno-editar-modal.component.html',
  styleUrls: ['./comision-alumno-editar-modal.component.scss']
})
export class ComisionAlumnoEditarModalComponent implements OnInit {

  alumno: ComisionAlumno;
  formulario:FormGroup;
  condicionalidades:TipoCondicionAlumno[];

  public onClose: Subject<boolean>;

  constructor(
    private service:ComisionAlumnoService,
    private alumnoService:AlumnoService,
    public bsModalRef: BsModalRef,
    private fb:FormBuilder,
    private toastr: ToastrService,
    ) { 
    this.formulario = this.fb.group({
      nota:[null,[Validators.min(0),Validators.max(10)]],
      id_tipo_condicion_alumno:null,
      observaciones:null,
    });
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  get f(){
    return this.formulario.controls;
  }

  onShow(alumno:ComisionAlumno){
    this.alumnoService.tipos_condicion().subscribe(response=>{
      this.condicionalidades = response;
    });
    this.f.nota.setValue(alumno.nota);
    this.f.id_tipo_condicion_alumno.setValue(alumno.id_tipo_condicion_alumno);
    this.f.observaciones.setValue(alumno.observaciones);
    this.alumno = alumno;
  }

  confirmar(){
    if(!this.formulario.valid){
      return;
    }
    this.alumno.nota = this.f.nota.value;
    this.alumno.id_tipo_condicion_alumno = this.f.id_tipo_condicion_alumno.value;
    this.alumno.observaciones = this.f.observaciones.value;
    this.service.update(this.alumno).subscribe(response=>{
      this.toastr.success('Alumno editado', '');
      this.onClose.next(true);
      this.bsModalRef.hide();
    });
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}
