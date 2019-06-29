import { Component, OnInit } from '@angular/core';
import { TipoCondicionAlumno } from '../../../_models/alumno';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MesaExamenMateriaAlumno } from '../../../_models/mesa.examen';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PlanEstudio } from '../../../_models/plan_estudio';
import { Materia } from '../../../_models/materia';
import { MesaExamenMateriaAlumnoService } from '../../../_services/mesa_examen_materia_alumno.service';
import { MesaExamenMateriaService } from '../../../_services/mesa_examen_materia.service';
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
        asistencia: [ '', Validators.required],
        nota: [ '', Validators.required],
        nota_nombre: [ '', Validators.required],
        id_tipo_condicion_alumno: [ '', Validators.required],
        observaciones: '',
      });
    }

  onShow(alumno:MesaExamenMateriaAlumno){
    this.alumno = alumno;
    
    let id_sede = +localStorage.getItem('id_sede');
    this.mesaExamenMateriaAlumnoService.sede(id_sede,this.alumno.id_mesa_examen_materia);

    this.alumnoService.tipos_condicion().subscribe(response=>{
      this.condicionalidades = response;
    });
    this.onClose = new Subject();
    
    this.f.asistencia.setValue(this.alumno.asistencia);
    this.f.nota.setValue(this.alumno.nota);
    this.f.nota_nombre.setValue(this.alumno.nota_nombre);
    this.f.id_tipo_condicion_alumno.setValue(this.alumno.id_tipo_condicion_alumno);
    this.f.observaciones.setValue(this.alumno.observaciones);
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
    var item = <MesaExamenMateriaAlumno>{}
    item.id = this.alumno.id;
    item.asistencia = this.f.asistencia.value;
    item.nota = this.f.nota.value;
    item.nota_nombre = this.f.nota_nombre.value;
    item.id_tipo_condicion_alumno = this.f.id_tipo_condicion_alumno.value;
    item.observaciones = this.f.observaciones.value;
    this.mesaExamenMateriaAlumnoService.update(item).subscribe(response=>{
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
