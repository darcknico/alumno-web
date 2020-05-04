import { Component, OnInit } from '@angular/core';
import { TipoInscripcionAbandonoService } from '../../_services/tipo_inscripcion_abandono.service.';
import { TipoInscripcionAbandono } from '../../_models/tipo';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { TipoInscripcionAbandonoEditarModalComponent } from '../tipo-inscripcion-abandono-editar-modal/tipo-inscripcion-abandono-editar-modal.component';

@Component({
  selector: 'app-tipo-inscripcion-abandono',
  templateUrl: './tipo-inscripcion-abandono.component.html',
  styleUrls: ['./tipo-inscripcion-abandono.component.scss']
})
export class TipoInscripcionAbandonoComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dataSource:TipoInscripcionAbandono[];

  id_sede:number;

  constructor(
    private service:TipoInscripcionAbandonoService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    ) {

  }
  ngOnInit() {
    this.service.getAll().subscribe(response=>{
      this.dataSource = response;
    });
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs: [ {
        targets: [2,3],
        orderable: false
        } ]
    };
  }

  nuevo(){
    const modal = this.modalService.show(TipoInscripcionAbandonoEditarModalComponent,{class: 'modal-success'});
    (<TipoInscripcionAbandonoEditarModalComponent>modal.content).onShow();
    (<TipoInscripcionAbandonoEditarModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  editar(item:TipoInscripcionAbandono){
    const modal = this.modalService.show(TipoInscripcionAbandonoEditarModalComponent,{class: 'modal-primary'});
    (<TipoInscripcionAbandonoEditarModalComponent>modal.content).onShow(item);
    (<TipoInscripcionAbandonoEditarModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  eliminar(item:TipoInscripcionAbandono){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar Tipo de Abandono","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.service.delete(item.id).subscribe(response=>{
          this.toastr.success('Tipo de Abandono eliminado', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(){
    this.dataSource = null;
    this.service.getAll().subscribe(response=>{
      this.dataSource = response;
    });
  }
}
