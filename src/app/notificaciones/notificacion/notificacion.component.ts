import { Component, OnInit } from '@angular/core';
import { Notificacion } from '../../_models/notificacion';
import { NotificacionService } from '../../_services/notificacion.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.scss']
})
export class NotificacionComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dataSource:Notificacion[];
  enviadasDataSource:Notificacion[];
  id_sede:number;
  constructor(
    private notificacionService:NotificacionService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    ) {

  }
  ngOnInit() {
    this.id_sede = +localStorage.getItem('id_sede');
    this.notificacionService.sede(this.id_sede);
    this.notificacionService.getAll().subscribe(response=>{
      this.dataSource = response;
    });
    this.notificacionService.enviadas().subscribe(response=>{
      this.enviadasDataSource = response;
    });

    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ]
    };
  }

  nuevo(){
    this.router.navigate(['/notificaciones/notificaciones/nuevo']);
  }

  editar(item:Notificacion){
    this.router.navigate(['/notificaciones/notificaciones/'+item.id+'/editar']);
  }

  ver(item:Notificacion){
    this.router.navigate(['/notificaciones/notificaciones/'+item.id+'/ver']);
  }

  desplegar(item:Notificacion){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-warning'});
    (<DialogConfirmComponent>modal.content).onShow("Enviar las notificaciones ahora","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.notificacionService.desplegar(item).subscribe(response=>{
          this.toastr.success('Notificacion enviada', '');
          this.refrescar();
        });
      }
    });
  }
  
  reenviar(){

  }

  eliminar(item:Notificacion){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar notificacion","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.notificacionService.delete(item.id).subscribe(response=>{
          this.toastr.success('Notificacion eliminada', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(){
    this.dataSource = null;
    this.notificacionService.getAll().subscribe(response=>{
      this.dataSource = response;
    });
    this.notificacionService.enviadas().subscribe(response=>{
      this.enviadasDataSource = response;
    });
  }

}
