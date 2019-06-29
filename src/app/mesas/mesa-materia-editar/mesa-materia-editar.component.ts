import { Component, OnInit, ViewChild } from '@angular/core';
import { MesaExamenMateriaService } from '../../_services/mesa_examen_materia.service';
import { MesaExamenService } from '../../_services/mesa_examen.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MesaExamen, MesaExamenMateria, MesaExamenMateriaAlumno } from '../../_models/mesa.examen';
import { DataTableDirective } from 'angular-datatables';

import * as moment from 'moment';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { BsModalService } from 'ngx-bootstrap';
import { MesaMateriaAlumnoModalComponent } from '../componente/mesa-materia-alumno-modal/mesa-materia-alumno-modal.component';

@Component({
  selector: 'app-mesa-materia-editar',
  templateUrl: './mesa-materia-editar.component.html',
  styleUrls: ['./mesa-materia-editar.component.scss']
})
export class MesaMateriaEditarComponent implements OnInit {
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;

  formulario: FormGroup;
  fecha_inicio:Date;

  dtOptions: any = {};
  dataSource:MesaExamenMateriaAlumno[];
  
  mesa_examen:MesaExamen;
  mesa_examen_materia:MesaExamenMateria;
  consultando = false;

  constructor(
    private mesaExamenMateriaService:MesaExamenMateriaService,
    private mesaExamenService:MesaExamenService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.formulario = this.fb.group({
      fecha: ['', Validators.required],
      fecha_cierre: '',
      hora: ['', Validators.required],
      ubicacion: '',
      libro: '',
      folio: '',
      observaciones: '',
    });
  }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.mesaExamenMateriaService.sede(id_sede);
    this.mesaExamenService.sede(id_sede);

    this.route.params.subscribe(params=>{
      let ids = params['id_mesa_examen_materia'];
      this.mesaExamenMateriaService.getById(ids).subscribe(response=>{
        this.mesa_examen_materia = response;
        let fecha = moment(this.mesa_examen_materia.fecha).toDate();
        if(this.mesa_examen_materia.fecha_cierre){
          let fecha_cierre = moment(this.mesa_examen_materia.fecha_cierre).toDate();
          this.f.fecha_cierre.setValue(fecha_cierre);
        }
        this.f.fecha.setValue(fecha);
        this.f.hora.setValue(fecha);
        this.f.ubicacion.setValue(this.mesa_examen_materia.ubicacion);
        this.f.libro.setValue(this.mesa_examen_materia.libro);
        this.f.folio.setValue(this.mesa_examen_materia.folio);
        this.f.observaciones.setValue(this.mesa_examen_materia.observaciones);
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

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    var item = <MesaExamenMateria>{};
    item.id = this.mesa_examen_materia.id;
    let fecha = moment(this.f.fecha.value);
    let fecha_cierre = moment(this.f.fecha_cierre.value);
    let hora = moment(this.f.hora.value);
    fecha.set('hour',hora.hour());
    fecha.set('minute',hora.minute());
    item.fecha = fecha.format('YYYY-MM-DD HH:mm:00');
    item.fecha_cierre = fecha_cierre.format('YYYY-MM-DD');
    item.ubicacion = this.f.ubicacion.value;
    item.libro = this.f.libro.value;
    item.folio = this.f.folio.value;
    item.observaciones = this.f.observaciones.value;

    this.consultando = true;
    this.mesaExamenMateriaService.update(item).subscribe(resposne=>{
      this.toastr.success('Mesa de examen editada', '');
      this.volver();
    },err=>{
      this.consultando = false;
    });
  }

  alumno_desasociar(alumno:MesaExamenMateriaAlumno){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Dar de baja al alumno de la mesa de examen","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        var item = <MesaExamenMateriaAlumno>{};
        item.id_mesa_examen_materia = this.mesa_examen_materia.id;
        item.id_alumno = alumno.id_alumno;
        this.mesaExamenMateriaService.alumno_desasociar(item).subscribe(response=>{
          this.toastr.success('Inscripcion del alumno dado de baja', '');
          this.refrescar();
        });
      }
    });
  }

  alumno_editar(alumno:MesaExamenMateriaAlumno){
    const modal = this.modalService.show(MesaMateriaAlumnoModalComponent);
    (<MesaMateriaAlumnoModalComponent>modal.content).onShow(alumno);
    (<MesaMateriaAlumnoModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  excel(){
    let aviso = this.toastr.warning('Preparando archivo de descarga');
    this.mesaExamenMateriaService.check_in(this.mesa_examen_materia.id).subscribe(data => {
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Descarga lista');
      saveAs(data,"mesa_examen-"+this.mesa_examen_materia.materia.codigo+"-"+moment(this.mesa_examen_materia.fecha).format('DD.MM.YYYY')+".xlsx");
    });
  }

  acta_reporte(){
    let aviso = this.toastr.warning('Preparando descarga', '');
    this.mesaExamenMateriaService.reporte_acta(this.mesa_examen_materia.id).subscribe(data =>{
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Descarga lista');
      var mediaType = 'application/pdf';
      var blob = new Blob([data], {type: mediaType});
      var filename = "acta-nro_"+this.mesa_examen_materia.id+".pdf";
      //var fileURL = URL.createObjectURL(blob);
      //window.open(fileURL);
      saveAs(blob,filename)
    });
  }

  acta_imprimir(){
    let aviso = this.toastr.warning('Preparando descarga', '');
    this.mesaExamenMateriaService.reporte_acta(this.mesa_examen_materia.id).subscribe(data =>{
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

  refrescar(){
    this.dataSource = null;
    this.mesaExamenMateriaService.alumnos(this.mesa_examen_materia.id).subscribe(response=>{
      this.dataSource = response;
    });
  }

  notas(){
    this.router.navigate(['/mesas/materias/'+this.mesa_examen_materia.id+'/ver']);
  }

  volver_mesa_examen(){
    this.router.navigate(['/mesas/'+this.mesa_examen_materia.id_mesa_examen+'/editar']);
  }

  volver(){
    this.router.navigate(['/mesas/materias']);
  }

}
