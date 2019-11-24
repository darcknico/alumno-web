import { Component, OnInit } from '@angular/core';
import { PlantillaService } from '../../_services/plantilla.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { Plantilla } from '../../_models/plantilla';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plantilla-nueva-modal',
  templateUrl: './plantilla-nueva-modal.component.html',
  styleUrls: ['./plantilla-nueva-modal.component.scss']
})
export class PlantillaNuevaModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  formulario:FormGroup;

  constructor(
    private service:PlantillaService,
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
  ) { 
    this.formulario = this.fb.group({
      titulo: [ '', Validators.required],
      descripcion: '',
    });
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  get f(){
    return this.formulario.controls;
  }

  confirmar(){
    var item = <Plantilla>{}
    item.titulo = this.f.titulo.value;
    item.descripcion = this.f.descripcion.value;

    this.service.register(item).subscribe(response=>{
      this.toastr.success('Generando Plantilla', '');
      this.onClose.next(true);
      this.bsModalRef.hide();
      this.router.navigate(['/notificaciones/plantillas/'+response.id+'/editar']);
    });
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}
