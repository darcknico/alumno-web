import { Component, OnInit } from '@angular/core';
import { NovedadSistemaService } from '../../_services/novedad_sistema.service';
import { NovedadSistema } from '../../_models/novedad';
import { NovedadNuevoModalComponent } from '../novedad-nuevo-modal/novedad-nuevo-modal.component';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Plantilla } from '../../_models/plantilla';

@Component({
  selector: 'app-novedad',
  templateUrl: './novedad.component.html',
  styleUrls: ['./novedad.component.scss']
})
export class NovedadComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dataSource:NovedadSistema[];

  id_sede:number;

  constructor(
    private service:NovedadSistemaService,
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
      columns:[
        {
          name:'created_at',
        },
        {
          name:'titulo',
        },
        {
          name:'descripcion',
        },
        {
          name: 'mostrar',
        },
        {
          name: 'actions',
        }
      ],
      ordering:false,
      searching:false,
    };
  }

  nuevo(){
    const modal = this.modalService.show(NovedadNuevoModalComponent,{class: 'modal-lg'});
    (<NovedadNuevoModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        
      }
    });
  }

  editar(item:NovedadSistema){
    this.router.navigate(['/admin/novedades/'+item.id+'/editar']);
  }

  eliminar(item:NovedadSistema){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar novedad","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.service.delete(item.id).subscribe(response=>{
          this.toastr.success('Novedad eliminada', '');
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

  /**
   * PREUBA DE CORREO
   */

  previa(item:NovedadSistema){
    var wnd = window.open("about:blank", "", "_blank,width = 600, height = 800");
    this.service.getById(item.id).subscribe(response=>{
      wnd.document.write(response.cuerpo);
    });
  }

  mostrar(item:NovedadSistema){
    item.mostrar = !item.mostrar;
    this.service.mostrar(item).subscribe(response=>{
      if(item.mostrar){
        this.toastr.success('Novedad publicada', '');
      } else {
        this.toastr.success('Novedad ocultada', '');
      }
    });
  }
}
