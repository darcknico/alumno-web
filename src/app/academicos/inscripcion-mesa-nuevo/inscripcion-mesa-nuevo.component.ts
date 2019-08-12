import { Component, OnInit } from '@angular/core';
import { MesaExamen, MesaExamenMateria, MesaExamenMateriaAlumno } from '../../_models/mesa.examen';
import { Inscripcion } from '../../_models/inscripcion';
import { InscripcionService } from '../../_services/inscripcion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MesaExamenMateriaService } from '../../_services/mesa_examen_materia.service';
import { TipoCondicionAlumno } from '../../_models/alumno';
import { AlumnoService } from '../../_services/alumno.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-inscripcion-mesa-nuevo',
  templateUrl: './inscripcion-mesa-nuevo.component.html',
  styleUrls: ['./inscripcion-mesa-nuevo.component.scss']
})
export class InscripcionMesaNuevoComponent implements OnInit {
  inscripcion:Inscripcion;
  mesa_examen:MesaExamen;
  mesa_examen_materia:MesaExamenMateria;
  condicionalidades:TipoCondicionAlumno[];
  deuda:number = 0;

  dtOptions: DataTables.Settings = {};
  dataSourceMesaExamen:MesaExamen[];
  dataSourceMesaExamenMateria:MesaExamenMateria[];

  formulario:FormGroup;
  consultando:boolean=false;
  constructor(
    private alumnoService:AlumnoService,
    private inscripcionService:InscripcionService,
    private mesaExamenMateriaService:MesaExamenMateriaService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private fb:FormBuilder,
  ) {
    this.formulario = this.fb.group({
      id_tipo_condicion_alumno:1,
      nota:[null,[Validators.min(0),Validators.max(10),Validators.nullValidator]],
      adeuda:false,
    });
  }

  ngOnInit() {
    let ids = +localStorage.getItem('id_sede');
    this.inscripcionService.sede(ids);
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      paging:false,
      searching:false,
      lengthChange:false,
      info:false,
      ordering:false,
    };
    this.route.params.subscribe(query=>{
      let ids = query['id_inscripcion'];
      if(ids){
        this.inscripcionService.getById(ids).subscribe(response=>{
          this.inscripcion = response;
        });
        this.inscripcionService.mesas_examenes_disponibles(ids).subscribe(response=>{
          this.dataSourceMesaExamen = response;
        });
        this.inscripcionService.estado_deuda(ids).subscribe((response:any)=>{
          this.deuda = response.deuda;
          if(this.deuda>0){
            this.f.adeuda.setValue(true);
          }
        });
      }
    });

    this.alumnoService.tipos_condicion().subscribe(response=>{
      this.condicionalidades = response;
    });
    
  }

  get f(){
    return this.formulario.controls;
  }

  seleccionar_mesa_examen(item:MesaExamen){
    this.mesa_examen = item;
    this.inscripcionService.mesas_examenes_materias_disponibles(this.inscripcion.id,this.mesa_examen.id).subscribe(response=>{
      this.dataSourceMesaExamenMateria = response;
    })
  }

  seleccionar_mesa_examen_materia(item:MesaExamenMateria){
    this.mesa_examen_materia = item;
    this.consultando = true;
    this.mesaExamenMateriaService.getById(item.id,this.inscripcion.id).subscribe(response=>{
      this.consultando = false;
      this.mesa_examen_materia = response;
    });
  }

  cambiar_mesa_examen(){
    this.mesa_examen = null;
    this.dataSourceMesaExamenMateria = null;
  }

  cambiar_mesa_examen_materia(){
    this.mesa_examen_materia = null;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    let item = <MesaExamenMateriaAlumno>{};
    item.id_mesa_examen_materia = this.mesa_examen_materia.id;
    item.id_alumno = this.inscripcion.id_alumno;
    item.id_inscripcion = this.inscripcion.id;
    item.id_tipo_condicion_alumno = this.f.id_tipo_condicion_alumno.value;
    item.nota = this.f.nota.value;
    item.adeuda = this.f.adeuda.value;
    this.mesaExamenMateriaService.alumno_asociar(item).subscribe(response=>{
      this.toastr.success('Inscripcion a Mesa de examen realizada', '');
      this.volver();
    });
  }

  volver(){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/mesas']);
  }
}
