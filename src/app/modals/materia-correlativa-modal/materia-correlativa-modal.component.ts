import { Component, OnInit } from '@angular/core';
import { Materia, MateriaCorrelativa } from '../../_models/materia';
import { MateriaService } from '../../_services/materia.service';
import { Subject } from 'rxjs';
import { PlanEstudio } from '../../_models/plan_estudio';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-materia-correlativa-modal',
  templateUrl: './materia-correlativa-modal.component.html',
  styleUrls: ['./materia-correlativa-modal.component.scss']
})
export class MateriaCorrelativaModalComponent implements OnInit {
  public onClose: Subject<boolean>;
  id:number=0;
  plan_estudio:PlanEstudio;
  titulo:string;

  materias:Materia[]=[];
  materias_correlativas:MateriaCorrelativa[]=[];
  constructor(
    private materiaService:MateriaService,
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    ) {
      
    }

  onShow(plan_estudio:PlanEstudio,id:number=0){
    this.plan_estudio = plan_estudio;
    this.id = id;

    this.materiaService.planEstudio(this.plan_estudio.id).subscribe(response=>{
      this.materias = response;
    });

    this.materiaService.getById(this.id).subscribe(response=>{
      this.materias_correlativas = response.correlatividades;
    });
  }
  ngOnInit() {
    this.onClose = new Subject();    
  }

  correlatividad(event,item:Materia){
    if(this.id==0){
      if(event.target.checked){
        var ints:MateriaCorrelativa = <MateriaCorrelativa>{};
        ints.id_materia = item.id;
        this.materias_correlativas.push(ints);
      } else {
        this.materias_correlativas = this.materias_correlativas.filter(function( obj ) {
          return obj.id_materia !== item.id;
        });
      }
    } else {
      var correlativa:MateriaCorrelativa = <MateriaCorrelativa>{};
      correlativa.id_materia = this.id;
      correlativa.correlatividad_id_materia = item.id;
      if(event.target.checked){
        this.materiaService.materia_asociar(correlativa).subscribe(response=>{
          this.toastr.success('Materia '+item.nombre+' Asociada', '');
        });
      } else {
        this.materiaService.materia_desasociar(correlativa).subscribe(response=>{
          this.toastr.success('Materia '+item.nombre+' Desasociada', '');
        });
      }
    }
  }

  correlatividad_asociada(item:Materia):boolean{
    return this.materias_correlativas.filter(function( obj ) {
      return obj.correlatividad_id_materia == item.id;
    }).length>0;
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}
