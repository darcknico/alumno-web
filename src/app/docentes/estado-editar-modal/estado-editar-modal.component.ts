import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DocenteEstado } from '../../_models/usuario';
import { DocenteEstadoService } from '../../_services/docente_estado.service';
import { TipoService } from '../../_services/tipo.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-estado-editar-modal',
  templateUrl: './estado-editar-modal.component.html',
  styleUrls: ['./estado-editar-modal.component.scss']
})
export class EstadoEditarModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  formulario: FormGroup;
  id_usuario:number=0;
  item:DocenteEstado = null;

  estados=[
    {
      id:4,
      nombre:'Licencia'
    },
    {
      id:3,
      nombre:'Jubilado'
    },
  ];

  consultando = false;
  archivo;
  baseDropValid;

  constructor(
    public service:DocenteEstadoService,
    private tipos:TipoService,
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    ) {
      let fecha = moment();
      this.formulario = this.fb.group({
        id_tipo_docente_estado: [3, Validators.required],
        fecha:[fecha.toDate(),Validators.required],
        fechas:[[fecha.toDate(),fecha.add(1,'month').toDate()],Validators.required],
        observaciones:'',
      });
    }

  onShow(id_usuario:number,item:DocenteEstado=null){
    this.id_usuario = id_usuario;
    this.item = item;
    if(item){
      this.f.id_tipo_docente_estado.setValue(this.item.id_tipo_docente_estado);
      this.f.observaciones.setValue(this.item.observaciones);
      this.f.id_tipo_docente_estado.disable();
      if(this.item.id_tipo_docente_estado == 3){ //JUBILACION
        let fecha = moment(item.fecha_inicial);
        this.f.fecha.setValue(fecha.toDate());
      }
      if(this.item.id_tipo_docente_estado == 4){ //LICENCIA
        let fecha_inicial = moment(item.fecha_inicial);
        let fecha_final = moment(item.fecha_final);
        this.f.fechas.setValue([fecha_inicial.toDate(),fecha_final.toDate()]);
      }
    }
  }
  ngOnInit() {
    this.onClose = new Subject();
    /*
    this.tipos.docentes_estados().subscribe(response=>{
      this.estados = response;
    });
    */
  }

  get f(){
    return this.formulario.controls;
  }

  confirmar(){
    if(!this.formulario.valid){
      return;
    }
    if(!this.item){
      this.item = <DocenteEstado>{};
      this.item.id_usuario = this.id_usuario;
    }
    this.item.id_tipo_docente_estado = this.f.id_tipo_docente_estado.value;
    this.item.observaciones = this.f.observaciones.value;
    if(this.item.id_tipo_docente_estado == 3){ //JUBILACION
      let fecha = moment(this.f.fecha.value);
      if(fecha.isValid()){
        this.item.fecha_inicial = fecha.format('YYYY-MM-DD');
      }
    }
    if(this.item.id_tipo_docente_estado == 4) { //LICENCIA
      if(this.archivo){
        this.item.archivo = this.archivo;
      }
      let fecha_inicial = moment(this.f.fechas.value[0]);
      let fecha_final = moment(this.f.fechas.value[1]);
      if(fecha_inicial.isValid()){
        this.item.fecha_inicial = fecha_inicial.format('YYYY-MM-DD');
      }
      if(fecha_final.isValid()){
        this.item.fecha_final = fecha_final.format('YYYY-MM-DD');
      }
    }
    
    this.consultando = true;
    if(this.item.id>0){
      this.service.update(this.item).subscribe(response=>{
        this.toastr.success('Mesa de examen editada con exito', '');
        this.onClose.next(true);
        this.bsModalRef.hide();
      },err=>{
        this.consultando = false;
      });
    } else {
      this.service.register(this.item).subscribe(response=>{
        this.toastr.success('Mesa de examen registrada con exito', '');
        this.onClose.next(true);
        this.bsModalRef.hide();
      },err=>{
        this.consultando = false;
      });
    }
    
  }
  onSelectEstado(event){

  }
  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
