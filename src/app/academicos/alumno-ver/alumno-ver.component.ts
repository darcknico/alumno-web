import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../_models/alumno';
import { AlumnoService } from '../../_services/alumno.service';
import { ExtraService } from '../../_services/extra.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { Inscripcion } from '../../_models/inscripcion';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { InscripcionService, FiltroInscripcion } from '../../_services/inscripcion.service';
import { Usuario } from '../../_models/usuario';
import { AuthenticationService } from '../../_services/authentication.service';
import { ListadoAlumnoSedeModalComponent } from '../componentes/listado-alumno-sede-modal/listado-alumno-sede-modal.component';
import { DialogInputComponent } from '../../_generic/dialog-input/dialog-input.component';

@Component({
  selector: 'app-alumno-ver',
  templateUrl: './alumno-ver.component.html',
  styleUrls: ['./alumno-ver.component.scss']
})
export class AlumnoVerComponent implements OnInit {
  dtOptionsInscripciones: DataTables.Settings = {};
  dtOptionsNotificaciones: DataTables.Settings = {};
  dataSource:Inscripcion[];
  alumno:Alumno;
  id_sede:number;
  id_alumno:number;
  usuario:Usuario;

  constructor(
    private alumnoService:AlumnoService,
    private inscripcionService:InscripcionService,
    private extraService:ExtraService,
    private authenticationService:AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private sanitizer : DomSanitizer,
    private modalService: BsModalService,
    ) {

  }

  ngOnInit() {
    this.usuario = this.authenticationService.localUsuario();
    this.id_sede = +localStorage.getItem('id_sede');
    this.inscripcionService.sede(this.id_sede);
    this.route.params.subscribe(params=>{
      this.id_alumno = +params['id_alumno'];
      this.iniciar();
    });

    this.dtOptionsInscripciones = {
      order: [[ 0, "desc" ]],
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      searching:false,
      columnDefs: [ {
        targets: [5,6,7,8,9],
        orderable: false
        },{
          targets: [0],
          width:"7%"
        } ]
    };
    this.dtOptionsNotificaciones = {
      order: [[ 0, "desc" ]],
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      searching:false,
      columnDefs: [ {
        targets: [3],
        orderable: false
        } ]
    };
  }

  iniciar(){
    this.alumnoService.getById(this.id_alumno).subscribe(response=>{
      this.alumno = response;
    });
    let filtro = <FiltroInscripcion>{};
    filtro.id_alumno = this.id_alumno;
    this.inscripcionService.getAll(filtro).subscribe(response=>{
      this.dataSource = response;
    });
    
  }

  ver(item:Inscripcion){
    this.router.navigate(['/academicos/inscripciones/'+item.id+'/ver']);
  }

  editar(item:Inscripcion){
    this.router.navigate(['/academicos/inscripciones/'+item.id+'/editar']);
  }

  eliminar(item:Inscripcion){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    let mensaje = "Esto eliminara las inscripciones, planes de pago, pagos y movimientos que se hayan generado a partir de la inscripcion "+item.carrera.nombre+". Año:"+item.anio;
    (<DialogConfirmComponent>modal.content).onShow("Eliminar inscripcion","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.inscripcionService.delete(item.id).subscribe(response=>{
          this.toastr.success('Inscripcion eliminada', '');
          this.dataSource = [];
          this.alumnoService.inscripciones(this.id_alumno).subscribe(response=>{
            this.dataSource = response;
          });
        });
      }
    });
  }

  inscribir(){
    this.router.navigate(['/academicos/inscripciones/nuevo'],{
      queryParams:{
        id_alumno:this.alumno.id,
      }
    });
  }

  sedes(){
    const modal = this.modalService.show(ListadoAlumnoSedeModalComponent,{class: 'modal-info'});
    (<ListadoAlumnoSedeModalComponent>modal.content).onShow(this.alumno);
    (<ListadoAlumnoSedeModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        
      }
    });
  }

  password(){
    const modal = this.modalService.show(DialogInputComponent);
    (<DialogInputComponent>modal.content).onShow("Cambiar Contraseña","Contraseña");
    (<DialogInputComponent>modal.content).onClose.subscribe(result => {
      if (result.length>5) {
        this.alumno.password = result;
        this.alumnoService.password(this.alumno).subscribe(response=>{
          this.toastr.warning('Contraseña Cambiada', '');
        });
      } else if(result.length>0) {
        this.toastr.warning('Contraseña demasiado Corta', '');
      }
    });
  }
}
