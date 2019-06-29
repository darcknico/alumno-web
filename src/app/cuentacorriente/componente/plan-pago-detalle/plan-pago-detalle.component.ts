import { Component, OnInit, Input } from '@angular/core';
import { PlanPago } from '../../../_models/plan_pago';

@Component({
  selector: 'app-plan-pago-detalle-component',
  templateUrl: './plan-pago-detalle.component.html',
  styleUrls: ['./plan-pago-detalle.component.scss']
})
export class PlanPagoDetalleComponent implements OnInit {

  @Input('plan_pago') plan_pago:PlanPago;
  constructor() { }

  ngOnInit() {
  }

}
