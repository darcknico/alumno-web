
import {forkJoin as observableForkJoin,  Observable } from 'rxjs';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { PlantillaService } from '../../_services/plantilla.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Plantilla, PlantillaArchivo } from '../../_models/plantilla';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DialogInputComponent } from '../../_generic/dialog-input/dialog-input.component';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { map} from 'rxjs/operators';

import { DialogTextareaComponent } from '../../_generic/dialog-textarea/dialog-textarea.component';

@Component({
  selector: 'app-plantilla-editar',
  templateUrl: './plantilla-editar.component.html',
  styleUrls: ['./plantilla-editar.component.scss']
})
export class PlantillaEditarComponent implements OnInit, AfterViewInit {

  titulo:string;
  id_sede:number = 0;
  id:number = 0;
  formulario: FormGroup;
  
  data:string="";
  html:string='';
  public Editor = ClassicEditor;
  config = {
    toolbar: [ 'bold', 'italic', '|', 'undo', 'redo' ],
  };

  archivos:PlantillaArchivo[]=[];
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private plantillaService:PlantillaService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private sanitizer : DomSanitizer,
    ) {
    this.formulario = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: '',
    });
  }

  ngOnInit() {
    this.id_sede = +localStorage.getItem('id_sede');
    this.plantillaService.sede(this.id_sede);
    this.route.params.subscribe(params=>{
      let ids_usuario = params['id_plantilla'];
      if(ids_usuario==null){
        this.id = 0;
      } else {
        this.id = +ids_usuario;
      }
      if(this.id==0){
        this.titulo="Plantilla nueva";
      } else {
        this.titulo="Plantilla editar";
        this.plantillaService.getById(this.id).subscribe(response=>{
          this.f.titulo.setValue(response.titulo);
          this.f.descripcion.setValue(response.descripcion);
          this.html = response.cuerpo;
          this.data = response.cuerpo;
          this.archivos = response.archivos;
          this.archivos.forEach(archivo=>{
            this.plantillaService.archivo(archivo).subscribe(blob=>{
              let urlCreator = window.URL;
              archivo.url = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(blob));
            });
            return archivo;
          });
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if(this.data.length<this.html.length){
      
    } else {
      this.html='';
    }
  }

  get f(){
    return this.formulario.controls;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    if(this.data.length==0 || this.html.length==0){
      this.toastr.warning('El cuerpo de la plantilla no puede estar vacio.', '');
      return;
    }
    var item = <Plantilla>{}
    item.id = this.id;
    item.titulo = this.f.titulo.value;
    item.descripcion = this.f.descripcion.value;
    if(this.html.length>0){
      item.cuerpo = this.html;
    } else {
      item.cuerpo = this.data;
    }
    if(this.id>0){
      this.plantillaService.update(item).subscribe(response=>{
        this.toastr.success('Plantilla editada', '');
        this.volver();
      });
    } else {
      this.plantillaService.register(item).subscribe(response=>{
        this.toastr.success('Plantilla agregada', '');
        let tasks = [];
        if(this.archivos.length>0){
          this.toastr.warning('Subiendo Archivos', '');
        } else {
          this.volver();
        }
        this.archivos.forEach(data=>{
          tasks.push(
            this.plantillaService.archivoAlta(response.id,data.archivo).pipe(
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
  }

  volver(){
    this.router.navigate(['/notificaciones/plantillas']);
  }

  cuerpo(){
    const modal = this.modalService.show(DialogTextareaComponent,{class: 'modal-warning'});
    (<DialogTextareaComponent>modal.content).onShow("Insertar HTML","",this.data);
    (<DialogTextareaComponent>modal.content).onClose.subscribe(result => {
      if (result.length>0) {
        this.html = result;
      }
    });
  }

  editor(){
    this.data="";
    this.html="";
  }
  
    /**
   * ARCHIVOS
   */

  onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileInput.nativeElement.value = "";
      if(this.id>0){
        this.plantillaService.archivoAlta(this.id,file).subscribe(response => {
          this.archivos.push(response);
          this.toastr.success('Archivo agregado', '');
        });
      } else {
        let random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
        var archivo = <PlantillaArchivo>{};
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

  descargar(item:PlantillaArchivo){
    this.toastr.success('Preparando descarga', '');
    this.plantillaService.archivo(item).subscribe(data => saveAs(data,item.nombre));
  }

  eliminar(item:PlantillaArchivo){
    if(this.id>0){
      this.plantillaService.archivoBaja(item).subscribe(response=> {
        this.toastr.success('Archivo eliminado', '');
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
   * PREUBA DE CORREO
   */

  enviar():void{
    const modal = this.modalService.show(DialogInputComponent,{class: 'modal-info'});
    (<DialogInputComponent>modal.content).onShow("Enviar prueba","Ingrese el correo del destinatario","email");
    (<DialogInputComponent>modal.content).onClose.subscribe(result => {
      if (result.length>0) {
        var item = <Plantilla>{};
        item.cuerpo = this.data;
        item.destino = result;
        this.plantillaService.enviar(item).subscribe(response=>{
          this.toastr.success('Correo enviado', '');
        });
      }
    });
  }

  previa(){
    var wnd = window.open("about:blank", "", "_blank,width = 600, height = 800");
    if(this.data.length<this.html.length){
      wnd.document.write(this.html);
    } else {
      wnd.document.write(this.data);
    }
  }

}
