import { Component, OnInit, ViewChild } from '@angular/core';
import { InscripcionService } from '../../_services/inscripcion.service';
import { MesaExamenMateriaService } from '../../_services/mesa_examen_materia.service';
import { MesaExamenMateriaAlumnoService } from '../../_services/mesa_examen_materia_alumno.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Inscripcion } from '../../_models/inscripcion';
import Stepper from 'bs-stepper';
import { MesaExamen, MesaExamenMateria, MesaExamenMateriaAlumno } from '../../_models/mesa.examen';
import * as moment from 'moment';
import { BlockUIService,BLOCKUI_DEFAULT } from 'ng-block-ui';
import { DataTableDirective } from 'angular-datatables';
import { AlumnoService } from '../../_services/alumno.service';
import { TipoCondicionAlumno } from '../../_models/alumno';
import {forkJoin as observableForkJoin } from 'rxjs';
import dtLanguage from '../../_constants/dtLanguage';

@Component({
  selector: 'app-inscripcion-mesa-multiple-nuevo',
  templateUrl: './inscripcion-mesa-multiple-nuevo.component.html',
  styleUrls: ['./inscripcion-mesa-multiple-nuevo.component.scss']
})
export class InscripcionMesaMultipleNuevoComponent implements OnInit {
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  index:number=1;
  id_mesa_examen:number=null;
  inscripcion:Inscripcion;
  anios:number[]=[];
  anio:number;
  mesas:MesaExamen[];
  materias:MesaExamenMateria[]=null;
  examenes:MesaExamenMateriaAlumno[]=null;
  condicionalidades:TipoCondicionAlumno[];
  deuda:number = 0;
  adeuda:boolean= false;
  private stepper: Stepper;

  constructor(
    private alumnoService:AlumnoService,
    private inscripcionService:InscripcionService,
    private mesaExamenMateriaService:MesaExamenMateriaService,
    private mesaExamenMateriaAlumnoService:MesaExamenMateriaAlumnoService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private block:BlockUIService,
    ) {
    let hoy = moment();
    this.anio = hoy.year();
    for (let index = 2018; index <= hoy.year() + 1; index++) {
      this.anios.push(index);
    }

    this.route.params.subscribe(query=>{
      let ids = query['id_inscripcion'];
      let {extras} = this.router.getCurrentNavigation();
      if(extras.state){
        this.inscripcion = extras.state.inscripcion;
        if(this.inscripcion.id != ids){
          this.inscripcion = null;
        }
      }
      if(ids){
        if(!this.inscripcion){
          this.inscripcionService.getById(ids).subscribe(response=>{
            this.inscripcion = response;
            this.refrescarMesas();
          });
        } else {
          this.refrescarMesas();
        }
        this.inscripcionService.estado_deuda(ids).subscribe((response:any)=>{
          this.deuda = response.deuda;
          if(this.deuda>0){
            this.adeuda = true;
          }
        });
      }
    });
  }

  refrescarMesas(){
    this.inscripcionService.mesas_examenes_disponibles(this.inscripcion.id,this.anio).subscribe(response=>{
      this.mesas = response;
    });
  }
  refrescarMaterias(){
    let refrescar = true;
    if(this.materias){
      if(this.materias.length>0){
        if(this.materias[0].id_mesa_examen == this.id_mesa_examen){
          refrescar = false;
        }
      }
    }
    if(refrescar){
      this.block.start(BLOCKUI_DEFAULT);
      this.materias = null;
      this.inscripcionService.mesas_examenes_materias_disponibles(this.inscripcion.id,this.id_mesa_examen).subscribe(response=>{
        this.block.stop(BLOCKUI_DEFAULT);
        this.materias = response;
      });
    }
  }
  continuarPrimero(){
    this.refrescarMaterias();
    this.next();
  }
  async continuarSegundo(){
    this.examenes = [];
    if(this.dtElement){
      await this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        let indexs = dtInstance.rows({selected:true}).indexes();
        for (let index = 0; index < indexs.length; index++) {
          let row = dtInstance.rows(indexs[index]);
          var item = <MesaExamenMateriaAlumno>{};
          item.id_mesa_examen_materia = +dtInstance.cell(row,1).data();
          item.mesa_examen_materia = this.materias.find(materia=>materia.id == item.id_mesa_examen_materia);
          item.id_alumno = this.inscripcion.id_alumno;
          item.id_inscripcion = this.inscripcion.id;
          item.id_tipo_condicion_alumno =  +$(dtInstance.cell(row,6).node()).find('.condicionalidad').val();
          if(item.id_tipo_condicion_alumno){
            item.condicion = this.condicionalidades.find(condicionalidad=>condicionalidad.id == item.id_tipo_condicion_alumno);
          }
          let nota = $(dtInstance.cell(row,7).node()).find('.nota').val();
          if(item.nota){
            item.nota = +nota;
          }
          this.examenes.push(item);
        }
      });
    }
    if(this.examenes.length == 0){
      this.toastr.warning('No hay materias seleccionadas');
      return;
    }
    this.next();
  }

  continuarTercero(){
    this.block.start(BLOCKUI_DEFAULT);
    let tasks = [];
    this.examenes.forEach(data=>{
      data.adeuda = this.adeuda;
      tasks.push(
        this.mesaExamenMateriaService.alumno_asociar(data)
      );
    });
    observableForkJoin(tasks).subscribe(response => {
      this.block.stop(BLOCKUI_DEFAULT);
      this.toastr.success('Inscripciones a examenes realizada', '');
      this.volver();
    });
  }
  
  back(){
    this.index -= 1;
    this.stepper.previous();
  }
  next() {
    this.index += 1;
    this.stepper.next();
  }

  to(index){
    if(index<this.index){
      this.stepper.to(index);
    }
  }

  onSubmit() {
    return false;
  }

  ngOnInit() {
    this.id_mesa_examen = null;
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: true,
      animation: true
    })

    this.dtOptions = {
      language: dtLanguage,
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs: [
        {
          orderable: false,
          data:null,
          className: 'select-checkbox',
          defaultContent: '',
          targets:   0
        },
        {
          targets: [ 1 ],
          visible: false,
          searchable: false,
        },
        {
          targets: 'no-sort',
          orderable: false,
        },
      ],
      select: {
        info:false,
        style: 'multi',
        selector: 'td:first-child',
      },
    };
    
    this.alumnoService.tipos_condicion().subscribe(response=>{
      this.condicionalidades = response;
    });
  }

  volver(){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/mesas']);
  }
}
