import {forkJoin as observableForkJoin,  Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Provincia } from '../../_models/extra';
import { AlumnoService } from '../../_services/alumno.service';
import { TipoDocumento } from '../../_models/tipo_documento';
import { Alumno, TipoAlumnoCivil, AlumnoArchivo, TipoAlumnoDocumentacion, AlumnoSede } from '../../_models/alumno';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ExtraService } from '../../_services/extra.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { mergeMap ,  map} from 'rxjs/operators';
import * as moment from 'moment';
import { saveAs } from 'file-saver';


import { DomSanitizer } from '@angular/platform-browser';
import { CustomValidator } from '../../validators/custom-validator';
import { ValidateDocumentoUnique } from '../../validators/async-documento-unique.validator';
import { SedeService } from '../../_services/sede.service';
import { BsModalService } from 'ngx-bootstrap';
import { ListadoAlumnoSedeModalComponent } from '../componentes/listado-alumno-sede-modal/listado-alumno-sede-modal.component';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { AlumnoSedeService } from '../../_services/alumno_sede.service';

@Component({
  selector: 'app-alumno-editar',
  templateUrl: './alumno-editar.component.html',
  styleUrls: ['./alumno-editar.component.scss']
})
export class AlumnoEditarComponent implements OnInit {

  titulo:string;
  id_sede:number = 0;
  id:number = 0;
  id_tipo_documentacion;
  tipos_civil:TipoAlumnoCivil[]=[];
  provincias:Provincia[]=[];
  tipo_documentos:TipoDocumento[]=[];
  tipo_documentacion:TipoAlumnoDocumentacion[]=[];
  formulario: FormGroup;
  usuario: FormGroup;
  archivos:AlumnoArchivo[]=[];

  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  dataSource: Observable<Alumno>;
  @ViewChild('fileInput') fileInput: ElementRef;

