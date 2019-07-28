import { Component, OnInit } from '@angular/core';
import { ComisionService } from '../../_services/comision.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Comision } from '../../_models/comision';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ExamenService } from '../../_services/examen.service';
import { Examen, TipoExamen } from '../../_models/examen';

@Component({
  selector: 'app-examen-nuevo',
  templateUrl: './examen-nuevo.component.html',
  styleUrls: ['./examen-nuevo.component.scss']
})
export class ExamenNuevoComponent implements OnInit {

  id_comision_examen:number = null;
  comision:Comision;
  formulario: FormGroup;
  tipos:TipoExamen[];
  consultando = false;
  constructor(
    private comisionService:ComisionService,
    private examenService:ExamenService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    let hoy = moment();
    this.formulario = this.fb.group({
      fecha: [hoy.toDate(), Validators.required],
      id_tipo_examen: [null,Validators.required],
      nombre:'',
      observaciones:'',
    });
  }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.comisionService.sede(id_sede);
    this.examenService.sede(id_sede);

    this.route.params.subscribe(params=>{
      let ids = params['id_comision'];
      this.comisionService.getById(ids).subscribe(response=>{
        this.comision = response;
      });
      let id_comision_examen = params['id_comision_examen'];
      if(id_comision_examen){
        this.id_comision_examen = +id_comision_examen;
        this.examenService.getById(id_comision_examen).subscribe(response=>{
          let fecha = moment(response.fecha);
          this.f.fecha.setValue(fecha.toDate());
          this.f.id_tipo_examen.setValue(response.id_tipo_examen);
          this.f.nombre.setValue(response.nombre);
          this.f.observaciones.setValue(response.observaciones);
        });
      }
      
    });

    this.examenService.tipos().subscribe(response=>{
      this.tipos = response;
    });
  }

  get f(){
    return this.formulario.controls;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    var item = <Examen>{};
    item.fecha = moment(this.f.fecha.value).format('YYYY-MM-DD');
    item.id_tipo_examen = this.f.id_tipo_examen.value;
    item.nombre = this.f.nombre.value;
    item.observaciones = this.f.observaciones.value;
    item.id_comision = this.comision.id;

    this.consultando = true;
    if(this.id_comision_examen){
      item.id = this.id_comision_examen;
      this.examenService.update(item).subscribe(resposne=>{
        this.toastr.success('Examen editada', '');
        this.volver();
      },err=>{
        this.consultando = false;
      });
    } else {
      this.examenService.register(item).subscribe(resposne=>{
        this.toastr.success('Examen generada', '');
        this.volver();
      },err=>{
        this.consultando = false;
      });
    }
    
  }

  volver(){
    this.router.navigate(['/comisiones/'+this.comision.id+'/ver']);
  }
}