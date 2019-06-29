import { Component, OnInit } from '@angular/core';
import { Departamento } from '../../_models/departamento';
import { DepartamentoService } from '../../_services/departamento.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-departamento-editar',
  templateUrl: './departamento-editar.component.html',
  styleUrls: ['./departamento-editar.component.scss']
})
export class DepartamentoEditarComponent implements OnInit {

  titulo:string;
  id_sede:number = 0;
  id:number = 0;
  formulario: FormGroup;

  constructor(
    private departamentoService:DepartamentoService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      let ids_sede = +localStorage.getItem('id_sede');
      if(ids_sede == null){
        this.router.navigate(['/establecimientos/departamentos']);
      } else {
        this.id_sede = +ids_sede;
      }
      let ids_usuario = params['id_departamento'];
      if(ids_usuario==null){
        this.id = 0;
      } else {
        this.id = +ids_usuario;
      }
      if(this.id==0){
        this.titulo="Departamento Nuevo";
      } else {
        this.titulo="Departamento Editar";
        this.departamentoService.getById(this.id).subscribe(response=>{
          this.f.nombre.setValue(response.nombre);
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
    var item = <Departamento>{}
    item.id = this.id;
    item.nombre = this.f.nombre.value;
    if(this.id>0){
      this.departamentoService.update(item).subscribe(response=>{
        this.toastr.success('Departamento Editado', '');
        this.volver();
      });
    } else {
      this.departamentoService.register(item).subscribe(response=>{
        this.toastr.success('Departamento Agregado', '');
        this.volver();
      });
    }
  }

  volver(){
    this.router.navigate(['/establecimientos/departamentos']);
  }
}