  documento_original:number;
  id_tipo_documento_original:number;
  consultando:boolean = false;
  constructor(
    private alumnoService:AlumnoService,
    private alumnoSedeService:AlumnoSedeService,
    private sedeService:SedeService,
    private extraService:ExtraService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private sanitizer : DomSanitizer,
    private modalService: BsModalService,
  ) {

    this.usuario = this.fb.group({
      documento: ['', [Validators.required,Validators.min(1)]],
      id_tipo_documento: [96,Validators.required],
    });
    this.usuario.setAsyncValidators(
      ValidateDocumentoUnique.createValidator(alumnoService)
    );
    this.usuario.statusChanges.subscribe(
      status => {
        if(status == 'PENDING'){
          this.consultando = true;
        } else {
          this.consultando = false;
        }
        console.log('favoriteLocations validation status: ' + status);
        }
        ,
      error => {
        this.consultando = false;
      },
    );
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: '',
      fecha_nacimiento: null,
      sexo: '',
      telefono: '',
      celular: '',
      email: ['', [CustomValidator.emailValidator]],
      id_provincia:14,
      localidad:'',
      codigo_postal:'',
      domicilio: '',
      numero: '',
      piso: '',
      depto: '',
      usuario:this.usuario,
      id_tipo_alumno_civil: '',
      ciudad_nacimiento: '',
      nacionalidad: '',
      observaciones: '',
    });
    this.dataSource = Observable.create((observer: any) => {
      observer.next(this.f.localidad.value);
    }).pipe(
      mergeMap((token: string) => {
        return this.extraService.localidades(token,this.f.id_provincia.value)
      }),
    );
  }

  ngOnInit() {
    this.id_sede = this.sedeService.getIdSede();
    
    this.route.params.subscribe(params=>{
      let ids_usuario = params['id_alumno'];
      if(ids_usuario==null){
        this.id = 0;
      } else {
        this.id = +ids_usuario;
      }
      this.iniciar();
    });
  }

  iniciar(){
    var tasks = [];
    
    if(this.id==0){
      this.titulo="Alumno Nuevo";
    } else {
      this.titulo="Alumno Editar";
      this.usuario.disable();
      tasks.push(
        this.alumnoService.getById(this.id).pipe(
          map(response=>{
            this.f.nombre.setValue(response.nombre);
            this.f.apellido.setValue(response.apellido);
            let fecha_nacimiento = moment(response.fecha_nacimiento);
            if(fecha_nacimiento.isValid()){
              this.f.fecha_nacimiento.setValue( fecha_nacimiento.toDate());
            }
            this.f.sexo.setValue(response.sexo);
            this.f.email.setValue(response.email);
            this.f.telefono.setValue(response.telefono);
            this.f.celular.setValue(response.celular);
            this.f.id_provincia.setValue(response.id_provincia);
            this.f.localidad.setValue(response.localidad);
            this.f.codigo_postal.setValue(response.codigo_postal);
            this.f.domicilio.setValue(response.domicilio);
            this.f.numero.setValue(response.numero);
            this.f.piso.setValue(response.piso);
            this.f.depto.setValue(response.depto);
            this.documento_original = response.documento;
            this.id_tipo_documento_original = response.id_tipo_documento;
            this.u.documento.setValue(response.documento);
            this.u.id_tipo_documento.setValue(response.id_tipo_documento);
            this.f.id_tipo_alumno_civil.setValue(response.id_tipo_alumno_civil);
            this.f.ciudad_nacimiento.setValue(response.ciudad_nacimiento);
            this.f.nacionalidad.setValue(response.nacionalidad);
            this.f.observaciones.setValue(response.observaciones);
            this.archivos = response.archivos;
            this.archivos.forEach(archivo=>{
              this.alumnoService.archivo(archivo).subscribe(blob=>{
                let urlCreator = window.URL;
                archivo.url = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(blob));
              });
              return archivo;
            });
        }))
      );
    }
    tasks.push(
      this.alumnoService.tipos_documentacion().pipe(
        map(response=>{
          this.tipo_documentacion = response;
        }))
    );
    tasks.push(
      this.extraService.tipo_documento().pipe(
        map(data=>{
          this.tipo_documentos = data;
        }))
    );
    tasks.push(
      this.extraService.provincias().pipe(
        map(data=>{
          this.provincias = data;
        }))
    );
    tasks.push(
      this.alumnoService.tipos_civil().pipe(
        map(data=>{
          this.tipos_civil = data;
        }))
    );
    observableForkJoin(tasks).subscribe(response => {
      
    });
  }

  get f(){
    return this.formulario.controls;
  }

  get u(){
    return this.usuario.controls;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    var item = <Alumno>{}
    item.id = this.id;
    item.nombre = this.f.nombre.value;
    item.apellido = this.f.apellido.value;
    item.fecha_nacimiento = this.f.fecha_nacimiento.value;
    item.sexo = this.f.sexo.value;
    item.email = this.f.email.value;
    item.telefono = this.f.telefono.value;
    item.celular = this.f.celular.value;
    item.id_provincia = this.f.id_provincia.value;
    item.localidad = this.f.localidad.value;
    item.codigo_postal = this.f.codigo_postal.value;
    item.domicilio = this.f.domicilio.value;
    item.numero = this.f.numero.value;
    item.piso = this.f.piso.value;
    item.depto = this.f.depto.value;
    if(this.id>0){
      if(this.usuario.enabled){
        item.documento = this.u.documento.value;
        item.id_tipo_documento = this.u.id_tipo_documento.value;
      } else {
        item.documento = this.documento_original;
        item.id_tipo_documento = this.id_tipo_documento_original;
      }
    } else {
      item.documento = this.u.documento.value;
      item.id_tipo_documento = this.u.id_tipo_documento.value;
    }
    item.id_tipo_alumno_civil = this.f.id_tipo_alumno_civil.value;
    item.ciudad_nacimiento = this.f.ciudad_nacimiento.value;
    item.nacionalidad = this.f.nacionalidad.value;
    item.observaciones = this.f.observaciones.value;
    this.deshabilitar();
    if(this.id>0){
      this.alumnoService.update(item).subscribe(response=>{
        this.toastr.success('Alumno Editado', '');
        this.volver();
      });
    } else {
      const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
      (<DialogConfirmComponent>modal.content).onShow("Dar de alta alumno","Esta por agregar el alumno con documento \""+item.documento+"\" a la sede actual.¿Desea continuar?");
      (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
        if (result === true) {
          this.alumnoService.register(item).subscribe(response=>{
            this.toastr.success('Alumno Agregado', '');
            let tasks = [];
            if(this.archivos.length == 0){
              this.volver();
            } else {
              this.toastr.warning('Subiendo Archivos', '');
            }
            this.archivos.forEach(data=>{
              tasks.push(
                this.alumnoService.archivoAlta(response.id,data.id_tipo_alumno_documentacion,data.archivo).pipe(
                  map(response => {
                    this.toastr.success('Archivo '+data.nombre+' Agregado', '');
                    this.archivos.find(item=>item.id==data.id).subido = true;
                  }))
              );
            });
            observableForkJoin(tasks).subscribe(response => {
              this.volver();
            });
          });
        }
      });
    }
  }

  volver(){
    this.router.navigate(['/academicos/alumnos']);
  }
 
  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }
 
  typeaheadOnSelect(e: TypeaheadMatch): void {
    this.f.codigo_postal.setValue(e.item.codigo_postal);
  }

    /**
   * ARCHIVOS
   */

  onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileInput.nativeElement.value = "";
      if(this.id>0){
        this.alumnoService.archivoAlta(this.id,this.id_tipo_documentacion,file).subscribe(response => {
          this.archivos.push(response);
          this.toastr.success('Archivo Agregado', '');
        });
      } else {
        if(this.id_tipo_documentacion>0){
          let random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
          var archivo = <AlumnoArchivo>{};
          archivo.id = random;
          archivo.nombre = file.name;
          archivo.archivo = file;
          let urlCreator = window.URL;
          archivo.url = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(file));
          archivo.subido = false;
          archivo.id_tipo_alumno_documentacion = +this.id_tipo_documentacion;
          archivo.tipo_documentacion = this.tipo_documentacion.find(data=>data.id == +this.id_tipo_documentacion);
          this.archivos.push(archivo);
        } else{
          this.toastr.warning('Por Favor seleccione un Tipo de Documentacion', '');
        }
        
      }
    }
  }

  descargar(item:AlumnoArchivo){
    this.toastr.success('Preparando Descarga', '');
    this.alumnoService.archivo(item).subscribe(data => saveAs(data,item.nombre));
  }

  ver(item:AlumnoArchivo){
    return this.alumnoService.archivo(item);
  }

  eliminar(item:AlumnoArchivo){
    if(this.id>0){
      this.alumnoService.archivoBaja(item).subscribe(response=> {
        this.toastr.success('Archivo Eliminado', '');
        this.archivos = this.archivos.filter(data =>{
          return !(data.id == item.id)
        });
      });
    } else {
      this.archivos = this.archivos.filter(data =>{
        return !(data.id == item.id)
      });
    }
  }

  /**
   * OPCIONES DE CONSULTA REST
   */

  deshabilitar(){
    this.consultando = true;
  }

  habilitar(){
    this.consultando = false;    
  }

  alumno_sede(alumno:Alumno){
    const modal = this.modalService.show(ListadoAlumnoSedeModalComponent,{class: 'modal-info'});
    (<ListadoAlumnoSedeModalComponent>modal.content).onShow(alumno);
    (<ListadoAlumnoSedeModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        
      }
    });
  }

  alumno_sede_asociar(item:Alumno){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Asociar alumno a la sede","Esta seguro agregar el alumno \""+item.apellido+" "+item.nombre+"\" a la sede actual");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        let asoc = <AlumnoSede>{};
        asoc.id_sede = this.id_sede;
        asoc.id_alumno = item.id;
        this.alumnoSedeService.register(asoc).subscribe(response=>{
          this.toastr.success('Alumno Asociado', '');
          this.alumno_ver(item);
        });
      }
    });
  }

  alumno_ver(item:Alumno){
    this.router.navigate(['academicos','alumnos',item.id,'ver']);
  }

  habilitar_documento(){
    this.u.documento.markAsTouched();
    this.usuario.enable();
  }
  deshabilitar_documento(){
    this.usuario.markAsUntouched();
    this.usuario.disable();
    this.u.documento.setValue(this.documento_original);
    this.u.id_tipo_documento.setValue(this.id_tipo_documento_original);
    //this.usuario.updateValueAndValidity();
    this.usuario.setErrors(null);
  }
  
}
