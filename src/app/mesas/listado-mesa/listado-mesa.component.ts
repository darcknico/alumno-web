import { Component, OnInit, ViewChild } from '@angular/core';
import { MesaExamenService, FiltroMesaExamen } from '../../_services/mesa_examen.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { MesaExamen } from '../../_models/mesa.examen';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-listado-mesa',
  templateUrl: './listado-mesa.component.html',
  styleUrls: ['./listado-mesa.component.scss']
})
export class ListadoMesaComponent implements OnInit {
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: MesaExamen[] = [];

  request = <FiltroMesaExamen>{
    search:"",
  };
  constructor(
    private mesaExamenService:MesaExamenService,
    private authenticationService:AuthenticationService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.mesaExamenService.sede(id_sede);
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
        this.mesaExamenService.ajax(that.request).subscribe(resp => {
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
          data: 'fecha_inicio',
          width: '15%', 
        }, 
        { data: 'fecha_inicio' },
        { data: 'nombre' },
        { data: 'numero' },
      ],
      responsive:true,
    };
  }

  
  ver(item:MesaExamen){
    this.router.navigate(['/mesas/'+item.id+'/ver']);
  }

  nuevo(){
    this.router.navigate(['/mesas/nuevo']);
  }

  editar(item:MesaExamen){
    this.router.navigate(['/mesas/'+item.id+'/editar']);
  }

  eliminar(item:MesaExamen){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar mesa de examen","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.mesaExamenService.delete(item.id).subscribe(response=>{
          this.toastr.success('Mesa de examen eliminada', '');
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
