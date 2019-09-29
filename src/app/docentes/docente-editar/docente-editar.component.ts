import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsuarioSede, Docente, UsuarioArchivo, DocenteMateria, DocenteContrato } from '../../_models/usuario';
import { Sede } from '../../_models/sede';
import { TipoDocumento } from '../../_models/tipo_documento';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DocenteService } from '../../_services/docente.service';
import { SedeService } from '../../_services/sede.service';
import { ExtraService } from '../../_services/extra.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidateEmailUnique } from '../../validators/async-email-unique.validator';
import { TipoContrato } from '../../_models/tipo';
import { UsuarioService } from '../../_services/usuario.service';
import { TipoService } from '../../_services/tipo.service';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { map } from 'rxjs/internal/operators/map';
import { saveAs } from 'file-saver';
import { FiltroDocenteMateria, DocenteMateriaService } from '../../_services/docente_materia.service';
import { DataTableDirective } from 'angular-datatables';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { BsModalService } from 'ngx-bootstrap';
import { MateriaEditarModalComponent } from '../materia-editar-modal/materia-editar-modal.component';

@Component({
  selector: 'app-docente-editar',
  templateUrl: './docente-editar.component.html',
  styleUrls: ['./docente-editar.component.scss']
})
export class DocenteEditarComponent implements OnInit {

  resource:string = 'docentes';
  titulo:string;
  id:number = 0;
  sedes:Sede[]=[];
  sedes_asociadas:UsuarioSede[]=[];
  contratos_asociados:DocenteContrato[]=[];
  tipos:TipoContrato[];
  tipo_documentos:TipoDocumento[];
  formulario: FormGroup;
  hoy;

