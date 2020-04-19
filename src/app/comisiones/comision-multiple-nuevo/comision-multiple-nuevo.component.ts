import { Component, OnInit, ViewChild } from '@angular/core';
import { MateriaService, FiltroMateria } from '../../_services/materia.service';
import { ComisionService, FiltroComision } from '../../_services/comision.service';
import { Materia } from '../../_models/materia';
import { Comision } from '../../_models/comision';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Carrera } from '../../_models/carrera';
import { Departamento } from '../../_models/departamento';
import { Observable, forkJoin } from 'rxjs';
import { DepartamentoService } from '../../_services/departamento.service';
import { CarreraService } from '../../_services/carrera.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUIService, BLOCKUI_DEFAULT } from 'ng-block-ui';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { map } from 'rxjs/operators';
import { Modalidad } from '../../_models/modalidad';
import { ModalidadService } from '../../_services/modalidad.service';
import * as moment from 'moment';

@Component({
  selector: 'app-comision-multiple-nuevo',
  templateUrl: './comision-multiple-nuevo.component.html',
  styleUrls: ['./comision-multiple-nuevo.component.scss']
})
export class ComisionMultipleNuevoComponent implements OnInit {
  @ViewChild(DataTableDirective,{static:false})dtElement: DataTableDirective;

  formulario: FormGroup;
  fecha_inicio:Date;

  dtOptions: any = {};
  dataSource:Materia[] = [];
  carreras:Carrera[]=[];
  departamentos:Departamento[]=[];

  porMateria:boolean = false;
  porFiltro:boolean = true;
  id_departamento:number = 0;
  id_carrera:number = 0;
  previa:Observable<any>;
  resultado:any;
  modalidades:Modalidad[] = [];
  anios:number[]=[];
  anio:number;
  asistencia:boolean;
  clase_inicio;
  clase_final;
  constructor(
    private comisionService:ComisionService,
    private materiaService:MateriaService,
    private departamentoService:DepartamentoService,
    private carreraService:CarreraService,
    private modalidadService:ModalidadService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private block: BlockUIService,
  ) {
    let fecha = moment();
    for (let index = 2018; index <= fecha.year()+1; index++) {
      this.anios.push(index);
    }
    this.anio = fecha.year();
    this.formulario = this.fb.group({
      docentes_previos:false,
      docentes_asignados:false,
      horarios_previos:false,
    });
  }

