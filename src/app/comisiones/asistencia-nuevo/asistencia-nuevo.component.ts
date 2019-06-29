import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../../_services/asistencia.service';
import { ComisionService } from '../../_services/comision.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Comision } from '../../_models/comision';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Asistencia } from '../../_models/asistencia';

@Component({
  selector: 'app-asistencia-nuevo',
  templateUrl: './asistencia-nuevo.component.html',
  styleUrls: ['./asistencia-nuevo.component.scss']
})
export class AsistenciaNuevoComponent implements OnInit {

  comision:Comision;
  formulario: FormGroup;

  consultando = false;
  constructor(
    private comisionService:ComisionService,
    private asistenciaService:AsistenciaService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    let hoy = moment();
    this.formulario = this.fb.group({
      fecha: [hoy.toDate(), Validators.required],
    });
  }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.comisionService.sede(id_sede);
    this.asistenciaService.sede(id_sede);

    this.route.params.subscribe(params=>{
      let ids = params['id_comision'];
      this.comisionService.getById(ids).subscribe(response=>{
        this.comision = response;
      });
      
    });
  }

  get f(){
    return this.formulario.controls;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    var item = <Asistencia>{};
    item.fecha = moment(this.f.fecha.value).format('YYYY-MM-DD');
    item.id_comision = this.comision.id;

    this.consultando = true;
    this.asistenciaService.register(item).subscribe(resposne=>{
      this.toastr.success('Asistencia generada', '');
      this.volver();
    },err=>{
      this.consultando = false;
    });
  }

  volver(){
    this.router.navigate(['/comisiones/'+this.comision.id+'/ver']);
  }

}
