import { Component, OnInit } from '@angular/core';
import { MesaExamenMateriaDocenteService } from '../../../_services/mesa_examen_materia_docente.service';
import { MesaExamenMateriaDocente } from '../../../_models/mesa.examen';
import { TipoService } from '../../../_services/tipo.service';
import { Subject } from 'rxjs/internal/Subject';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DocenteService, FiltroDocente } from '../../../_services/docente.service';
import { SedeService } from '../../../_services/sede.service';
import { Docente } from '../../../_models/usuario';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TipoMesaDocente } from '../../../_models/tipo';

@Component({
  selector: 'app-mesa-materia-docente-editar-modal',
  templateUrl: './mesa-materia-docente-editar-modal.component.html',
  styleUrls: ['./mesa-materia-docente-editar-modal.component.scss']
})
export class MesaMateriaDocenteEditarModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  formulario: FormGroup;
  id_mesa_examen_materia:number=0;
  item:MesaExamenMateriaDocente;
  tipos:TipoMesaDocente[];
  docentes:Docente[] = [];
  
  constructor(
    public service:MesaExamenMateriaDocenteService,
    private docenteService:DocenteService,
    private sedeService:SedeService,
    private tiposService:TipoService,
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    ) {
      this.formulario = this.fb.group({
        id_usuario: [ '', Validators.required],
        id_tipo_mesa_docente: [ '', Validators.required],
        observaciones: '',
      });
    }

  onShow(id_mesa_examen_materia:number,item:MesaExamenMateriaDocente = <MesaExamenMateriaDocente>{id:0}){
    this.item = item;
    this.id_mesa_examen_materia = id_mesa_examen_materia;
    if(this.item.id>0){
      this.f.id_usuario.disable();
      this.f.id_tipo_mesa_docente.setValue(item.id_tipo_mesa_docente);
      this.f.observaciones.setValue(item.observaciones);
    } else {
      this.f.id_usuario.enable();
    }
  }

  ngOnInit() {
    this.onClose = new Subject();
    let id_sede = this.sedeService.getIdSede();
    this.docenteService.getAll(<FiltroDocente>{
      id_sede:+id_sede,
      estado:null,
    }).subscribe(response=>{
      this.docentes = response;
    });
    this.tiposService.mesas_docentes().subscribe(response=>{
      this.tipos = response;
    });
  }

  get f(){
    return this.formulario.controls;
  }

  confirmar(){
    if(!this.formulario.valid){
      return;
    }
    this.item.id_tipo_mesa_docente = this.f.id_tipo_mesa_docente.value;
    this.item.observaciones = this.f.id_tipo_mesa_docente.value;
    if(this.item.id>0){
      this.service.update(this.item).subscribe(response=>{
        this.toastr.success('Docente editado');
        this.onClose.next(true);
        this.bsModalRef.hide();
      });
    } else {
      this.item.id_usuario = this.f.id_usuario.value.id_usuario;
      this.item.id_mesa_examen_materia = this.id_mesa_examen_materia;
      this.service.register(this.item).subscribe(response=>{
        this.toastr.success('Docente asociado');
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
