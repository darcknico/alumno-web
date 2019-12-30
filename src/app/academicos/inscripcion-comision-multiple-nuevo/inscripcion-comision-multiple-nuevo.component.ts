import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Inscripcion } from '../../_models/inscripcion';
import Stepper from 'bs-stepper';
import { InscripcionService } from '../../_services/inscripcion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BlockUIService, BLOCKUI_DEFAULT } from 'ng-block-ui';
import * as moment from 'moment';
import {forkJoin as observableForkJoin } from 'rxjs';
import { ComisionService } from '../../_services/comision.service';
import { Comision, ComisionAlumno } from '../../_models/comision';
import dtLanguage from '../../_constants/dtLanguage';

@Component({
  selector: 'app-inscripcion-comision-multiple-nuevo',
  templateUrl: './inscripcion-comision-multiple-nuevo.component.html',
  styleUrls: ['./inscripcion-comision-multiple-nuevo.component.scss']
})
export class InscripcionComisionMultipleNuevoComponent implements OnInit {
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  index:number=1;
  id_mesa_examen:number=null;
  inscripcion:Inscripcion;
  anios:number[]=[];
  anio:number;
  comisiones:Comision[];
  inscripciones:ComisionAlumno[]=null;
  private stepper: Stepper;

  constructor(
    private comisionService:ComisionService,
    private inscripcionService:InscripcionService,
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
      let {extras} = this.router.getCurrentNavigation();
      if(extras.state){
        this.inscripcion = extras.state.inscripcion;
      }
      let ids = query['id_inscripcion'];
      if(ids){
        if(!this.inscripcion){
          this.inscripcionService.getById(ids).subscribe(response=>{
            this.inscripcion = response;
          });
        }
      }
    });
  }

  refrescarComisiones(){
    let refrescar = true;
    if(this.comisiones){
      if(this.comisiones.length>0){
        if(this.comisiones[0].anio == this.anio){
          refrescar = false;
        }
      }
    }
    if(refrescar){
      this.block.start(BLOCKUI_DEFAULT);
      this.comisiones = null;
      this.comisionService.carreras(this.inscripcion.id_carrera,{
        anio:this.anio,
        id_inscripcion:this.inscripcion.id,
      }).subscribe(response=>{
        this.block.stop(BLOCKUI_DEFAULT);
        this.comisiones = response;
      });
    }
  }
  continuarPrimero(){
    this.refrescarComisiones();
    this.next();
  }
  async continuarSegundo(){
    this.inscripciones = [];
    if(this.dtElement){
      await this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        let indexs = dtInstance.rows({selected:true}).indexes();
        for (let index = 0; index < indexs.length; index++) {
          let row = dtInstance.rows(indexs[index]);
          var item = <ComisionAlumno>{};
          item.id_comision = +dtInstance.cell(row,1).data();
          item.id_alumno = this.inscripcion.id_alumno;
          item.id_inscripcion = this.inscripcion.id;
          item.comision = this.comisiones.find(comision=>comision.id == item.id_comision);
          this.inscripciones.push(item);
        }
      });
    }
    
    if(this.inscripciones.length == 0){
      this.toastr.warning('No hay comisiones seleccionadas');
      return;
    }
    this.next();
  }

  continuarTercero(){
    this.block.start(BLOCKUI_DEFAULT);
    let tasks = [];
    this.inscripciones.forEach(data=>{
      tasks.push(
        this.comisionService.alumno_asociar(data)
      );
    });
    observableForkJoin(tasks).subscribe(response => {
      this.block.stop(BLOCKUI_DEFAULT);
      this.toastr.success('Inscripciones a comisiones realizada', '');
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
        selector: 'td:first-child'
      },
    };
  }

  volver(){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/comisiones']);
  }

}
