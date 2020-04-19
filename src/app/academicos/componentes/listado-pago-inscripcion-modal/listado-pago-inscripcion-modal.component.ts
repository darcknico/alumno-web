import { Component, OnInit } from '@angular/core';
import { InscripcionService } from '../../../_services/inscripcion.service';
import { Subject } from 'rxjs';
import { Inscripcion } from '../../../_models/inscripcion';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Pago } from '../../../_models/pago';
import { Router } from '@angular/router';
import { DialogConfirmComponent } from '../../../_generic/dialog-confirm/dialog-confirm.component';
import { PagoService } from '../../../_services/pago.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-listado-pago-inscripcion-modal',
  templateUrl: './listado-pago-inscripcion-modal.component.html',
  styleUrls: ['./listado-pago-inscripcion-modal.component.scss']
})
export class ListadoPagoInscripcionModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  dtOptions: DataTables.Settings = {};
  dataSource:Pago[];
  inscripcion:Inscripcion;
  id_sede:number;

  constructor(
    private inscripcionService:InscripcionService,
    private pagoService:PagoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    public bsModalRef: BsModalRef,
    private router: Router,
    ) { 
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      paging:false,
      searching:false,
      info:false,
      ordering:false,
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
    };
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  onShow(inscripcion:Inscripcion){
    this.inscripcion = inscripcion;
    
    this.inscripcionService.sede(inscripcion.id_sede);
    this.pagoService.sede(inscripcion.id_sede);
    this.inscripcionService.pagos(this.inscripcion.id).subscribe(response=>{
      this.dataSource = response;
    });
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

  eliminar(item:Pago){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar Pago","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.pagoService.delete(item.id).subscribe(response=>{
          this.toastr.success('Pago Eliminado', '');
        });
        this.onClose.next(true);
        this.bsModalRef.hide();
      }
    });
  }

  recibo(item:Pago){
    let aviso = this.toastr.warning('Preparando descarga', '');
    this.pagoService.reporte(item.id).subscribe(data =>{
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Archivo listo');
      var mediaType = 'application/pdf';
      var blob = new Blob([data], {type: mediaType});
      var filename = "pago-nro_"+item.numero+".pdf";
      //var fileURL = URL.createObjectURL(blob);
      //window.open(fileURL);
      saveAs(blob,filename)
    });
  }

  estado(item:Pago):string{
    let color="";
    if(!item.estado){
      color = "#F7BECA";
    }
    return color;
  }

}
