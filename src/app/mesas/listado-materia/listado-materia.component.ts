
import {forkJoin as observableForkJoin,  Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MesaExamenService } from '../../_services/mesa_examen.service';
import { MesaExamen, MesaExamenMateria } from '../../_models/mesa.examen';
import { Materia } from '../../_models/materia';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';

import * as moment from 'moment';
import { CarreraService } from '../../_services/carrera.service';
import { Carrera } from '../../_models/carrera';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FiltroMesaExamenMateria } from '../../_services/mesa_examen_materia.service';
import { DepartamentoService } from '../../_services/departamento.service';
import { Departamento } from '../../_models/departamento';
import { map } from 'rxjs/operators';
import { BlockUIService, BLOCKUI_DEFAULT } from 'ng-block-ui';

@Component({
  selector: 'app-listado-materia',
  templateUrl: './listado-materia.component.html',
  styleUrls: ['./listado-materia.component.scss']
})
export class ListadoMateriaComponent implements OnInit {
  @ViewChild(DataTableDirective,{static:false})dtElement: DataTableDirective;

  mesa_examen:MesaExamen;
  formulario: FormGroup;
  fecha_inicio:Date;

  dtOptions: any = {};
  dataSource:Materia[];
  carreras:Carrera[]=[];
  departamentos:Departamento[]=[];

  porMateria:boolean = false;
  porFiltro:boolean = true;
  id_departamento:number = 0;
  id_carrera:number = 0;
  previa:Observable<any>;
  resultado:any;
  constructor(
    private mesaExamenService:MesaExamenService,
    private departamentoService:DepartamentoService,
    private carreraService:CarreraService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private block: BlockUIService,
  ) {
    this.formulario = this.fb.group({
      fecha: ['', Validators.required],
      observaciones: '',
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
      ],
      select: {
        info:false,
        style: 'multi',
        selector: 'td:first-child'
      },
    };

    this.route.params.subscribe(params=>{
      let ids = params['id_mesa_examen'];
      this.mesaExamenService.getById(ids).subscribe(response=>{
        this.mesa_examen = response;
        this.fecha_inicio = moment(this.mesa_examen.fecha_inicio).toDate();
        this.f.fecha.setValue(this.fecha_inicio);
        this.buscar();
      });
      this.mesaExamenService.materias_disponibles(ids).subscribe((response:Materia[])=>{
        this.dataSource = response;
      });
    });
  }

  get f(){
    return this.formulario.controls;
  }

  asociar_materias(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      let indexs = dtInstance.rows({selected:true}).indexes();
      console.log(indexs);
      if(indexs.length == 0){
        this.toastr.warning('No hay materias seleccionadas');
        return;
      }
      var mesas = [];
      for (let index = 0; index < indexs.length; index++) {
        let row = indexs[index];
        var item = <MesaExamenMateria>{};
        var cel = $(dtInstance.cell(row,4).node()).find('input');
        let hora = +$(cel[0]).val();
        let minutos = +$(cel[1]).val();
        let ubicacion = $(dtInstance.cell(row,5).node()).find('input').val();
        let fecha = moment(this.f.fecha.value);
        fecha.set('hour',hora);
        fecha.set('minute',minutos);
        item.id_materia = +dtInstance.cell(row,1).data();
        item.id_mesa_examen = this.mesa_examen.id;
        item.fecha = fecha.format('YYYY-MM-DD HH:mm:ss');
        item.ubicacion = String(ubicacion);
        console.log(item);
        mesas.push(item);
      }
      const modal = this.modalService.show(DialogConfirmComponent);
      (<DialogConfirmComponent>modal.content).onShow(
        "Mesas de examen",
        "Esta por generar "+mesas.length+" mesa/s mesas de examen/es para "+this.mesa_examen.nombre+".¿Desea Continuar?");
      (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
        if (result === true) {
          let tasks = [];
          mesas.forEach(mesa=>{
            tasks.push(
              this.mesaExamenService.materia_asociar(mesa)
            );
          });
          observableForkJoin(tasks).subscribe(response => {
            this.toastr.success('Se han generado las mesas de examenes exitosamente');
            this.volver();
          });
        }
      });
    });
  }

  refrescar(event){
    this.dataSource = null;
    this.mesaExamenService.materias_disponibles(this.mesa_examen.id,<FiltroMesaExamenMateria>{
      id_carrera:event.id,
    }).subscribe((response:Materia[])=>{
      this.dataSource = response;
    });
  }

  volver(){
    this.router.navigate(['/mesas/'+this.mesa_examen.id+'/ver']);
  }

  btnPorMateria(){
    this.porMateria = true;
    this.porFiltro = false;
  }

  btnPorFiltro(){
    this.porMateria = false;
    this.porFiltro = true;
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
    this.previa = this.mesaExamenService.masivo_previa(this.mesa_examen.id,this.id_departamento,this.id_carrera).pipe(
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
        "Esta por generar "+this.resultado.total_materias+" mesa/s mesas de examen/es para \""+this.mesa_examen.nombre+"\".¿Desea Continuar?");
      (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
        if (result === true) {
          this.block.start(BLOCKUI_DEFAULT);
          this.mesaExamenService.masivo_asociar(this.mesa_examen.id,this.id_departamento,this.id_carrera).subscribe(response=>{
            this.block.stop(BLOCKUI_DEFAULT);
            this.volver();
          },err=>{
            this.block.stop(BLOCKUI_DEFAULT);
          });
        }
      });
  }
}
