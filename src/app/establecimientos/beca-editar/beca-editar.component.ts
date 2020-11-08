import { Component, OnInit } from '@angular/core';
import { BecaService } from '../../_services/beca.service';
import { Beca } from '../../_models/beca';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-beca-editar',
  templateUrl: './beca-editar.component.html',
  styleUrls: ['./beca-editar.component.scss']
})
export class BecaEditarComponent implements OnInit {

  titulo:string;
  id_sede:number = 0;
  id:number = 0;
  formulario: FormGroup;

  constructor(
    private becaService:BecaService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required,Validators.maxLength(191)]],
      descripcion: ['',[Validators.maxLength(191)]],
      porcentaje: [0, [Validators.required,Validators.min(0),Validators.max(100)]],
      porcentaje_matricula: [0,[Validators.required,Validators.min(0),Validators.max(100)]],
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      let ids = params['id_beca'];
      if(ids==null){
        this.id = 0;
      } else {
        this.id = +ids;
      }
      if(this.id==0){
        this.titulo="Beca Nueva";
      } else {
        this.titulo="Beca Editar";
        this.becaService.getById(this.id).subscribe(response=>{
          this.f.nombre.setValue(response.nombre);
          this.f.descripcion.setValue(response.descripcion);
          this.f.porcentaje.setValue(response.porcentaje);
          this.f.porcentaje_matricula.setValue(response.porcentaje_matricula);
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
    var item = <Beca>{}
    item.id = this.id;
    item.nombre = this.f.nombre.value;
    item.descripcion = this.f.descripcion.value;
    item.porcentaje = this.f.porcentaje.value;
    item.porcentaje_matricula = this.f.porcentaje_matricula.value;
    if(this.id>0){
      this.becaService.update(item).subscribe(response=>{
        this.toastr.success('Beca Editado', '');
        this.volver();
      });
    } else {
      this.becaService.register(item).subscribe(response=>{
        this.toastr.success('Beca Agregada', '');
        this.volver();
      });
    }
  }

  volver(){
    this.router.navigate(['/establecimientos/becas']);
  }

}
