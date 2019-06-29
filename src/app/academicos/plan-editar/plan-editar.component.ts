import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../_services/plan.service';
import { PlanEstudio } from '../../_models/plan_estudio';
import { Carrera } from '../../_models/carrera';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-plan-editar',
  templateUrl: './plan-editar.component.html',
  styleUrls: ['./plan-editar.component.scss']
})
export class PlanEditarComponent implements OnInit {

  public onClose: Subject<boolean>;
  formulario: FormGroup;
  id:number=0;
  carrera:Carrera;
  titulo:string;

  constructor(
    private planService:PlanService,
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    ) {
      this.formulario = this.fb.group({
        nombre: [ '', Validators.required],
        codigo: [ '', Validators.required],
        anio: [ '', Validators.required],
        horas: 0,
        resolucion: 0,
      });
    }

  onShow(carrera:Carrera,id:number=0){
    this.carrera = carrera;
    this.id = id;
    
    let id_sede = +localStorage.getItem('id_sede');
    this.planService.carrera(this.carrera.id);

    this.onClose = new Subject();
    if(this.id==0){
      this.titulo="Plan de Estudio Nuevo";
    } else {
      this.titulo="Plan de Estudio Editar";
      this.planService.getById(this.id).subscribe(response=>{
        this.f.nombre.setValue(response.nombre);
        this.f.codigo.setValue(response.codigo);
        this.f.anio.setValue(response.anio);
        this.f.horas.setValue(response.horas);
        this.f.resolucion.setValue(response.resolucion);
      });
    }
  }
  ngOnInit() {
    
  }

  get f(){
    return this.formulario.controls;
  }

  confirmar(){
    if(!this.formulario.valid){
      return;
    }
    var item = <PlanEstudio>{}
    item.id = this.id;
    item.id_carrera = this.carrera.id;
    item.nombre = this.f.nombre.value;
    item.codigo = this.f.codigo.value;
    item.anio = this.f.anio.value;
    item.horas = this.f.horas.value;
    item.resolucion = this.f.resolucion.value;
    if(this.id>0){
      this.planService.update(item).subscribe(response=>{
        this.toastr.success('Plan de Estudio Editado', '');
        this.onClose.next(true);
        this.bsModalRef.hide();
      });
    } else {
      this.planService.register(item).subscribe(response=>{
        this.toastr.success('Plan de Estudio Agregado', '');
        this.onClose.next(true);
        this.bsModalRef.hide();
      });
    }
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
