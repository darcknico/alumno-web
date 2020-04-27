import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { DocenteEstado } from '../../../_models/usuario';
import { FiltroDocenteEstado, DocenteEstadoService } from '../../../_services/docente_estado.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { EstadoEditarModalComponent } from '../../estado-editar-modal/estado-editar-modal.component';
import { DialogConfirmComponent } from '../../../_generic/dialog-confirm/dialog-confirm.component';
import { AuxiliarFunction } from '../../../_helpers/auxiliar.function';

@Component({
  selector: 'app-componente-listado-estado',
  templateUrl: './listado-estado.component.html',
  styleUrls: ['./listado-estado.component.scss']
})
export class ListadoEstadoComponent implements OnInit {
  @Input('id_docente')id_docente:number=null;

  resource:string = 'docentes';
  @ViewChild(DataTableDirective,{static:false})dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: DocenteEstado[] = [];
  request = <FiltroDocenteEstado>{
    search:"",
    id_sede:0,
    id_tipo_docente_estado:0,
  };
  consultando:boolean=false;

  constructor(
    private service:DocenteEstadoService,
    private modalService: BsModalService,
    private toastr: ToastrService,

  ) { }

  suscribe;
  ngOnInit() {
    this.request.id_usuario = this.id_docente;
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
        this.suscribe = this.service.ajax(that.request).subscribe(resp => {
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
          data: 'created_at',
          width: '5%', 
        },
        { data: 'id_tipo_docente_estado' },
        { data: 'fecha_inicio'},
        {data:'fecha_inicial'}
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
      responsive:true,
    };
  }

  ngAfterViewInit(){

  }

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  nuevo(){
    const modal = this.modalService.show(EstadoEditarModalComponent,{class: 'modal-success modal-lg'});
    (<EstadoEditarModalComponent>modal.content).onShow(this.id_docente);
    (<EstadoEditarModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  editar(item:DocenteEstado){
    const modal = this.modalService.show(EstadoEditarModalComponent,{class: 'modal-info modal-lg'});
    (<EstadoEditarModalComponent>modal.content).onShow(this.id_docente,item);
    (<EstadoEditarModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  eliminar(item:DocenteEstado){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar estado del docente");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.service.delete(item.id).subscribe(response=>{
          this.toastr.success('Estado eliminado', '');
          this.refrescar();
        });
      }
    });
  }

  archivo(item:DocenteEstado){
    AuxiliarFunction.descargar(this.toastr,this.service.archivo(item));
  }
}
