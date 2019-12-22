import { Component, OnInit } from '@angular/core';
import { TipoCondicionAlumno } from '../../../_models/alumno';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MesaExamenMateriaAlumno } from '../../../_models/mesa.examen';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MesaExamenMateriaAlumnoService } from '../../../_services/mesa_examen_materia_alumno.service';
import { AlumnoService } from '../../../_services/alumno.service';

@Component({
  selector: 'app-mesa-materia-alumno-modal',
  templateUrl: './mesa-materia-alumno-modal.component.html',
  styleUrls: ['./mesa-materia-alumno-modal.component.scss']
})
export class MesaMateriaAlumnoModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  formulario: FormGroup;
  id:number=0;
  alumno:MesaExamenMateriaAlumno;
  condicionalidades:TipoCondicionAlumno[];

  constructor(
    public mesaExamenMateriaAlumnoService:MesaExamenMateriaAlumnoService,
    public alumnoService:AlumnoService,
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    ) {
      this.formulario = this.fb.group({
        asistencia:  null,
        nota: [ '', [Validators.min(0),Validators.max(10)]],
        nota_nombre:'',
        nota_final: [ '', [Validators.min(0),Validators.max(10)]],
        nota_final_nombre: '',
        id_tipo_condicion_alumno: [ '', Validators.required],
        observaciones: [ '', Validators.maxLength(255)],
        adeuda: false,
      });
    }

  onShow(alumno:MesaExamenMateriaAlumno){
    this.alumno = alumno;
    this.f.nota_nombre.disable();
    this.f.nota_final_nombre.disable();

    this.alumnoService.tipos_condicion().subscribe(response=>{
      this.condicionalidades = response;
    });
    this.onClose = new Subject();
    
    this.f.asistencia.setValue(this.alumno.asistencia);
    this.f.nota.setValue(this.alumno.nota);
    this.f.nota_nombre.setValue(this.alumno.nota_nombre);
    this.f.nota_final.setValue(this.alumno.nota_final);
    this.f.nota_final_nombre.setValue(this.alumno.nota_final_nombre);
    this.f.id_tipo_condicion_alumno.setValue(this.alumno.id_tipo_condicion_alumno);
    this.f.observaciones.setValue(this.alumno.observaciones);
    this.f.adeuda.setValue(this.alumno.adeuda);
  }
  ngOnInit() {
    
  }

  get f(){
    return this.formulario.controls;
  }

  confirmar(){
    if(!this.formulario.valid){
      return;
    }
    this.alumno.asistencia = this.f.asistencia.value;
    this.alumno.nota = this.f.nota.value;
    this.alumno.nota_final = this.f.nota_final.value;
    this.alumno.id_tipo_condicion_alumno = this.f.id_tipo_condicion_alumno.value;
    this.alumno.observaciones = this.f.observaciones.value;
    this.alumno.adeuda = this.f.adeuda.value;
    this.mesaExamenMateriaAlumnoService.update(this.alumno).subscribe(response=>{
      this.toastr.success('Alumno Editado', '');
      this.onClose.next(true);
      this.bsModalRef.hide();
    });
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