  archivos:UsuarioArchivo[]=[];
  @ViewChild('fileInput') fileInput: ElementRef;
  consultando:boolean = false;
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: DocenteMateria[] = [];
  request = <FiltroDocenteMateria>{
    search:"",
    id_sede:0,
  };
  constructor(
    private docenteService:DocenteService,
    private tipoService:TipoService,
    private usuarioService:UsuarioService,
    private sedeService:SedeService,
    private extraService:ExtraService,
    private docenteMateriaService:DocenteMateriaService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private sanitizer : DomSanitizer,
  ) {
    this.hoy = moment().toDate();
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: '',
      fecha_nacimiento: '',
      telefono: '',
      celular: '',
      direccion: '',
      direccion_numero: '',
      direccion_piso: '',
      direccion_dpto: '',
      documento: '',
      id_tipo_documento: null,
      email: ['',Validators.required,ValidateEmailUnique.createValidator(this.usuarioService)],

      cuit:'',
      titulo:'',
      observaciones:'',
    });
  }

  suscribe;
  ngOnInit() {
    this.request.id_sede = this.sedeService.getIdSede();
    this.route.params.subscribe(params=>{
      let ids_usuario = params['id'];
      if(ids_usuario==null){
        this.id = 0;
      } else {
        this.id = +ids_usuario;
      }
      this.tipoService.contratos().subscribe(data=>{
        this.tipos= data;
      });
      this.extraService.tipo_documento().subscribe(data=>{
        this.tipo_documentos = data;
      });
      if(this.id==0){
        this.titulo="Docente Nuevo";
      } else {
        this.titulo="Docente Editar";
        this.request.id_usuario = this.id;
        this.docenteService.getById(this.id).subscribe(response=>{
          this.f.nombre.setValue(response.usuario.nombre);
          this.f.apellido.setValue(response.usuario.apellido);
          let fecha_nacimiento = moment(response.usuario.fecha_nacimiento);
          if(fecha_nacimiento.isValid()){
            this.f.fecha_nacimiento.setValue(fecha_nacimiento.toDate());
          }
          this.f.telefono.setValue(response.usuario.telefono);
          this.f.celular.setValue(response.usuario.celular);
          this.f.direccion.setValue(response.usuario.direccion);
          this.f.direccion_numero.setValue(response.usuario.direccion_numero);
          this.f.direccion_piso.setValue(response.usuario.direccion_piso);
          this.f.direccion_dpto.setValue(response.usuario.direccion_dpto);
          this.f.documento.setValue(response.usuario.documento);
          this.f.id_tipo_documento.setValue(response.usuario.id_tipo_documento);
          this.f.email.setValue(response.usuario.email);
          this.f.email.clearValidators();
          this.f.email.updateValueAndValidity();
          this.f.email.disable();

          this.f.cuit.setValue(response.cuit);
          this.f.titulo.setValue(response.titulo);
          this.f.observaciones.setValue(response.observaciones);

          this.sedes_asociadas = response.usuario.sedes;
          this.contratos_asociados = response.contratos;

          this.usuarioService.archivos(this.id).subscribe(archivos=>{
            this.archivos = archivos;
            this.archivos.forEach(archivo=>{
              this.usuarioService.archivo(archivo).subscribe(blob=>{
                let urlCreator = window.URL;
                archivo.url = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(blob));
              });
              return archivo;
            });
          });
          
        });
      }
      this.sedeService.getAll().subscribe(response=>{
        this.sedes = response;
      });
      const that = this;
      this.dtOptions = {
        language: {
          url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        paging:false,
        searching:false,
        serverSide: true,
        processing: true,
        ajax: (dataTablesParameters: any, callback) => {
          if(this.suscribe){
            this.suscribe.unsubscribe();
            this.suscribe = null;
          }
          that.request.start = dataTablesParameters.start;
          that.request.length = dataTablesParameters.length;
          that.request.order = dataTablesParameters.order[0].dir;
          that.request.search = dataTablesParameters.search.value;
          that.request.sort = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
          this.suscribe = this.docenteMateriaService.ajax(that.request).subscribe(resp => {
              that.dataSource = resp.items;
              callback({
                recordsTotal: resp.total_count,
                recordsFiltered: resp.total_count,
                data: []
              });
            });
        },
        columns: [
          { 
            data: 'created_at',
            width: '5%',
          },
          { 
            data: 'id_materia',
            width: '5%',
          },
          { 
            data: 'materia',
          },
          { 
            data: 'id_carrera',
          },
        ],
        columnDefs: [ {
          targets: 'no-sort',
          orderable: false,
          },
        ],
        responsive:true,
      };
    });
  }

  get f(){
    return this.formulario.controls;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    var item = <Docente>{}
    item.id = this.id;
    item.nombre = this.f.nombre.value;
    item.apellido = this.f.apellido.value;
    let fecha_nacimiento = moment(this.f.fecha_nacimiento.value);
    if(fecha_nacimiento.isValid()){
      item.fecha_nacimiento = fecha_nacimiento.format('YYYY-MM-DD');
    }
    item.telefono = this.f.telefono.value;
    item.celular = this.f.celular.value;
    item.direccion = this.f.direccion.value;
    item.direccion_numero = this.f.direccion_numero.value;
    item.direccion_piso = this.f.direccion_piso.value;
    item.direccion_dpto = this.f.direccion_dpto.value;
    item.documento = this.f.documento.value;
    item.id_tipo_documento = this.f.id_tipo_documento.value;
    item.email = this.f.email.value;
    item.sedes = this.sedes_asociadas;

    item.cuit = this.f.cuit.value;
    item.titulo = this.f.titulo.value;
    item.observaciones = this.f.observaciones.value;
    item.contratos = this.contratos_asociados;

    if(this.id>0){
      this.docenteService.update(item).subscribe(response=>{
        this.toastr.success('Docente Editado', '');
        this.volver();
      });
    } else {
      this.docenteService.register(item).subscribe(response=>{
        this.toastr.success('Docente Agregado', '');
        let tasks = [];
        if(this.archivos.length == 0){
          this.volver();
        } else {
          this.toastr.warning('Subiendo Archivos', '');
        }
        this.archivos.forEach(data=>{
          tasks.push(
            this.usuarioService.archivoAlta(response.id_usuario,data.archivo).pipe(
              map(response => {
                this.toastr.success('Archivo '+data.nombre+' Agregado', '');
                this.archivos.find(item=>item.id==data.id).subido = true;
              }))
          );
        });
        forkJoin(tasks).subscribe(response => {
          this.volver();
        });
      });
    }
  }

  correo_valido():string{
    let clase="";
    if(this.id>0){
      return '';
    }
    if(this.formulario.get('email').value.length>1){
      if(this.formulario.get('email').hasError('coincidencia')){
        clase = 'is-invalid';
      } else {
        clase = 'is-valid';
      }
    }
    return clase;
  }

  volver(){
    this.router.navigate([this.resource]);
  }

  /**
   * SEDES
   */

  asociacion(event,item:Sede){
    if(this.id==0){
      if(event.target.checked){
        var ints:UsuarioSede = <UsuarioSede>{};
        ints.id_sede = item.id;
        this.sedes_asociadas.push(ints);
      } else {
        this.sedes_asociadas = this.sedes_asociadas.filter(function( obj ) {
          return obj.id_sede !== item.id;
        });
      }
    } else {
      var pertenece:UsuarioSede = <UsuarioSede>{};
      pertenece.id_usuario = this.id;
      pertenece.id_sede = item.id;
      if(event.target.checked){
        this.usuarioService.sede_asociar(pertenece).subscribe(response=>{
          this.toastr.success('Sede '+item.nombre+' Asociada', '');
        });
      } else {
        this.usuarioService.sede_desasociar(pertenece).subscribe(response=>{
          this.toastr.success('Sede '+item.nombre+' Desasociada', '');
        });
      }
    }
  }

  sede_asociada(item:Sede):boolean{
    return this.sedes_asociadas.filter(function( obj ) {
      return obj.id_sede == item.id;
    }).length>0;
  }

  tipo_asociacion(event,item:TipoContrato){
    if(this.id==0){
      if(event.target.checked){
        var ints:DocenteContrato = <DocenteContrato>{};
        ints.id_tipo_contrato = item.id;
        this.contratos_asociados.push(ints);
      } else {
        this.contratos_asociados = this.contratos_asociados.filter(function( obj ) {
          return obj.id_tipo_contrato !== item.id;
        });
      }
    } else {
      var pertenece:DocenteContrato = <DocenteContrato>{};
      pertenece.id_usuario = this.id;
      pertenece.id_tipo_contrato = item.id;
      if(event.target.checked){
        this.docenteService.contrato_asociar(pertenece).subscribe(response=>{
          this.toastr.success('Contrato \"'+item.nombre+'\" Asociada', '');
        });
      } else {
        this.docenteService.contrato_desasociar(pertenece).subscribe(response=>{
          this.toastr.success('Contrato \"'+item.nombre+'\" Desasociada', '');
        });
      }
    }
  }

  tipo_asociada(item:TipoContrato):boolean{
    return this.contratos_asociados.filter(function( obj ) {
      return obj.id_tipo_contrato == item.id;
    }).length>0;
  }

      /**
   * ARCHIVOS
   */

  onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileInput.nativeElement.value = "";
      if(this.id>0){
        this.usuarioService.archivoAlta(this.id,file).subscribe(response => {
          this.archivos.push(response);
          this.toastr.success('Archivo Agregado', '');
        });
      } else {
        let random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
        var archivo = <UsuarioArchivo>{};
        archivo.id = random;
        archivo.nombre = file.name;
        archivo.archivo = file;
        let urlCreator = window.URL;
        archivo.url = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(file));
        archivo.subido = false;
        this.archivos.push(archivo);
      }
    }
  }

  descargar(item:UsuarioArchivo){
    this.toastr.success('Preparando Descarga', '');
    this.usuarioService.archivo(item).subscribe(data => saveAs(data,item.nombre));
  }

  ver(item:UsuarioArchivo){
    return this.usuarioService.archivo(item);
  }

  eliminar(item:UsuarioArchivo){
    if(this.id>0){
      this.usuarioService.archivoBaja(item).subscribe(response=> {
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

  materia_nuevo(){
    const modal = this.modalService.show(MateriaEditarModalComponent,{class: 'modal-info modal-lg'});
    (<MateriaEditarModalComponent>modal.content).onShow(this.id);
    (<MateriaEditarModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  materia_eliminar(item:DocenteMateria){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Descartar asignación");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.docenteMateriaService.delete(item.id).subscribe(response=>{
          this.toastr.success('Asignación descartada', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }
}
