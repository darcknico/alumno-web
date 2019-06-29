import { Component, OnInit, ViewChild } from '@angular/core';
import { Examen } from '../../_models/examen';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { FiltroExamen, ExamenService } from '../../_services/examen.service';
import { DataTableDirective } from 'angular-datatables';
import { Departamento } from '../../_models/departamento';
import { Carrera } from '../../_models/carrera';
import { DepartamentoService } from '../../_services/departamento.service';
import { CarreraService } from '../../_services/carrera.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SedeService } from '../../_services/sede.service';

@Component({
  selector: 'app-listado-examen',
  templateUrl: './listado-examen.component.html',
  styleUrls: ['./listado-examen.component.scss']
})
export class ListadoExamenComponent implements OnInit {
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: Examen[] = [];
  departamentos:Departamento[]=[];
  carreras:Carrera[]=[];

  request = <FiltroExamen>{
    search:"",
    id_departamento:0,
    id_materia:0,
    id_carrera:0,
  };

  constructor(
    private examenService:ExamenService,
    private sedeService:SedeService,
    private departamentoService:DepartamentoService,
    private carreraService:CarreraService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    let id_sede = this.sedeService.getIdSede();
    this.examenService.sede(id_sede);
    this.departamentoService.getAll().subscribe(response => {
      this.departamentos = response;
    });
    this.carreraService.getAll().subscribe(response => {
      this.carreras = response;
      let item = <Carrera>{};
      item.id = 0;
      item.nombre = "TODOS";
      this.carreras.push(item);
      this.carreras = this.carreras.reverse();
    });
    const that = this;

    this.dtOptions = {
      order: [[ 0, "desc" ]],
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.request.start = dataTablesParameters.start;
        that.request.length = dataTablesParameters.length;
        that.request.order = dataTablesParameters.order[0].dir;
        that.request.search = dataTablesParameters.search.value;
        that.request.sort = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        this.examenService.ajax(that.request).subscribe(resp => {
            that.dataSource = resp.items;

            callback({
              recordsTotal: resp.total_count,
              recordsFiltered: resp.total_count,
              data: []
            });
          });
      },
      columns: [
        { 
          data: 'fecha',
          width: '5%', 
        }, 
        { data: 'id_carrera', orderable:false },
        { data: 'id_materia', orderable:false },
        { data: 'comsion_numero', orderable:false },
        { data: 'alumnos_cantidad', orderable:false},
      ],
      responsive:true,
    };
  }

  ver(item:Examen){
    this.router.navigate(['/examenes/'+item.id+'/ver']);
  }

  comision(item:Examen){
    this.router.navigate(['/comisiones/'+item.id_comision+'/ver']);
  }

  eliminar(item:Examen){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar examen","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.examenService.delete(item.id).subscribe(response=>{
          this.toastr.success('Examen eliminado', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

}
