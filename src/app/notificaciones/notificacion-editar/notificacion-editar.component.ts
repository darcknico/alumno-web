import { Component, OnInit } from '@angular/core';
import { NotificacionService, AlumnoNotificacionFiltro } from '../../_services/notificacion.service';
import { Notificacion } from '../../_models/notificacion';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlantillaService } from '../../_services/plantilla.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import * as moment from 'moment';
import { Plantilla } from '../../_models/plantilla';
import { DialogInputComponent } from '../../_generic/dialog-input/dialog-input.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Departamento } from '../../_models/departamento';
import { DepartamentoService } from '../../_services/departamento.service';
import { CarreraService } from '../../_services/carrera.service';
import { Carrera } from '../../_models/carrera';
import { TipoAlumnoEstado, Alumno } from '../../_models/alumno';
import { AlumnoService } from '../../_services/alumno.service';

@Component({
  selector: 'app-notificacion-editar',
  templateUrl: './notificacion-editar.component.html',
  styleUrls: ['./notificacion-editar.component.scss']
})
export class NotificacionEditarComponent implements OnInit {

  titulo:string;
  id_sede:number = 0;
  id:number = 0;
  formulario: FormGroup;
  alumnos:Alumno[]=[];

  plantillas:Plantilla[]=[];
  departamentos:Departamento[]=[];
  carreras:Carrera[]=[];
  tipos_estado:TipoAlumnoEstado[]=[];

  filtro:AlumnoNotificacionFiltro = <AlumnoNotificacionFiltro>{
    sexo:'',
    olgado:false,
  }

  dataSource:Alumno[];
  dtOptions: DataTables.Settings = {};

  constructor(
    private notificacionService:NotificacionService,
    private plantillaService:PlantillaService,
    private departamentoService:DepartamentoService,
    private carreraService:CarreraService,
    private alumnoService:AlumnoService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
    ) {
    let fecha = moment();
    fecha.hour(10);
    fecha.minute(0);
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: '',
      asunto: ['', Validators.required],
      responder_email: ['', Validators.required],
      responder_nombre: ['', Validators.required],
      fecha: [fecha.add(1,'month').toDate(), Validators.required],
      hora: [fecha.toDate(), Validators.required],
      id_plantilla: [null, Validators.required],
    });

    this.dtOptions = {
      info:false,
      paging:false,
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        width:"7%",
        },
      ]
    };
  }

  ngOnInit() {
    this.id_sede = +localStorage.getItem('id_sede');
    this.notificacionService.sede(this.id_sede);
    this.plantillaService.sede(this.id_sede);
    this.plantillaService.getAll().subscribe(response=>this.plantillas=response);
    this.departamentoService.getAll().subscribe(response=>this.departamentos=response);
    this.carreraService.getAll().subscribe(response=>this.carreras=response);
    this.alumnoService.tipos_estado().subscribe(response=>this.tipos_estado=response);

    this.route.params.subscribe(params=>{
      let id_notificacion = params['id_notificacion'];
      if(id_notificacion==null){
        this.id = 0;
      } else {
        this.id = +id_notificacion;
      }
      if(this.id==0){
        this.titulo="Notificacion nueva";
      } else {
        this.titulo="Notificacion editar";
        this.notificacionService.getById(this.id).subscribe(response=>{
          this.f.nombre.setValue(response.nombre);
          this.f.descripcion.setValue(response.descripcion);
          this.f.asunto.setValue(response.asunto);
          this.f.responder_email.setValue(response.responder_email);
          this.f.responder_nombre.setValue(response.responder_nombre);
          this.f.id_plantilla.setValue(response.id_plantilla);
          this.notificacionService.alumnos(this.id).subscribe(response=>{
            this.alumnos = response;
            this.dataSource = response;
          });
        });
      }
    });
  }

  get f(){
    return this.formulario.controls;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    var item = <Notificacion>{}
    item.id = this.id;
    item.nombre = this.f.nombre.value;
    item.descripcion = this.f.descripcion.value;
    item.asunto = this.f.asunto.value;
    item.responder_email = this.f.responder_email.value;
    item.responder_nombre = this.f.responder_nombre.value;
    item.id_plantilla = this.f.id_plantilla.value;
    let hora = moment(this.f.hora.value);
    let fecha = moment(this.f.fecha.value);
    fecha.set({
      hour:hora.get('hour'),
      minute:hora.get('minute'),
      second:0,
    });
    if(fecha.isBefore(moment())){
      this.toastr.error('La fecha y hora debe ser mayor que la fecha y hora actual,', '');
      return;
    }
    item.fecha = fecha.format("YYYY-MM-DD HH:mm:ss");
    item.alumnos_asociados = this.alumnos;
    if(this.id>0){
      this.notificacionService.update(item).subscribe(response=>{
        this.toastr.success('Notificacion editada', '');
        this.volver();
      });
    } else {
      this.notificacionService.register(item).subscribe(response=>{
        this.toastr.success('Notificacion agregada', '');
        this.volver();
      });
    }
  }

  volver(){
    this.router.navigate(['/notificaciones/notificaciones']);
  }

  valido():boolean{
    return !this.formulario.valid || this.alumnos.length === 0 || this.f.id_plantilla.value === null;
  }
  /**
   * PREUBA DE CORREO
   */

  enviar():void{
    const modal = this.modalService.show(DialogInputComponent,{class: 'modal-info'});
    (<DialogInputComponent>modal.content).onShow("Enviar prueba","Ingrese el correo del destinatario","email");
    (<DialogInputComponent>modal.content).onClose.subscribe(result => {
      if (result.length>0) {
        let item = <Plantilla>{};
        item.id = this.f.id_plantilla.value;
        item.destino = result;
        this.plantillaService.enviar(item).subscribe(response=>{
          this.toastr.success('Correo enviado', '');
        });
      }
    });
  }

  previa(){
    var wnd = window.open("about:blank", "", "_blank,width = 600, height = 800");
    this.plantillaService.getById(this.f.id_plantilla.value).subscribe(response=>{
      wnd.document.write(response.cuerpo);
    });
    
  }

  /**
   * BUSCAR ALUMNOS
   */

  buscar(){
    this.dataSource = null;
    this.alumnos = [];
    this.notificacionService.filtrar(this.filtro).subscribe(response=>this.dataSource = response);
  }

  seleccionarTodo(event){
    this.alumnos = [];
    if(event.target.checked){
      this.dataSource.forEach(data=>this.alumnos.push(data));
    }
  }
  seleccionadoTodo():boolean{
    return this.alumnos.length === this.dataSource.length;
  }
  seleccionar(event,item:Alumno){
    if(event.target.checked){
      if(this.alumnos.find(data=>data.id===item.id)===undefined){
        this.alumnos.push(item);
      }
    } else {
      this.alumnos = this.alumnos.filter(data=>data.id !== item.id);
    }
  }

  seleccionado(item:Alumno):boolean{

    return this.alumnos.find(data=>data.id===item.id)!==undefined;
  }
}
