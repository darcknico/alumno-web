import { Component, OnInit } from '@angular/core';
import { Pago } from '../../_models/pago';
import { PlanPago } from '../../_models/plan_pago';
import { PlanPagoService } from '../../_services/plan_pago.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PagoService } from '../../_services/pago.service';
import { ObligacionPago } from '../../_models/obligacion';

import { saveAs } from 'file-saver';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pago-recibo',
  templateUrl: './pago-recibo.component.html',
  styleUrls: ['./pago-recibo.component.scss']
})
export class PagoReciboComponent implements OnInit {
  id:number;
  id_pago:number;
  plan_pago:PlanPago;
  pago:Pago;
  dtOptions: DataTables.Settings = {};
  dataSource:ObligacionPago[];
  constructor(
    private planPagoService:PlanPagoService,
    private pagoService:PagoService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private location: Location,
    ) {
      this.dtOptions = {
        language: {
          url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        paging:false,
        searching:false,
        lengthChange:false,
        info:false,
        ordering:false,
      };
    }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.pagoService.sede(id_sede);
    this.route.params.subscribe(params=>{
      this.id = +params['id_plan_pago'];
      this.id_pago = +params['id_pago'];
      this.iniciar();
    });
  }

  iniciar(){
    this.planPagoService.getById(this.id).subscribe(response=>{
      this.plan_pago = response;
    });
    this.pagoService.getById(this.id_pago).subscribe(response=>{
      this.pago = response;
      this.dataSource = this.pago.detalles;
    });
  }

  volver(){
    this.location.back();
  }

  cuenta(){
    this.router.navigate(['cuentacorriente',this.plan_pago.id,'ver'])
  }

  reporte(){
    let aviso = this.toastr.warning('Preparando descarga', '',{
      timeOut:15000,
    });
    this.pagoService.reporte(this.pago.id).subscribe(data =>{
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Archivo listo');
      var mediaType = 'application/pdf';
      var blob = new Blob([data], {type: mediaType});
      var filename = "pago-nro_"+this.pago.numero+".pdf";
      //var fileURL = URL.createObjectURL(blob);
      //window.open(fileURL);
      saveAs(blob,filename)
    });
  }

  imprimir(){
    let aviso = this.toastr.warning('Preparando descarga', '',{
      timeOut:15000,
    });
    this.pagoService.reporte(this.pago.id).subscribe(data =>{
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
}
