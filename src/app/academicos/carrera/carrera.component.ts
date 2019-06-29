import { Component, OnInit, ViewChild } from '@angular/core';
import { Carrera } from '../../_models/carrera';
import { CarreraService, FiltroCarrera } from '../../_services/carrera.service';
import { Router } from '@angular/router';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { DepartamentoService } from '../../_services/departamento.service';
import { Departamento } from '../../_models/departamento';
import { SedeService } from '../../_services/sede.service';

@Component({
  selector: 'app-carrera',
  templateUrl: './carrera.component.html',
  styleUrls: ['./carrera.component.scss']
})
export class CarreraComponent implements OnInit {
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: Carrera[] = [];

  departamentos:Departamento[]=[];
  id_sede:number;
  request = <FiltroCarrera>{
    search:"",
    id_departamento:0,
  };

  constructor(
    private carreraService:CarreraService,
    private departamentoService:DepartamentoService,
    private sedeService:SedeService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    ) {
  }

  ngOnInit() {
    this.id_sede = this.sedeService.getIdSede();

    this.departamentoService.getAll().subscribe(response=>{
      this.departamentos = response;
    });

    const that = this;

    this.dtOptions = {
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
        this.carreraService.ajax(that.request).subscribe(resp => {
            that.dataSource = resp.items;
            callback({
              recordsTotal: resp.total_count,
              recordsFiltered: resp.total_count,
              data: []
            });
          });
      },
      columns: [
        { data: 'created_at' }, { data: 'nombre' }, { data: 'nombre_corto' },{ data: 'id_departamento'},{data:'id_plan_estudio'}
      ]
    };
  }

  nuevo(){
    this.router.navigate(['/academicos/carreras/nuevo']);
  }

  ver(item:Carrera){
    this.router.navigate(['/academicos/carreras/'+item.id+'/ver']);
  }

  editar(item:Carrera){
    this.router.navigate(['/academicos/carreras/'+item.id+'/editar']);
  }

  eliminar(item:Carrera){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar Carrera","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.carreraService.delete(item.id).subscribe(response=>{
          this.toastr.success('Carrera Eliminado', '');
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

  comisiones(item:Carrera){
    this.router.navigate(['/comisiones/carreras/'+item.id]);
  }
}
