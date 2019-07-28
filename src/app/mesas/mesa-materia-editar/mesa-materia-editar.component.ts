import { Component, OnInit, ViewChild, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { MesaExamenMateriaService } from '../../_services/mesa_examen_materia.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MesaExamen, MesaExamenMateria, MesaExamenMateriaAlumno, MesaExamenMateriaDocente } from '../../_models/mesa.examen';
import { DataTableDirective } from 'angular-datatables';

import * as moment from 'moment';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { BsModalService } from 'ngx-bootstrap';
import { MesaMateriaAlumnoModalComponent } from '../componente/mesa-materia-alumno-modal/mesa-materia-alumno-modal.component';
import { MesaMateriaEditarModalComponent } from '../componente/mesa-materia-editar-modal/mesa-materia-editar-modal.component';
import { MesaMateriaDocenteEditarModalComponent } from '../componente/mesa-materia-docente-editar-modal/mesa-materia-docente-editar-modal.component';
import { MesaExamenMateriaDocenteService } from '../../_services/mesa_examen_materia_docente.service';
import { Subject } from 'rxjs/internal/Subject';
import { AuxiliarFunction } from '../../_helpers/auxiliar.function';
import { MesaExamenMateriaAlumnoService } from '../../_services/mesa_examen_materia_alumno.service';

@Component({
  selector: 'app-mesa-materia-editar',
  templateUrl: './mesa-materia-editar.component.html',
  styleUrls: ['./mesa-materia-editar.component.scss']
})
export class MesaMateriaEditarComponent implements OnInit,OnDestroy {
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;

  formulario: FormGroup;
  fecha_inicio:Date;

  dtOptions: DataTables.Settings = {};
  dtOptionsDocente: DataTables.Settings = {};
  dataSource:MesaExamenMateriaAlumno[];
  dataSourceDocente:MesaExamenMateriaDocente[];
  
  mesa_examen:MesaExamen;
  mesa_examen_materia:MesaExamenMateria;
  consultando = false;

  dtTrigger: Subject<any> = new Subject();
  dtTriggerDocente: Subject<any> = new Subject();
  constructor(
    private mesaExamenMateriaService:MesaExamenMateriaService,
    private mesaExamenMateriaDocenteService:MesaExamenMateriaDocenteService,
    private mesaExamenMateriaAlumnoService:MesaExamenMateriaAlumnoService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.dtOptions = {
      order: [[ 0, "desc" ]],
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      columns: [
        { 
          data: 'created_at',
          width: '5%', 
        },
        { 
          data: 'id_usuario',
        },
        { 
          data: 'id_alumno',
        },
        { 
          data: 'id_comision',
        },
        { 
          data: 'nota',
        },
        { 
          data: 'id_tipo_condicion_alumno',
          visible:false,
        },
        {
          data:'Adeuda',
          width: '5%', 
        },
        { 
          data: 'id_comision_alumno',
        },
        { 
          width: '5%', 
        },
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
      responsive:true,
      drawCallback: function ( settings ) {
        var api = this.api();
        var rows = api.rows( {page:'current'} ).nodes();
        var last=null; 
        api.column(5, {page:'current'} ).data().each( function ( group, i ) {
            if ( last !== group ) {
                $(rows).eq( i ).before(
                    '<tr style="background-color:#dedede" class="group text-center"><th colspan="8">'+group+'</th></tr>'
                ); 
                last = group;
            }
        });
      }
    };
  }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      let ids = params['id_mesa_examen_materia'];
      this.mesaExamenMateriaService.getById(ids).subscribe(response=>{
        this.mesa_examen_materia = response;
        this.mesa_examen = response.mesa_examen;
      });
      this.mesaExamenMateriaService.alumnos(ids).subscribe(response=>{
        this.dataSource = response;
        this.dtTrigger.next();
      });
      this.mesaExamenMateriaService.docentes(ids).subscribe(response=>{
        this.dataSourceDocente = response;
        this.dtTriggerDocente.next();
      });
    });
    this.dtOptionsDocente = {
      order: [[ 0, "desc" ]],
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      searching:false,
      paging:false,
      columns: [
        { 
          data: 'created_at',
          width: '5%', 
        },
        { 
          data: 'id_usuario',
        },
        { 
          data: 'id_tipo_mesa_docente',
        },
        { 
          width: '5%', 
        },
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
      responsive:true,
    };
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTriggerDocente.unsubscribe();
  }

  editar(){
    const modal = this.modalService.show(MesaMateriaEditarModalComponent,{class: 'modal-info modal-lg'});
    (<MesaMateriaEditarModalComponent>modal.content).onShow(this.mesa_examen.id,this.mesa_examen_materia);
    (<MesaMateriaEditarModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.mesaExamenMateriaService.getById(this.mesa_examen_materia.id).subscribe(response=>{
          this.mesa_examen_materia = response;
        });
      }
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

  docente_agregar(){
    const modal = this.modalService.show(MesaMateriaDocenteEditarModalComponent,{class: 'modal-info'});
    (<MesaMateriaDocenteEditarModalComponent>modal.content).onShow(this.mesa_examen_materia.id);
    (<MesaMateriaDocenteEditarModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescarDocente();
      }
    });
  }

  docente_editar(item:MesaExamenMateriaDocente){
    const modal = this.modalService.show(MesaMateriaDocenteEditarModalComponent,{class: 'modal-info'});
    (<MesaMateriaDocenteEditarModalComponent>modal.content).onShow(this.mesa_examen_materia.id,item);
    (<MesaMateriaDocenteEditarModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescarDocente();
      }
    });
  }

  docente_desasociar(item:MesaExamenMateriaDocente){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Remover al docente de la mesa de examen","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.mesaExamenMateriaDocenteService.delete(item.id).subscribe(response=>{
          this.toastr.success('Docente removido', '');
          this.refrescarDocente();
        });
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

  acta_reporte(id_tipo_condicion_alumno:number=3){
    let aviso = this.toastr.warning('Preparando descarga', '',{
      timeOut:30000,
      tapToDismiss:false,
      extendedTimeOut:0,
    });
    this.mesaExamenMateriaService.reporte_acta(this.mesa_examen_materia.id,id_tipo_condicion_alumno).subscribe(data =>{
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

  acta_imprimir(id_tipo_condicion_alumno:number=3){
    let aviso = this.toastr.warning('Preparando descarga', '',{
      timeOut:30000,
      tapToDismiss:false,
      extendedTimeOut:0,
    });
    this.mesaExamenMateriaService.reporte_acta(this.mesa_examen_materia.id,id_tipo_condicion_alumno).subscribe(data =>{
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
    this.mesaExamenMateriaService.alumnos(this.mesa_examen_materia.id).subscribe(response=>{
      this.dataSource = response;
      this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    });
  }
  refrescarDocente(){
    this.mesaExamenMateriaService.docentes(this.mesa_examen_materia.id).subscribe(response=>{
      this.dataSourceDocente = response;
      /*
      this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTriggerDocente.next();
      });
      */
    });
  }

  notas(){
    this.router.navigate(['/mesas/materias/'+this.mesa_examen_materia.id+'/ver']);
  }

  volver_mesa_examen(){
    this.router.navigate(['/mesas/'+this.mesa_examen_materia.id_mesa_examen+'/ver']);
  }

  volver(){
    this.router.navigate(['/mesas/materias']);
  }

  constancia_descargar(item:MesaExamenMateriaAlumno){
    AuxiliarFunction.descargar(this.toastr,this.mesaExamenMateriaAlumnoService.reporte_constancia(item.id));
  }

  constancia_imprimir(item:MesaExamen){
    AuxiliarFunction.imprimir(this.toastr,this.mesaExamenMateriaAlumnoService.reporte_constancia(item.id));
  }
}
