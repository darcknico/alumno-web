import { Component, OnInit, ViewChild } from '@angular/core';
import { DocenteService, FiltroDocente } from '../../_services/docente.service';
import { DataTableDirective } from 'angular-datatables';
import { Docente } from '../../_models/usuario';
import { Sede } from '../../_models/sede';
import { SedeService } from '../../_services/sede.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TipoContrato } from '../../_models/tipo';
import { TipoService } from '../../_services/tipo.service';
import { CarreraService } from '../../_services/carrera.service';
import { Carrera } from '../../_models/carrera';

@Component({
  selector: 'app-listado-docente',
  templateUrl: './listado-docente.component.html',
  styleUrls: ['./listado-docente.component.scss']
})
export class ListadoDocenteComponent implements OnInit {
  resource:string = 'docentes';
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  usuarios: Docente[] = [];
  sedes:Sede[]=[];
  tipos:TipoContrato[]=[];
  carreras:Carrera[]=[];

  request = <FiltroDocente>{
    search:"",
    id_sede:0,
    id_tipo_contrato:0,
    id_carrera:0,
    estado:null,
  };
  constructor(
    private usuarioService:DocenteService,
    private carreraService:CarreraService,
    private sedeService:SedeService,
    private tipoService:TipoService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  suscribe;
  ngOnInit() {
    this.request.id_sede = this.sedeService.getIdSede();
    this.sedeService.getAll().subscribe(response => {
      this.sedes = response;
    });
    this.tipoService.contratos().subscribe(response=>{
      this.tipos = response;
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
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        if(this.suscribe){
          this.suscribe.unsubscribe();
          this.suscribe = null;
        }
        that.request.start = dataTablesParameters.start;
        that.request.length = dataTablesParameters.length;
        that.request.order = dataTablesParameters.order[0].dir;
        that.request.search = dataTablesParameters.search.value;
        that.request.sort = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        this.suscribe = this.usuarioService.ajax(that.request).subscribe(resp => {
            that.usuarios = resp.items;

            callback({
              recordsTotal: resp.total_count,
              recordsFiltered: resp.total_count,
              data: []
            });
          });
      },
      columns: [
        { 
          data: 'cuit',
          width: '5%', 
        }, { data: 'apellido' }, { data: 'titulo' },{ data: 'id_tipo_contrato'},
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
      responsive:true,
    };
  }

  nuevo(){
    this.router.navigate([this.resource,'nuevo']);
  }

  editar(item:Docente){
    this.router.navigate([this.resource,item.id_usuario,'editar']);
  }

  ver(item:Docente){
    this.router.navigate([this.resource,item.id_usuario,'ver']);
  }

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }
}