  ngOnInit() {
    this.carreraService.getAll().subscribe(response=>{
      this.carreras = response;
      let item = <Carrera>{};
      item.id = 0;
      item.nombre = "TODOS";
      this.carreras.push(item);
      this.carreras = this.carreras.reverse();
    });
    this.departamentoService.getAll().subscribe(response=>{
      this.departamentos = response;
      let item = <Departamento>{};
      item.id = 0;
      item.nombre = "TODOS";
      this.departamentos.push(item);
      this.departamentos = this.departamentos.reverse();
    });

    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
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
        }
      ],
      select: {
        info:false,
        style: 'multi',
        selector: 'td:first-child'
      },
    };
    this.modalidadService.getAll().subscribe(response=>{
      this.modalidades = response;
    });
    this.buscar();
  }

  get f(){
    return this.formulario.controls;
  }

  asociar_materias(){
    let error = [];
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      let indexs = dtInstance.rows({selected:true}).indexes();
      if(indexs.length == 0){
        this.toastr.warning('No hay materias seleccionadas');
        return;
      }
      var items = [];
      for (let index = 0; index < indexs.length; index++) {
        let row = indexs[index];
        var item = <Comision>{};
        item.anio = this.anio;
        item.asistencia = this.asistencia;
        let clase_inicio = moment(this.clase_inicio);
        if(clase_inicio.isValid()){
          item.clase_inicio = clase_inicio.format('YYYY-MM-DD');
        }
        let clase_final = moment(this.clase_final);
        if(clase_final.isValid()){
          item.clase_final = clase_final.format('YYYY-MM-DD');
        }
        item.docentes_asignados = this.f.docentes_asignados.value;
        item.docentes_previos = this.f.docentes_previos.value;
        item.horarios_previos = this.f.horarios_previos.value;

        item.id_materia = +dtInstance.cell(row,1).data();
        let id_modalidad = $(dtInstance.cell(row,4).node()).find('select').val();
        if(id_modalidad){
          item.id_modalidad = +id_modalidad
        } else {
          error.push(item);
        }
        items.push(item);
      }
      if(error.length>0){
        const modal = this.modalService.show(DialogConfirmComponent,{class:'modal-danger'});
        (<DialogConfirmComponent>modal.content).onShow(
          "Comisiones",
          "Se han encontrado "+error.length+" comisiones/s con error. Verifique antes de continuar .¿Desea Continuar?");
        (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
          if (result === true) {
            const modal = this.modalService.show(DialogConfirmComponent);
            (<DialogConfirmComponent>modal.content).onShow(
              "Mesas de examen",
              "Esta por generar "+items.length+" comision/es para el año "+this.anio+" .¿Desea Continuar?");
            (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
              if (result === true) {
                let tasks = [];
                items.forEach(item=>{
                  tasks.push(
                    this.comisionService.register(item)
                  );
                });
                forkJoin(tasks).subscribe(response => {
                  this.toastr.success('Se han generado las mesas de examenes exitosamente');
                  this.volver();
                });
              }
            });
          }
        });
      } else {
        const modal = this.modalService.show(DialogConfirmComponent);
        (<DialogConfirmComponent>modal.content).onShow(
          "Mesas de examen",
          "Esta por generar "+items.length+" mesa/s mesas de examen/es para .¿Desea Continuar?");
        (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
          if (result === true) {
            let tasks = [];
            items.forEach(item=>{
              tasks.push(
                this.comisionService.register(item)
              );
            });
            forkJoin(tasks).subscribe(response => {
              this.toastr.success('Se han generado las mesas de examenes exitosamente');
              this.volver();
            });
          }
        });
      }
      
    });
  }

  refrescar(event=null){
    this.dataSource = null;
    let data = <FiltroMateria>{};
    data.id_carrera = this.id_carrera;
    data.id_departamento = this.id_departamento;
    this.block.start(BLOCKUI_DEFAULT);
    this.materiaService.getAll(data).subscribe(response=>{
      this.dataSource = response;
      this.block.stop(BLOCKUI_DEFAULT);
    });
  }

  volver(){
    this.router.navigate(['/comisiones']);
  }

  btnPorMateria(){
    this.porMateria = true;
    this.porFiltro = false;
    if(this.id_departamento == 0 && this.id_carrera == 0){
      if(this.dataSource.length == 0){
        this.refrescar();
      }
    } else {
      this.id_departamento = 0;
      this.id_carrera = 0;
      this.refrescar();
    }
  }

  btnPorFiltro(){
    this.porMateria = false;
    this.porFiltro = true;
    this.id_departamento = 0;
    this.id_carrera = 0;
    this.buscar();
  }

  seleccionarDepartamento(event){
    this.id_carrera = 0;
    if(this.id_departamento>0){
      this.carreras = this.carreras.map(item=>{
        if(item.id == 0){
          return item;
        } else {
          if(item.id_departamento == this.id_departamento){
            item.disabled = false;
          } else {
            item.disabled = true;
          }
          return item;
        }
      });
    } else {
      this.carreras = this.carreras.map(item=>{
        if(item.id == 0){
          return item;
        } else {
          item.disabled = false;
          return item;
        }
      });
    }
    this.buscar();
  }

  buscar(event?){
    let data = <FiltroComision>{};
    data.id_departamento = this.id_departamento;
    data.id_carrera = this.id_carrera;
    data.anio = this.anio;
    this.previa = this.comisionService.masivo_previa(data).pipe(
      map(response=>{
        this.resultado = response;
        return response;
      })
    );
  }

  asociar_filtros(){
    const modal = this.modalService.show(DialogConfirmComponent);
      (<DialogConfirmComponent>modal.content).onShow(
        "Mesas de examen",
        "Esta por generar "+this.resultado.total_materias+" mesa/s mesas de examen/es.¿Desea Continuar?");
      (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
        if (result === true) {
          this.block.start(BLOCKUI_DEFAULT);
          let item = <any>{};
          item.anio = this.anio;
          item.asistencia = this.asistencia;
          let clase_inicio = moment(this.clase_inicio);
          if(clase_inicio.isValid()){
            item.clase_inicio = clase_inicio.format('YYYY-MM-DD');
          }
          let clase_final = moment(this.clase_final);
          if(clase_final.isValid()){
            item.clase_final = clase_final.format('YYYY-MM-DD');
          }
          item.docentes_asignados = this.f.docentes_asignados.value;
          item.docentes_previos = this.f.docentes_previos.value;
          item.horarios_previos = this.f.horarios_previos.value;
          
          item.id_departamento = this.id_departamento;
          item.id_carrera = this.id_carrera;
          this.comisionService.masivo_asociar(item).subscribe(response=>{
            this.block.stop(BLOCKUI_DEFAULT);
            this.volver();
          },err=>{
            this.block.stop(BLOCKUI_DEFAULT);
          });
        }
      });
  }
}
