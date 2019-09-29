import { Component, OnInit } from '@angular/core';
import { ExtraService } from '../../../_services/extra.service';
import { Dia } from '../../../_models/extra';
import { ComisionHorarioService } from '../../../_services/comision_horario.service';
import { ComisionHorario } from '../../../_models/comision';
import { BsModalRef } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-comision-horario-editar-modal',
  templateUrl: './comision-horario-editar-modal.component.html',
  styleUrls: ['./comision-horario-editar-modal.component.scss']
})
export class ComisionHorarioEditarModalComponent implements OnInit {
  dias:Dia[];
  item: ComisionHorario;
  formulario:FormGroup;
  public onClose: Subject<boolean>;

  constructor(
    private service:ComisionHorarioService,
    private extra:ExtraService,
    public bsModalRef: BsModalRef,
    private fb:FormBuilder,
    private toastr: ToastrService,
  ) {
    let hora_inicial = new Date;
    hora_inicial.setHours(10);
    hora_inicial.setMinutes(0);
    let hora_final = new Date;
    hora_final.setHours(12);
    hora_final.setMinutes(0);
    this.formulario = this.fb.group({
      id_dia:[1,[Validators.required]],
      hora_inicial:[hora_inicial,[Validators.required]],
      hora_final:[hora_final,[Validators.required]],
    });
  }

  ngOnInit() {
    this.onClose = new Subject();
    this.extra.dias().subscribe(response=>{
      this.dias = response;
    });
  }

  get f(){
    return this.formulario.controls;
  }

  onShow(id_comision:number,item:ComisionHorario=null){
    if(item){
      this.item = item;
      let hora_inicial = moment(item.hora_inicial, 'HH:mm:ss');
      let hora_final = moment(item.hora_final, 'HH:mm:ss');
      this.f.id_dia.setValue(item.id_dia);
      this.f.hora_inicial.setValue(hora_inicial.toDate());
      this.f.hora_final.setValue(hora_final.toDate());
    } else {
      this.item = <ComisionHorario>{};
      this.item.id = 0;
      this.item.id_comision = id_comision;
    }
  }

  confirmar(){
    if(!this.formulario.valid){
      return;
    }
    this.item.id_dia = this.f.id_dia.value;
    let hora_inicial = moment(this.f.hora_inicial.value);
    if(hora_inicial.isValid){
      this.item.hora_inicial = hora_inicial.format('HH:mm:00');
    }
    let hora_final = moment(this.f.hora_final.value);
    if(hora_final.isValid){
      this.item.hora_final = hora_final.format('HH:mm:00');
    }
    if(hora_final.isBefore(hora_inicial)){
      this.toastr.warning('La hora final debe ser menor que la hora inicial.')
      return ;
    }
    if(this.item.id>0){
      this.service.update(this.item).subscribe(response=>{
        this.toastr.success('Horario editado', '');
        this.onClose.next(true);
        this.bsModalRef.hide();
      });
    } else {
      this.service.register(this.item).subscribe(response=>{
        this.toastr.success('Horario creado', '');
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
