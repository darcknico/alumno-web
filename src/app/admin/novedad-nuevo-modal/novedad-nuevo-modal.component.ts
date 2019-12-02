import { Component, OnInit } from '@angular/core';
import { NovedadSistemaService } from '../../_services/novedad_sistema.service';
import { NovedadSistema } from '../../_models/novedad';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-novedad-nuevo-modal',
  templateUrl: './novedad-nuevo-modal.component.html',
  styleUrls: ['./novedad-nuevo-modal.component.scss']
})
export class NovedadNuevoModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  formulario:FormGroup;

  constructor(
    private service:NovedadSistemaService,
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
  ) { 
    this.formulario = this.fb.group({
      titulo: [ '', [Validators.required,Validators.maxLength(255)]],
      descripcion: [ '', Validators.maxLength(255)],
    });
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  get f(){
    return this.formulario.controls;
  }

  confirmar(){
    var item = <NovedadSistema>{}
    item.titulo = this.f.titulo.value;
    item.descripcion = this.f.descripcion.value;

    this.service.register(item).subscribe(response=>{
      this.toastr.success('Generando Novedad', '');
      this.onClose.next(true);
      this.bsModalRef.hide();
      this.router.navigate(['/admin/novedades/'+response.id+'/editar']);
    });
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}
