import { Component, OnInit } from '@angular/core';
import { PlantillaService } from '../../_services/plantilla.service';
import { Plantilla } from '../../_models/plantilla';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DialogInputComponent } from '../../_generic/dialog-input/dialog-input.component';
import { PlantillaNuevaModalComponent } from '../plantilla-nueva-modal/plantilla-nueva-modal.component';

@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  styleUrls: ['./plantilla.component.scss']
})
export class PlantillaComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dataSource:Plantilla[];

  id_sede:number;

  constructor(
    private plantillaService:PlantillaService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    ) {

  }
  ngOnInit() {
    this.id_sede = +localStorage.getItem('id_sede');
    this.plantillaService.sede(this.id_sede);
    this.plantillaService.getAll().subscribe(response=>{
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
    const modal = this.modalService.show(PlantillaNuevaModalComponent,{class: 'modal-lg'});
    (<PlantillaNuevaModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        
      }
    });
  }

  editar(item:Plantilla){
    this.router.navigate(['/notificaciones/plantillas/'+item.id+'/editar']);
  }

  eliminar(item:Plantilla){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar plantilla","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.plantillaService.delete(item.id).subscribe(response=>{
          this.toastr.success('Plantilla eliminada', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(){
    this.dataSource = null;
    this.plantillaService.getAll().subscribe(response=>{
      this.dataSource = response;
    });
  }

  /**
   * PREUBA DE CORREO
   */

  enviar(item:Plantilla):void{
    const modal = this.modalService.show(DialogInputComponent,{class: 'modal-info'});
    (<DialogInputComponent>modal.content).onShow("Enviar prueba","Ingrese el correo del destinatario","email");
    (<DialogInputComponent>modal.content).onClose.subscribe(result => {
      if (result.length>0) {
        item.destino = result;
        this.plantillaService.enviar(item).subscribe(response=>{
          this.toastr.success('Correo enviado', '');
        });
      }
    });
  }

  previa(item:Plantilla){
    var wnd = window.open("about:blank", "", "_blank,width = 600, height = 800");
    this.plantillaService.getById(item.id).subscribe(response=>{
      wnd.document.write(response.cuerpo);
    });
    
  }
}
