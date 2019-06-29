import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Carrera } from '../../_models/carrera';
import { PlanEstudio } from '../../_models/plan_estudio';
import { PlanService } from '../../_services/plan.service';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { PlanEditarComponent } from '../plan-editar/plan-editar.component';

@Component({
  selector: 'app-carrera-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
  @Output() planSeleccionado = new EventEmitter();
  @Input() carrera:Carrera;
  dtOptions: DataTables.Settings = {};
  dataSource:PlanEstudio[];

  id_sede:number;

  constructor(
    private planService:PlanService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    ) {

  }
  ngOnInit() {
    this.id_sede = +localStorage.getItem('id_sede');
    this.planService.carrera(this.carrera.id);
    this.planService.getAll().subscribe(response=>{
      this.dataSource = response;
    });
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs: [ {
        targets: [5],
        orderable: false
        } ]
    };
  }

  seleccionar(item:PlanEstudio){
    this.planSeleccionado.emit(item);
  }

  nuevo(){
    const modal = this.modalService.show(PlanEditarComponent);
    (<PlanEditarComponent>modal.content).onShow(this.carrera);
    (<PlanEditarComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  editar(item:PlanEstudio){
    const modal = this.modalService.show(PlanEditarComponent);
    (<PlanEditarComponent>modal.content).onShow(this.carrera,item.id);
    (<PlanEditarComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  eliminar(item:PlanEstudio){
    const modal = this.modalService.show(DialogConfirmComponent);
    (<DialogConfirmComponent>modal.content).onShow("Eliminar Plan de Estudio","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.planService.delete(item.id).subscribe(response=>{
          this.toastr.success('Plan de Estudio Eliminado', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(){
    this.dataSource = null;
    this.planService.getAll().subscribe(response=>{
      this.dataSource = response;
    });
  }

  reporte(item:PlanEstudio){
    let aviso = this.toastr.warning('Preparando descarga', '',{
      timeOut:15000,
    });
    this.planService.reporte(item.id).subscribe(data =>{
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Archivo listo');
      var mediaType = 'application/pdf';
      var blob = new Blob([data], {type: mediaType});
      var filename = "plan_estudio-"+item.codigo+".pdf";
      saveAs(blob,filename)
    });
  }

  imprimir(item:PlanEstudio){
    let aviso = this.toastr.warning('Preparando descarga', '',{
      timeOut:15000,
    });
    this.planService.reporte(item.id).subscribe(data =>{
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
