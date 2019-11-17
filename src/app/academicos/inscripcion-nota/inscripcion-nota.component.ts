import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InscripcionService } from '../../_services/inscripcion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Inscripcion } from '../../_models/inscripcion';
import { AlumnoMateriaNota } from '../../_models/mesa.examen';
import { AlumnoMateriaNotaModalComponent } from '../componentes/alumno-materia-nota-modal/alumno-materia-nota-modal.component';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';

import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { AuxiliarFunction } from '../../_helpers/auxiliar.function';

@Component({
  selector: 'app-inscripcion-nota',
  templateUrl: './inscripcion-nota.component.html',
  styleUrls: ['./inscripcion-nota.component.scss']
})
export class InscripcionNotaComponent implements OnInit {

  id_sede:number;
  inscripcion:Inscripcion;
  dtOptions: DataTables.Settings = {};
  dataSource:AlumnoMateriaNota[];
  
  @ViewChild('fileInput') fileInput: ElementRef;
  file:any=null;
  importacionDataSource:any;
  erroresDataSource:any;
  consultando:boolean = false;  
  constructor(
    private inscripcionService:InscripcionService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.id_sede = +localStorage.getItem('id_sede');
    this.inscripcionService.sede(this.id_sede);
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
    this.route.params.subscribe(query=>{
      let id_inscripcion = query['id_inscripcion'];
      if(id_inscripcion){
        this.inscripcionService.getById(+id_inscripcion).subscribe(response=>{
          this.inscripcion = response;
        });
        this.inscripcionService.notas(+id_inscripcion).subscribe(response=>{
          this.dataSource = response;
        });
      }
    });
  }

  agregar(){
    const modal = this.modalService.show(AlumnoMateriaNotaModalComponent);
    (<AlumnoMateriaNotaModalComponent>modal.content).onShow(this.inscripcion);
    (<AlumnoMateriaNotaModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  editar(item:AlumnoMateriaNota){
    const modal = this.modalService.show(AlumnoMateriaNotaModalComponent);
    (<AlumnoMateriaNotaModalComponent>modal.content).onShow(this.inscripcion,item);
    (<AlumnoMateriaNotaModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  eliminar(item:AlumnoMateriaNota){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar nota");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.inscripcionService.notas_delete(item).subscribe(response=>{
          this.toastr.success('Nota eliminada', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(){
    this.dataSource = null;
    this.inscripcionService.notas(this.inscripcion.id).subscribe(response=>{
      this.dataSource = response;
    });
  }

  importar_ejemplo(){
    let aviso = this.toastr.warning('Preparando archivo de descarga','',{
      timeOut:15000,
    });
    this.inscripcionService.notas_importar_ejemplo().subscribe(data => {
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Descarga lista');
      saveAs(data,"notas_ejemplo.xlsx");
    });
  }

  /**
   * ARCHIVOS
   */

  onFileChange(event) {
    if(event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.fileInput.nativeElement.value = "";
      let aviso = this.toastr.warning('Importando archivo','',{
        timeOut:15000,
      });
      this.inscripcionService.notas_importar_previa(this.inscripcion.id,this.file).subscribe((response:any) => {
        this.importacionDataSource = [];
        this.erroresDataSource = [];
        this.toastr.remove(aviso.toastId);
        this.toastr.success('Importacion terminada', '');

        response.forEach(element => {
          if(element.id_condicionalidad>0 && element.id_materia>0 && element.fecha !=null){
            this.importacionDataSource.push(element);
          }
          if( element.fecha == null){
            element.error = "La fecha no es valida";
            this.erroresDataSource.push(element);
          }
          if( element.id_condicionalidad == null){
            element.error = "El tipo de condicionalidad no corresponde";
            this.erroresDataSource.push(element);
          }
          if(element.id_materia == null){
            element.asistencia = "La materia no corresponde a ninguna";
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
        this.inscripcionService.notas_importar(this.inscripcion.id,this.file).subscribe(response=>{
          this.file = null;
          this.toastr.remove(aviso.toastId);
          this.toastr.success('Importacion terminada', '');
          this.refrescar();
        });
      }
    });
  }

  analitico_reporte(){
    this.consultando = true;
    AuxiliarFunction.descargar(this.toastr,this.inscripcionService.reporte_analitico(this.inscripcion.id)).then(()=>{
      this.consultando = false;
    }).catch( ()=>{
      this.consultando = false;
    });
  }

  analitico_imprimir(){
    this.consultando = true;
    AuxiliarFunction.imprimir(this.toastr,this.inscripcionService.reporte_analitico(this.inscripcion.id)).then(()=>{
      this.consultando = false;
    }).catch( ()=>{
      this.consultando = false;
    });
  }
}
