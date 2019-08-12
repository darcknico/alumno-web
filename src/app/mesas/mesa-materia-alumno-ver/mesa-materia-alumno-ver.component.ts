import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MesaExamen, MesaExamenMateriaAlumno, MesaExamenMateria } from '../../_models/mesa.examen';
import { MesaExamenMateriaService } from '../../_services/mesa_examen_materia.service';
import { MesaExamenService } from '../../_services/mesa_examen.service';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import {Location} from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-mesa-materia-alumno-ver',
  templateUrl: './mesa-materia-alumno-ver.component.html',
  styleUrls: ['./mesa-materia-alumno-ver.component.scss']
})
export class MesaMateriaAlumnoVerComponent implements OnInit {
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  
  mesa_examen:MesaExamen;
  mesa_examen_materia:MesaExamenMateria;

  dtOptions: DataTables.Settings = {};
  dataSource:MesaExamenMateriaAlumno[];
  formulario: FormGroup;
  fecha_inicio:Date;

  @ViewChild('fileInput') fileInput: ElementRef;
  file:any=null;
  importacionDataSource:any;
  erroresDataSource:any;
  constructor(
    private mesaExamenMateriaService:MesaExamenMateriaService,
    private mesaExamenService:MesaExamenService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private location: Location,
  ) { 
    this.formulario = this.fb.group({
      fecha_cierre: ['', Validators.required],
      libro: '',
      folio_libre: '',
      folio_promocion: '',
      folio_regular: '',
      observaciones:'',
      alumnos:null,
    });
  }

  ngOnInit() {
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      searching:false,
      paging:false,
      columnDefs: [ {
        targets: 'no-sort',
        width:'9%',
        orderable: false,
        },{
          targets: [ 0 ],
          visible: false,
          searchable: false,
        },
      ],
    };
    this.route.params.subscribe(params=>{
      let ids = params['id_mesa_examen_materia'];
      this.mesaExamenMateriaService.getById(ids).subscribe(response=>{
        this.mesa_examen_materia = response;
        this.f.observaciones.setValue(this.mesa_examen_materia.observaciones);
        this.f.libro.setValue(this.mesa_examen_materia.libro);
        this.f.folio_libre.setValue(this.mesa_examen_materia.folio_libre);
        this.f.folio_promocion.setValue(this.mesa_examen_materia.folio_promocion);
        this.f.folio_regular.setValue(this.mesa_examen_materia.folio_regular);
        let fecha_cierre = moment(this.mesa_examen_materia.fecha_cierre);
        if(fecha_cierre.isValid()){
          this.f.fecha_cierre.setValue(fecha_cierre.toDate());
        }

        this.mesaExamenService.getById(this.mesa_examen_materia.id_mesa_examen).subscribe(response=>{
          this.mesa_examen = response;
          this.fecha_inicio = moment(this.mesa_examen.fecha_inicio).toDate();
        });
      });
      
      this.mesaExamenMateriaService.alumnos(ids).subscribe(response=>{
        this.dataSource = response;
      });
    });
  }

  get f(){
    return this.formulario.controls;
  }

  exportar(){
    let aviso = this.toastr.warning('Preparando archivo de descarga');
    this.mesaExamenMateriaService.check_in(this.mesa_examen_materia.id).subscribe(data => {
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Descarga lista');
      saveAs(data,"mesa_examen-"+this.mesa_examen_materia.materia.codigo+"-"+moment(this.mesa_examen_materia.fecha).format('DD.MM.YYYY')+".xlsx");
    });
  }

  volver(){
    this.location.back();
  }

  ver_mesa_examen(){
    this.router.navigate(['/mesas/'+this.mesa_examen.id+'/editar']);
  }

  cerrar(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      let indexs = dtInstance.rows();
      var notas = [];
      for (let index = 0; index < indexs.length; index++) {
        let row = indexs[index];
        var item = <MesaExamenMateriaAlumno>{};
        item.id = +dtInstance.cell(row,0).data();
        item.asistencia = Boolean($(dtInstance.cell(row,4).node()).find('input'));
        item.nota_final = +$(dtInstance.cell(row,5).node()).find('input').val();
        notas.push(item);
      }
      this.mesa_examen_materia.alumnos = notas;
      const modal = this.modalService.show(DialogConfirmComponent);
      (<DialogConfirmComponent>modal.content).onShow(
        "Cerrar mesa de examen",
        "Esta por registrar las notas de "+notas.length+" alumno/s.¿Desea Continuar?");
      (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
        if (result === true) {
          let fecha_cierre = moment(this.f.fecha_cierre.value);
          if(fecha_cierre.isValid()){
            this.mesa_examen_materia.fecha_cierre = fecha_cierre.format('YYYY-MM-DD');
          }
          this.mesa_examen_materia.observaciones = this.f.observaciones.value;
          this.mesa_examen_materia.libro = this.f.libro.value;
          this.mesa_examen_materia.folio_libre = this.f.folio_libre.value;
          this.mesa_examen_materia.folio_promocion = this.f.folio_promocion.value;
          this.mesa_examen_materia.folio_regular = this.f.folio_regular.value;
          this.mesaExamenMateriaService.check_out(this.mesa_examen_materia).subscribe(response=>{
            this.toastr.success('Mesa cerrada', '');
            this.volver();
          });
        }
      });
    });
  }

   /**
   * ARCHIVOS
   */

  onFileChange(event) {
    if(event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.fileInput.nativeElement.value = "";
      let aviso = this.toastr.warning('Importando archivo');
      this.mesaExamenMateriaService.check_out_previa(this.mesa_examen_materia.id,this.file).subscribe((response:any) => {
        this.importacionDataSource = [];
        this.erroresDataSource = [];
        this.toastr.remove(aviso.toastId);
        this.toastr.success('Importacion terminada', '');

        response.forEach(element => {
          if(element.asistencia != null && element.id_mesa_examen_materia_alumno>0){
            this.importacionDataSource.push(element);
          } 
          if( element.asistencia == null){
            element.asistencia = "El tipo de asistencia no corresponde";
            this.erroresDataSource.push(element);
          }
          if(element.id_mesa_examen_materia_alumno == 0){
            element.asistencia = "El alumno no pertenece al listado de asistencia";
            this.erroresDataSource.push(element);
          }
        });
        if(this.erroresDataSource.length == 0){
          this.erroresDataSource = null;
        }
        if(this.importacionDataSource.length == 0){
          this.importacionDataSource = null;
        }
      });
    }
  }

  cancelar(){
    this.file = null;
  }

}
