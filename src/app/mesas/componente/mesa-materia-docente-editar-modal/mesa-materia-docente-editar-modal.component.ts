import { Component, OnInit, ViewChild } from '@angular/core';
import { MesaExamenMateriaDocenteService } from '../../../_services/mesa_examen_materia_docente.service';
import { MesaExamenMateriaDocente, MesaExamenMateria } from '../../../_models/mesa.examen';
import { TipoService } from '../../../_services/tipo.service';
import { Subject } from 'rxjs/internal/Subject';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DocenteService, FiltroDocente } from '../../../_services/docente.service';
import { SedeService } from '../../../_services/sede.service';
import { Docente, DocenteMateria } from '../../../_models/usuario';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TipoMesaDocente } from '../../../_models/tipo';
import { DocenteMateriaService, FiltroDocenteMateria } from '../../../_services/docente_materia.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-mesa-materia-docente-editar-modal',
  templateUrl: './mesa-materia-docente-editar-modal.component.html',
  styleUrls: ['./mesa-materia-docente-editar-modal.component.scss']
})
export class MesaMateriaDocenteEditarModalComponent implements OnInit {
  @ViewChild('docentesSelect')docentesSelect: NgSelectComponent;

  public onClose: Subject<boolean>;
  formulario: FormGroup;
  mesa_examen_materia:MesaExamenMateria;
  item:MesaExamenMateriaDocente;
  tipos:TipoMesaDocente[];
  docentes:Docente[] = [];
  recomendaciones:DocenteMateria[]=[];
  
  constructor(
    public service:MesaExamenMateriaDocenteService,
    private docenteService:DocenteService,
    private sedeService:SedeService,
    private tiposService:TipoService,
    private docenteMateriaService:DocenteMateriaService,
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    ) {
      this.formulario = this.fb.group({
        id_usuario: [ null, Validators.required],
        id_tipo_mesa_docente: [ '', Validators.required],
        observaciones: '',
      });
    }

  onShow(mesa_examen_materia:MesaExamenMateria,item:MesaExamenMateriaDocente = <MesaExamenMateriaDocente>{id:0}){
    this.item = item;
    this.mesa_examen_materia = mesa_examen_materia;
    if(this.item.id>0){
      this.f.id_usuario.disable();
      this.f.id_tipo_mesa_docente.setValue(item.id_tipo_mesa_docente);
      this.f.observaciones.setValue(item.observaciones);
    } else {
      this.f.id_usuario.enable();
    }
    let filtro = <FiltroDocenteMateria>{};
    filtro.id_sede = mesa_examen_materia.mesa_examen.id_sede;
    filtro.id_materia = mesa_examen_materia.id_materia;
    this.docenteMateriaService.getAll(filtro).subscribe(response=>{
      this.recomendaciones = response;
      mesa_examen_materia.docentes.forEach(docente=>{
        this.recomendaciones.forEach(item=>{
          if(item.id_usuario == docente.id_usuario){
            item.estado = false;
          }
          return item;
        });
      });
    });
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
      this.item.id_mesa_examen_materia = this.mesa_examen_materia.id;
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

  seleccionar_docente(item:DocenteMateria){
    this.docenteCambiado(item.docente);
    this.f.id_usuario.setValue(item.docente);
  }
  docenteCambiado(item:Docente){
    this.recomendaciones.forEach(docente=>{
      if(docente.id_usuario == item.id_usuario){
        docente.estado = false;
      } else {
        docente.estado = true;
      }
      return docente;
    });
    this.mesa_examen_materia.docentes.forEach(docente=>{
      this.recomendaciones.forEach(i=>{
        if(i.id_usuario == docente.id_usuario){
          i.estado = false;
        }
        return i;
      });
    });
  }

  compararDocente(a: Docente, b: Docente){
    return a.id_usuario == b.id_usuario;
  }

  buscarDocente(term: string, item: Docente){
    term = term.toUpperCase();
    let apellido = item.usuario.apellido.toUpperCase().indexOf(term) !== -1;
    let nombre = item.usuario.nombre.toUpperCase().indexOf(term) !== -1;
    let resultado = String(item.cuit).startsWith(term) || apellido || nombre;
    return resultado;
  }

}
