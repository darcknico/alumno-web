import { Component, OnInit } from '@angular/core';
import { NovedadSistemaService } from '../../_services/novedad_sistema.service';
import { NovedadSistema } from '../../_models/novedad';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-novedad-editar',
  templateUrl: './novedad-editar.component.html',
  styleUrls: ['./novedad-editar.component.scss']
})
export class NovedadEditarComponent implements OnInit {

  titulo:string;
  id_sede:number = 0;
  id:number = 0;
  item:NovedadSistema;
  formulario: FormGroup;
  
  data:any="";
  cuerpo:string="";
  public Editor = ClassicEditor;
  config = {
    toolbar: [ 'bold', 'italic', '|', 'undo', 'redo' ],
  };

  constructor(
    private service:NovedadSistemaService,
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

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.cuerpo = this.router.getCurrentNavigation().extras.state.contenido;
        this.data = this.sanitizer.bypassSecurityTrustHtml(this.cuerpo);
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      let ids_usuario = params['id_novedad_sistema'];
      if(ids_usuario==null){
        this.id = 0;
      } else {
        this.id = +ids_usuario;
      }
      if(this.id==0){
        this.titulo="Novedad nueva";
      } else {
        this.titulo="Novedad editar";
        this.service.getById(this.id).subscribe(response=>{
          this.item = response;
          this.f.titulo.setValue(response.titulo);
          this.f.descripcion.setValue(response.descripcion);
          if(!this.data){
            if(response.cuerpo){
              this.cuerpo = response.cuerpo;
            } else {
              this.cuerpo = " ";
            }
            this.data = this.sanitizer.bypassSecurityTrustHtml(response.cuerpo);
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    
  }

  get f(){
    return this.formulario.controls;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    var item = <NovedadSistema>{}
    item.id = this.id;
    item.titulo = this.f.titulo.value;
    item.descripcion = this.f.descripcion.value;
    item.cuerpo = this.cuerpo;
    if(this.id>0){
      this.service.update(item).subscribe(response=>{
        this.toastr.success('Novedad editada', '');
        this.volver();
      });
    } else {
      this.service.register(item).subscribe(response=>{
        this.toastr.success('Novedad agregada', '');
      });
    }
  }

  volver(){
    this.router.navigate(['/admin/novedades']);
  }
  

  

  previa(){
    var wnd = window.open("about:blank", "", "_blank,width = 600, height = 800");
    wnd.document.write(this.cuerpo);
  }

  editor(){
    let navigationExtras: NavigationExtras = {
      state: {
        return:'admin/novedades',
        id:this.id,
        contenido:this.cuerpo, 
        item:this.item,
      }
    };
    this.router.navigate(['template'],navigationExtras);
  }
}
