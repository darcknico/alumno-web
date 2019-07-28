import { Component, OnInit } from '@angular/core';
import { MesaExamenService } from '../../_services/mesa_examen.service';
import { MesaExamen } from '../../_models/mesa.examen';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-mesa-nuevo',
  templateUrl: './mesa-nuevo.component.html',
  styleUrls: ['./mesa-nuevo.component.scss']
})
export class MesaNuevoComponent implements OnInit {

  formulario: FormGroup;

  consultando = false;
  constructor(
    private mesaExamenService:MesaExamenService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    let hoy = moment();
    this.formulario = this.fb.group({
      fecha_inicio: [hoy.toDate(), Validators.required],
      fecha_fin: '',
      nombre:'',
      numero:'',
    });
    this.f.numero.disable();
  }

  ngOnInit() {
    
  }

  get f(){
    return this.formulario.controls;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    var item = <MesaExamen>{};
    item.fecha_inicio = moment(this.f.fecha_inicio.value).format('YYYY-MM-DD');
    item.fecha_fin = this.f.fecha_fin.value;
    if(item.fecha_fin){
      item.fecha_fin = moment(this.f.fecha_fin.value).format('YYYY-MM-DD');
    }
    item.nombre = this.f.nombre.value;

    this.consultando = true;
    this.mesaExamenService.register(item).subscribe(resposne=>{
      this.toastr.success('Mesa de examen generada', '');
      this.volver();
    },err=>{
      this.consultando = false;
    });
  }

  volver(){
    this.router.navigate(['/mesas']);
  }
}
