import { Component, OnInit, ViewChild } from '@angular/core';
import { PagoService, FiltroPago } from '../../_services/pago.service';
import { CarreraService } from '../../_services/carrera.service';
import { DataTableDirective } from 'angular-datatables';
import { Departamento } from '../../_models/departamento';
import { DepartamentoService } from '../../_services/departamento.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Pago, TipoPago } from '../../_models/pago';
import { Carrera } from '../../_models/carrera';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';

import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { SedeService } from '../../_services/sede.service';
import { SedeProvider } from '../../_providers/sede.provider';

@Component({
  selector: 'app-listado-pago',
  templateUrl: './listado-pago.component.html',
  styleUrls: ['./listado-pago.component.scss']
})
export class ListadoPagoComponent implements OnInit {
  @ViewChild(DataTableDirective,{static:false})dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: Pago[] = [];
  departamentos:Departamento[]=[];
  carreras:Carrera[]=[];
  tipos:TipoPago[]=[];

  request = <FiltroPago>{
    search:"",
    id_tipo_pago:0,
    id_departamento:0,
    id_carrera:0,
    fecha_inicio:"",
    fecha_fin:"",
  };
  constructor(
    private pagoService:PagoService,
    private sedeService:SedeProvider,
    private departamentoService:DepartamentoService,
    private carreraService:CarreraService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
    
  }

  ngOnInit() {
    let id_sede = this.sedeService.getIdSede();
    this.pagoService.sede(id_sede);

    this.departamentoService.getAll().subscribe(response => {
      this.departamentos = response;
    });
    this.carreraService.getAll().subscribe(response=>{
      this.carreras = response;
    });

    this.pagoService.tipos().subscribe(response=>{
      this.tipos = response;
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
        this.pagoService.ajax(that.request).subscribe(resp => {
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
        { data: 'id_tipo_pago' }, 
        { data: 'id_plan_pago' }, 
        { data: 'id_movimiento' },
        { data: 'descripcion' },
        { data: 'monto'},
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
    };
  }

  fecha_inicio(event){
    if(event == null){
      this.request.fecha_inicio = "";
    } else {
      this.request.fecha_inicio = moment(event).format('YYYY-MM-DD');
    }
    this.refrescar();
  }

  fecha_fin(event){
    if(event == null){
      this.request.fecha_fin = "";
    } else {
      this.request.fecha_fin = moment(event).format('YYYY-MM-DD');
    }
    this.refrescar();
  }

  inscripcion(item:Pago){
    this.router.navigate(['academicos','inscripciones',item.id_inscripcion,'ver']);
  }

  ver(item:Pago){
    this.router.navigate(['/cuentacorriente/'+item.id_plan_pago+'/ver']);
  }

  eliminar(item:Carrera){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar Pago","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.pagoService.delete(item.id).subscribe(response=>{
          this.toastr.success('Pago Eliminado', '');
          this.refrescar();
        });
      }
    });
  }

  recibo(item:Pago){
    this.router.navigate(['/cuentacorriente/'+item.id_plan_pago+'/pagos/'+item.id+'/recibo']);
  }

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  reporte(item:Pago){
    let aviso = this.toastr.warning('Preparando descarga', '');
    this.pagoService.reporte(item.id).subscribe(data =>{
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Descarga lista');
      var mediaType = 'application/pdf';
      var blob = new Blob([data], {type: mediaType});
      var filename = "pago-nro_"+item.numero+".pdf";
      //var fileURL = URL.createObjectURL(blob);
      //window.open(fileURL);
      saveAs(blob,filename)
    });
  }

  imprimir(item:Pago){
    let aviso = this.toastr.warning('Preparando descarga', '');
    this.pagoService.reporte(item.id).subscribe(data =>{
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Archivo listo');
      var blob = new Blob([data], {type: 'application/pdf'});
      const blobUrl = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
    });
  }

  exportar(){
    let aviso = this.toastr.warning('Preparando archivo de descarga');
    this.pagoService.exportar(this.request).subscribe(data => {
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Descarga lista');
      saveAs(data,"pagos-"+moment().format('DD.MM.YYYY')+".xlsx");
    });
  }
  
}
