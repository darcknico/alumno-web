import { Component, OnInit, ViewChild } from '@angular/core';
import { Diaria } from '../../_models/diaria';
import { DiariaService, FiltroDiaria } from '../../_services/diaria.service';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap';
import { Alumno } from '../../_models/alumno';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-listado-diaria',
  templateUrl: './listado-diaria.component.html',
  styleUrls: ['./listado-diaria.component.scss']
})
export class ListadoDiariaComponent implements OnInit {
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: Diaria[] = [];

  request = <FiltroDiaria>{
    search:"",
  };
  constructor(
    private diariaService:DiariaService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    ) {
      
  }

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
        that.request.start = dataTablesParameters.start;
        that.request.length = dataTablesParameters.length;
        that.request.order = dataTablesParameters.order[0].dir;
        that.request.search = dataTablesParameters.search.value;
        that.request.sort = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        this.diariaService.ajax(that.request).subscribe(resp => {
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
          width: '5%', 
        }, { data: 'saldo_anterior' }, { data: 'total_ingresos' },{ data: 'total_egresos'},{data:'saldo'},{data:'actions'}
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
    };
  }

  ver(item:Diaria){
    this.router.navigate(['/movimientos/diarias/'+item.id+'/ver']);
  }

  nuevo(){
    this.router.navigate(['/movimientos/diarias/nuevo']);
  }

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  exportar(item:Diaria){
    let aviso = this.toastr.warning('Preparando archivo de descarga.');
    let fecha = moment(item.fecha_inicio);
    this.diariaService.exportar(item.id).subscribe(data => {
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Descarga lista.');
      saveAs(data,"diaria-"+fecha.format('YYYY-MM-DD')+".xlsx");
    });
  }

  eliminar(item:Alumno){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Descartar diaria","Los movimientos que lo comprenden no seran eliminados.");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.diariaService.delete(item.id).subscribe(response=>{
          this.toastr.success('Diaria eliminada', '');
          this.refrescar();
        });
      }
    });
  }
  
}
