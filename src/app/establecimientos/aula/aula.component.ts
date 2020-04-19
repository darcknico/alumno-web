import { Component, OnInit } from '@angular/core';
import { AulaService } from '../../_services/aula.service';
import { Aula } from '../../_models/aula';
import { Sede } from '../../_models/sede';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { AulaEditarModalComponent } from '../aula-editar-modal/aula-editar-modal.component';

@Component({
  selector: 'app-aula',
  templateUrl: './aula.component.html',
  styleUrls: ['./aula.component.scss']
})
export class AulaComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dataSource:Aula[];
  sede:Sede;

  constructor(
    private AulaService:AulaService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    ) {

  }
  ngOnInit() {
    this.AulaService.getAll().subscribe(response=>{
      this.dataSource = response;
    });
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs: [ {
        targets: [3],
        orderable: false
        } ]
    };
  }

  nuevo(){
    const modal = this.modalService.show(AulaEditarModalComponent,{class: 'modal-success'});
    (<AulaEditarModalComponent>modal.content).onShow();
    (<AulaEditarModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  editar(item:Aula){
    const modal = this.modalService.show(AulaEditarModalComponent,{class: 'modal-info'});
    (<AulaEditarModalComponent>modal.content).onShow(item);
    (<AulaEditarModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  eliminar(item:Aula){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar Aula","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.AulaService.delete(item.id).subscribe(response=>{
          this.toastr.success('Aula Eliminado', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(){
    this.dataSource = null;
    this.AulaService.getAll().subscribe(response=>{
      this.dataSource = response;
    });
  }
}
