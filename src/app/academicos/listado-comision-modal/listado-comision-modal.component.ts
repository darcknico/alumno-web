import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ComisionService, FiltroComision } from '../../_services/comision.service';
import { SedeService } from '../../_services/sede.service';
import { BsModalRef } from 'ngx-bootstrap';
import { Materia } from '../../_models/materia';
import { Router } from '@angular/router';
import { Comision } from '../../_models/comision';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-listado-comision-modal',
  templateUrl: './listado-comision-modal.component.html',
  styleUrls: ['./listado-comision-modal.component.scss']
})
export class ListadoComisionModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  materia:Materia;

  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: Comision[] = [];

  request = <FiltroComision>{
    search:"",
    id_departamento:0,
    id_materia:0,
    id_carrera:0,
  };

  constructor(
    private service:ComisionService,
    private sedeService:SedeService,
    public bsModalRef: BsModalRef,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  onShow(materia:Materia){
    this.materia = materia;
    this.request.id_materia = materia.id;
    let id_sede = this.sedeService.getIdSede();
    this.service.sede(id_sede);

    this.onClose = new Subject();
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
        this.service.ajax(that.request).subscribe(resp => {
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
          data: 'anio',
          width: '5%', 
        },
        { data: 'numero' },
        { data: 'alumnos_cantidad'},
      ],
      responsive:true,
    };
  }

  nuevo(){
    this.router.navigate(['comisiones','nuevo'],{
      queryParams:{
        id_materia:this.materia.id,
      }
    }).then(_=>{
      this.cancelar();
    });
  }

  ver(item:Comision){
    this.router.navigate(['comisiones',item.id,'ver']).then(_=>{
      this.cancelar();
    });
  }

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}
