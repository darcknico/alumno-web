import { Component, OnInit } from '@angular/core';
import { MateriaService } from '../../_services/materia.service';
import { PlanEstudio } from '../../_models/plan_estudio';
import { Materia, TipoMateriaRegimen, TipoMateriaLectivo } from '../../_models/materia';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-materia-editar',
  templateUrl: './materia-editar.component.html',
  styleUrls: ['./materia-editar.component.scss']
})
export class MateriaEditarComponent implements OnInit {

  public onClose: Subject<boolean>;
  formulario: FormGroup;
  id:number=0;
  plan_estudio:PlanEstudio;
  titulo:string;
  tipos_regimen:TipoMateriaRegimen[];
  tipos_lectivo:TipoMateriaLectivo[];

  constructor(
    private materiaService:MateriaService,
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    ) {
      this.formulario = this.fb.group({
        nombre: [ '', Validators.required],
        codigo: [ '', Validators.required],
        horas: 0,
        id_tipo_materia_regimen: '',
        id_tipo_materia_lectivo: '',
        id_aula_virtual: ['',[Validators.maxLength(255)]],
        id_examen_virtual: ['',[Validators.maxLength(255)]],
      });
    }

  onShow(plan_estudio:PlanEstudio,id:number=0){
    this.plan_estudio = plan_estudio;
    this.id = id;

    this.onClose = new Subject();
    if(this.id==0){
      this.titulo="Materia Nueva";
    } else {
      this.titulo="Materia Editar";
      this.materiaService.getById(this.id).subscribe(response=>{
        this.f.nombre.setValue(response.nombre);
        this.f.codigo.setValue(response.codigo);
        this.f.horas.setValue(response.horas);
        this.f.id_tipo_materia_regimen.setValue(response.id_tipo_materia_regimen);
        this.f.id_tipo_materia_lectivo.setValue(response.id_tipo_materia_lectivo);
        this.f.id_aula_virtual.setValue(response.id_aula_virtual);
        this.f.id_examen_virtual.setValue(response.id_examen_virtual);
      });
    }

    this.materiaService.tipos_regimen().subscribe(response=>{
      this.tipos_regimen = response;
    });
    this.materiaService.tipos_lectivo().subscribe(response=>{
      this.tipos_lectivo = response;
    });
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
    var item = <Materia>{}
    item.id = this.id;
    item.id_plan_estudio = this.plan_estudio.id;
    item.nombre = this.f.nombre.value;
    item.codigo = this.f.codigo.value;
    item.horas = this.f.horas.value;
    item.id_tipo_materia_lectivo = this.f.id_tipo_materia_lectivo.value;
    item.id_tipo_materia_regimen = this.f.id_tipo_materia_regimen.value;
    item.id_aula_virtual = this.f.id_aula_virtual.value;
    item.id_examen_virtual = this.f.id_examen_virtual.value;
    if(this.id>0){
      this.materiaService.update(item).subscribe(response=>{
        this.toastr.success('Materia Editada', '');
        this.onClose.next(true);
        this.bsModalRef.hide();
      });
    } else {
      this.materiaService.register(item).subscribe(response=>{
        this.toastr.success('Materia Agregada', '');
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
