import { Component, OnInit } from '@angular/core';
import { Modalidad } from '../../_models/modalidad';
import { ModalidadService } from '../../_services/modalidad.service';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modalidad',
  templateUrl: './modalidad.component.html',
  styleUrls: ['./modalidad.component.scss']
})
export class ModalidadComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dataSource:Modalidad[];

  id_sede:number;

  constructor(
    private modalidadService:ModalidadService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    ) {

  }
  ngOnInit() {
    this.id_sede = +localStorage.getItem('id_sede');
    this.modalidadService.getAll().subscribe(response=>{
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
    this.router.navigate(['/establecimientos/modalidades/nuevo']);
  }

  editar(item:Modalidad){
    this.router.navigate(['/establecimientos/modalidades/'+item.id+'/editar']);
  }

  eliminar(item:Modalidad){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar Modalidad","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.modalidadService.delete(item.id).subscribe(response=>{
          this.toastr.success('Modalidad Eliminado', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(){
    this.dataSource = null;
    this.modalidadService.getAll().subscribe(response=>{
      this.dataSource = response;
    });
  }
}
