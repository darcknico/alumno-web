import { Component, OnInit } from '@angular/core';
import { DiariaService } from '../../_services/diaria.service';
import { Diaria } from '../../_models/diaria';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-diaria-nuevo',
  templateUrl: './diaria-nuevo.component.html',
  styleUrls: ['./diaria-nuevo.component.scss']
})
export class DiariaNuevoComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  ultimos:Diaria[];
  ultimo:Diaria = null;
  formulario:FormGroup;
  hoy:Date;

  constructor(
    private service:DiariaService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private location: Location,
  ) { 
    this.hoy = moment().toDate();
    this.formulario = this.fb.group({
      fecha_inicio:[null,Validators.required],
      saldo_anterior:0,
      saldo_otros_anterior:0,
    });
    this.f.saldo_anterior.disable();
    this.f.saldo_otros_anterior.disable();
  }

  ngOnInit() {
    this.dtOptions = {
      ordering:false,
      paging:false,
      searching:false,
      info:false,
      columns: [
        { 
          data: 'fecha_inicio',
          width: '5%', 
        }, { data: 'saldo_anterior' }, { data: 'total_ingresos' },{ data: 'total_egresos'},{data:'saldo'}
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
    };
    this.service.ultimos().subscribe(response=>{
      this.ultimos = response;
      if(this.ultimos.length>0){
        this.ultimo = this.ultimos[0];
        let fecha_inicio = moment(this.ultimo.fecha_fin).add('days',1);
        if(!fecha_inicio.isValid()){
          fecha_inicio = moment();
        }
        this.f.fecha_inicio.setValue(fecha_inicio.toDate());
        this.f.saldo_anterior.setValue(this.ultimo.saldo);
        this.f.saldo_otros_anterior.setValue(this.ultimo.saldo_otros);
        if(this.ultimo.fecha_fin == null){
          this.toastr.warning('La ultima diaria esta abierta. Es recomendable cerrarla antes de continuar');
        }
      }
      
    });
  }

  get f(){
    return this.formulario.controls;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }

    let item = <Diaria>{};
    item.fecha_inicio = moment(this.f.fecha_inicio.value).format('YYYY-MM-DD');
    this.service.register(item).subscribe(response=>{
      this.toastr.success('Se a dejado abierta una nueva diaria');
      this.volver();
    });
  }

  volver(){
    this.location.back();
  }

}
