import { Component, OnInit } from '@angular/core';
import { ModalidadService } from '../../_services/modalidad.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Modalidad } from '../../_models/modalidad';

@Component({
  selector: 'app-modalidad-editar',
  templateUrl: './modalidad-editar.component.html',
  styleUrls: ['./modalidad-editar.component.scss']
})
export class ModalidadEditarComponent implements OnInit {

  titulo:string;
  id_sede:number = 0;
  id:number = 0;
  formulario: FormGroup;

  constructor(
    private modalidadService:ModalidadService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required,Validators.maxLength(191)]],
      descripcion: ['', Validators.maxLength(191)],
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      let ids_usuario = params['id_modalidad'];
      if(ids_usuario==null){
        this.id = 0;
      } else {
        this.id = +ids_usuario;
      }
      if(this.id==0){
        this.titulo="Modalidad Nueva";
      } else {
        this.titulo="Modalidad Editar";
        this.modalidadService.getById(this.id).subscribe(response=>{
          this.f.nombre.setValue(response.nombre);
          this.f.descripcion.setValue(response.descripcion);
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
    var item = <Modalidad>{}
    item.id = this.id;
    item.nombre = this.f.nombre.value;
    item.descripcion = this.f.descripcion.value;
    if(this.id>0){
      this.modalidadService.update(item).subscribe(response=>{
        this.toastr.success('Modalidad Editado', '');
        this.router.navigate(['/establecimientos/modalidades']);
      });
    } else {
      this.modalidadService.register(item).subscribe(response=>{
        this.toastr.success('Modalidad Agregado', '');
        this.router.navigate(['/establecimientos/modalidades']);
      });
    }
  }

  volver(){
    this.router.navigate(['/establecimientos/modalidades']);
  }

}
