import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Asistencia, AsistenciaAlumno, TipoAsistenciaAlumno } from '../../_models/asistencia';
import { AsistenciaService } from '../../_services/asistencia.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-asistencia-ver',
  templateUrl: './asistencia-ver.component.html',
  styleUrls: ['./asistencia-ver.component.scss']
})
export class AsistenciaVerComponent implements OnInit {

  asistencia:Asistencia;

  dtOptions: DataTables.Settings = {};
  dataSource:AsistenciaAlumno[];
  tipos_asistencia:TipoAsistenciaAlumno[]=[]; 

  @ViewChild('fileInput',{static:false}) fileInput: ElementRef;
  file:any=null;
  importacionDataSource:any;
  erroresDataSource:any;
  constructor(
    private asistenciaService:AsistenciaService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.asistenciaService.sede(id_sede);

    this.asistenciaService.tipos().subscribe(response=>{
      this.tipos_asistencia = response;
    });

    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs: [ {
        targets: [3],
        orderable: false,
        } ]
    };

    this.route.params.subscribe(params=>{
      let ids = params['id_asistencia'];
      this.asistenciaService.getById(ids).subscribe(response=>{
        this.asistencia = response;
      });
      this.asistenciaService.alumnos(ids).subscribe(response=>{
        this.dataSource = response;
      });
    });
  }

  cambiar_asistencia(event,asistencia:AsistenciaAlumno){
    asistencia.id_tipo_asistencia_alumno = event.target.value;
    let aviso = this.toastr.warning('Confirmando asistencia');
    this.asistenciaService.alumno(asistencia).subscribe(data => {
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Asistencia cambiada');
    });
  }

  exportar(){
    let aviso = this.toastr.warning('Preparando archivo de descarga');
    this.asistenciaService.check_in(this.asistencia.id).subscribe(data => {
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Descarga lista');
      saveAs(data,"pagos-"+moment().format('DD.MM.YYYY')+".xlsx");
    });
  }

  volver(){
    this.router.navigate(['/asistencias']);
  }

  comision(){
    this.router.navigate(['/comisiones/'+this.asistencia.id_comision+'/ver']);
  }

   /**
   * ARCHIVOS
   */

  onFileChange(event) {
    if(event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.fileInput.nativeElement.value = "";
      let aviso = this.toastr.warning('Importando archivo');
      this.asistenciaService.check_out_previa(this.asistencia.id,this.file).subscribe((response:any) => {
        this.importacionDataSource = [];
        this.erroresDataSource = [];
        this.toastr.remove(aviso.toastId);
        this.toastr.success('Importacion terminada', '');

        response.forEach(element => {
          if(element.id_tipo_asistencia_alumno>0 && element.id_asistencia_alumno>0){
            this.importacionDataSource.push(element);
          } 
          if( element.id_tipo_asistencia_alumno == 0){
            element.asistencia = "El tipo de asistencia no corresponde";
            this.erroresDataSource.push(element);
          }
          if(element.id_asistencia_alumno == 0){
            element.asistencia = "El alumno no pertenece al listado de asistencia";
            this.erroresDataSource.push(element);
          }
        });
      });
    }
  }

  cancelar(){
    this.file = null;
  }

  continuar(){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-info'});
    (<DialogConfirmComponent>modal.content).onShow("Confirmar importacion desde excel","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        let aviso = this.toastr.warning('Importando archivo');
        this.asistenciaService.check_out(this.asistencia.id,this.file).subscribe(response=>{
          this.toastr.remove(aviso.toastId);
          this.toastr.success('Importacion terminada', '');
          this.volver();
        });
      }
    });
  }
}
