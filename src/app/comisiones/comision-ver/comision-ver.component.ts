import { Component, OnInit } from '@angular/core';
import { Comision, ComisionAlumno } from '../../_models/comision';
import { ComisionService } from '../../_services/comision.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Alumno } from '../../_models/alumno';
import { BsModalService } from 'ngx-bootstrap';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { ComisionAlumnoEditarModalComponent } from '../comision-alumno-editar-modal/comision-alumno-editar-modal.component';
import { ComisionAlumnoVerModalComponent } from '../comision-alumno-ver-modal/comision-alumno-ver-modal.component';

@Component({
  selector: 'app-comision-ver',
  templateUrl: './comision-ver.component.html',
  styleUrls: ['./comision-ver.component.scss']
})
export class ComisionVerComponent implements OnInit {
  
  comision:Comision;

  dtOptions: DataTables.Settings = {};
  dataSource:ComisionAlumno[];

  constructor(
    private comisionService:ComisionService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) { 
    
  }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.comisionService.sede(id_sede);

    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs: [ {
        targets:'option',
        orderable: false,
        width:"7%",
        },
        {
          targets:'no-sort',
          orderable: false,
        }
      ]
    };

    this.route.params.subscribe(params=>{
      let ids = params['id_comision'];
      this.comisionService.getById(ids).subscribe(response=>{
        this.comision = response;
      });
      this.comisionService.alumnos(ids).subscribe(response=>{
        this.dataSource = response;
      });
    });
  }

  asociar_alumno(){
    this.router.navigate(['/comisiones/'+this.comision.id+'/alumnos/disponibles']);
  }

  ver_alumno(alumno:ComisionAlumno){
    const modal = this.modalService.show(ComisionAlumnoVerModalComponent,{class: 'modal-info modal-lg'});
    (<ComisionAlumnoVerModalComponent>modal.content).onShow(alumno);
    (<ComisionAlumnoVerModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  editar_alumno(alumno:ComisionAlumno){
    const modal = this.modalService.show(ComisionAlumnoEditarModalComponent,{class: 'modal-info'});
    (<ComisionAlumnoEditarModalComponent>modal.content).onShow(alumno);
    (<ComisionAlumnoEditarModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  desasociar_alumno(alumno:ComisionAlumno){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Desasociar alumno","Las asistencias realizadas para el alumno no seran eliminadas.");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.comisionService.alumno_desasociar(alumno).subscribe(response=>{
          this.toastr.success('Alumno eliminado', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(){
    this.comisionService.getById(this.comision.id).subscribe(response=>{
      this.comision = response;
    });
    this.comisionService.alumnos(this.comision.id).subscribe(response=>{
      this.dataSource = response;
    });
  }

  asistencia_nuevo(){
    this.router.navigate(['/comisiones/'+this.comision.id+'/asistencias/nuevo']);
  }

  examen_nuevo(){
    this.router.navigate(['/comisiones/'+this.comision.id+'/examenes/nuevo']);
  }

  asistencias(){
    this.router.navigate(['/comisiones/'+this.comision.id+'/asistencias']);
  }

  examenes(){
    this.router.navigate(['/comisiones/'+this.comision.id+'/examenes']);
  }

  volver(){
    this.router.navigate(['/comisiones']);
  }

  reporte(){
    let aviso = this.toastr.warning('Preparando descarga', '',{
      timeOut:15000,
    });
    this.comisionService.reporte(this.comision.id).subscribe(data =>{
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Descarga lista');
      var mediaType = 'application/pdf';
      var blob = new Blob([data], {type: mediaType});
      var filename = "comision_"+this.comision.materia.codigo+".pdf";
      saveAs(blob,filename)
    });
  }
}
