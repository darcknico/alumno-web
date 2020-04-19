import { Component, OnInit } from '@angular/core';
import { MateriaService } from '../../../_services/materia.service';
import { Inscripcion } from '../../../_models/inscripcion';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { InscripcionService } from '../../../_services/inscripcion.service';
import { AlumnoMateriaNota } from '../../../_models/mesa.examen';
import * as moment from 'moment';
import { Materia } from '../../../_models/materia';
import { TipoCondicionAlumno } from '../../../_models/alumno';
import { AlumnoService } from '../../../_services/alumno.service';

@Component({
  selector: 'app-alumno-materia-nota-modal',
  templateUrl: './alumno-materia-nota-modal.component.html',
  styleUrls: ['./alumno-materia-nota-modal.component.scss']
})
export class AlumnoMateriaNotaModalComponent implements OnInit {

  id:number = 0;
  public onClose: Subject<boolean>;
  formulario: FormGroup;
  inscripcion: Inscripcion;
  alumno_materia_nota:AlumnoMateriaNota;
  titulo:string;
  materias:Materia[];
  condicionalidades:TipoCondicionAlumno[];

  constructor(
    private inscripcionService:InscripcionService,
    private materiaService:MateriaService,
    private alumnoService:AlumnoService,
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { 
    this.formulario = this.fb.group({
      id_materia: [ '', Validators.required],
      nota: [ '', Validators.required],
      nota_nombre: [ '', Validators.required],
      id_tipo_condicion_alumno: [ '', Validators.required],
      fecha: [ '', Validators.required],
      libro: '',
      folio: '',
      observaciones: '',
    });
  }

  onShow(inscripcion:Inscripcion,alumno_materia_nota:AlumnoMateriaNota = null){
    this.inscripcion = inscripcion;
    this.alumno_materia_nota = alumno_materia_nota;
    let id_sede = +localStorage.getItem('id_sede');

    this.onClose = new Subject();
    if(this.alumno_materia_nota==null){
      this.titulo="Nota Nueva";
    } else {
      this.id = this.alumno_materia_nota.id;
      this.titulo="Nota Editar";
      this.f.id_materia.setValue(alumno_materia_nota.id_materia);
      this.f.nota.setValue(alumno_materia_nota.nota);
      this.f.nota_nombre.setValue(alumno_materia_nota.nota_nombre);
      this.f.id_tipo_condicion_alumno.setValue(alumno_materia_nota.id_tipo_condicion_alumno);
      let fecha = moment(alumno_materia_nota.fecha);
      this.f.fecha.setValue(fecha.toDate());
      this.f.libro.setValue(alumno_materia_nota.libro);
      this.f.folio.setValue(alumno_materia_nota.folio);
      this.f.observaciones.setValue(alumno_materia_nota.observaciones);
    }

    this.materiaService.planEstudio(this.inscripcion.id_plan_estudio).subscribe(response=>{
      this.materias = response;
    });

    this.alumnoService.tipos_condicion().subscribe(response=>{
      this.condicionalidades = response;
    });
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
    var item = <AlumnoMateriaNota>{};
    item.id_inscripcion = this.inscripcion.id;
    item.id_materia = this.f.id_materia.value;
    item.asistencia = true;
    item.nota = this.f.nota.value;
    item.nota_nombre = this.f.nota_nombre.value;
    item.id_tipo_condicion_alumno = this.f.id_tipo_condicion_alumno.value;
    item.fecha = moment(this.f.fecha.value).format('YYYY-MM-DD');
    item.libro = this.f.libro.value;
    item.folio = this.f.folio.value;
    item.observaciones = this.f.observaciones.value;
    if(this.alumno_materia_nota != null){
      item.id = this.alumno_materia_nota.id;
      this.inscripcionService.notas_update(item).subscribe(response=>{
        this.toastr.success('Nota Editada', '');
        this.onClose.next(true);
        this.bsModalRef.hide();
      });
    } else {
      this.inscripcionService.notas_register(item).subscribe(response=>{
        this.toastr.success('Nota Agregada', '');
        this.onClose.next(true);
        this.bsModalRef.hide();
      });
    }
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
