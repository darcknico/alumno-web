import { Component, OnInit, ViewChild } from '@angular/core';
import { MesaExamenService, FiltroMesaExamen } from '../../_services/mesa_examen.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { MesaExamen } from '../../_models/mesa.examen';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { Subscription } from 'rxjs';
import { AuxiliarFunction } from '../../_helpers/auxiliar.function';
import * as moment from "moment";

@Component({
  selector: 'app-listado-mesa',
  templateUrl: './listado-mesa.component.html',
  styleUrls: ['./listado-mesa.component.scss']
})
export class ListadoMesaComponent implements OnInit {
  @ViewChild(DataTableDirective,{static:false})dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: MesaExamen[] = [];
  anios:any[]=[];

  request = <FiltroMesaExamen>{
    search:"",
    anio:0,
  };
  constructor(
    private mesaExamenService:MesaExamenService,
    private authenticationService:AuthenticationService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
    let hoy = moment();
    this.anios.push({
      'label':'TODOS',
      'value':0,
    })
    for (let index = 2018; index <= hoy.year()+1; index++) {
      this.anios.push({
        'label':index,
        'value':index,
      })
    }
    this.request.anio = hoy.year();
  }
  
  subscription:Subscription;

  ngOnInit() {
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
        if(this.subscription){
          this.subscription.unsubscribe();
          this.subscription = null;
        }
        that.request.start = dataTablesParameters.start;
        that.request.length = dataTablesParameters.length;
        that.request.order = dataTablesParameters.order[0].dir;
        that.request.search = dataTablesParameters.search.value;
        that.request.sort = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        this.subscription = this.mesaExamenService.ajax(that.request).subscribe(resp => {
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
        { data: 'numero', className:'text-center', width: '5%' },
        { data: 'totales', className:'text-center', width: '5%' },
        { data: 'inscriptos', className:'text-center', width: '5%' },
        { data: 'opciones', className:'text-center', width: '5%' },
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
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

  descargar(item:MesaExamen){
    AuxiliarFunction.descargar(this.toastr,this.mesaExamenService.reporte_resumen(item.id));
  }

  imprimir(item:MesaExamen){
    AuxiliarFunction.imprimir(this.toastr,this.mesaExamenService.reporte_resumen(item.id));
  }

  actas(item:MesaExamen){
    this.router.navigate(['/mesas/materias'],{
      queryParams:{
        id_mesa_examen:item.id,
      },
      state:{
        mesa_examen:item,
      }
    });
  }

}
