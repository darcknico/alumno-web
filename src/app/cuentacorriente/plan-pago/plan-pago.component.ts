import { Component, OnInit } from '@angular/core';
import { PlanPago } from '../../_models/plan_pago';
import { AuthenticationService } from '../../_services/authentication.service';
import { PlanPagoService } from '../../_services/plan_pago.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-plan-pago',
  templateUrl: './plan-pago.component.html',
  styleUrls: ['./plan-pago.component.scss']
})
export class PlanPagoComponent implements OnInit {

  id:number;
  plan_pago:PlanPago;
  constructor(
    private planPagoService:PlanPagoService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    ) { }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.planPagoService.sede(id_sede);

    this.route.params.subscribe(params=>{
      let ids_usuario = params['id_plan_pago'];
      if(ids_usuario==null){
        this.id = 0;
      } else {
        this.id = +ids_usuario;
      }
      this.iniciar();
    });
  }

  iniciar(){
    this.planPagoService.getById(this.id).subscribe(response=>{
      this.plan_pago = response;
    });
  }

  ver_cuotas(){
    this.router.navigate(['/cuentacorriente/'+this.plan_pago.id+'/cuotas']);
  }

  ver_pagos(){
    this.router.navigate(['/cuentacorriente/'+this.plan_pago.id+'/pagos']);
  }

  ver_matricula(){
    this.router.navigate(['/cuentacorriente/'+this.plan_pago.id+'/matricula']);
  }

  generar_pago(){
    this.router.navigate(['/cuentacorriente/'+this.plan_pago.id+'/pagos/cuotas']);
  }

  generar_pago_bonificado(){
    this.router.navigate(['/cuentacorriente/'+this.plan_pago.id+'/pagos/bonificar']);
  }

  generar_pago_matricula(){
    this.router.navigate(['/cuentacorriente/'+this.plan_pago.id+'/pagos/matricula']);
  }

}
