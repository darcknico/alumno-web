import { Component, OnInit, Input } from '@angular/core';
import { PlanPago } from '../../../_models/plan_pago';

@Component({
  selector: 'app-plan-pago-tablero-component',
  templateUrl: './plan-pago-tablero.component.html',
  styleUrls: ['./plan-pago-tablero.component.scss']
})
export class PlanPagoTableroComponent implements OnInit {

  @Input('plan_pago') plan_pago:PlanPago;
  constructor() { }

  ngOnInit() {
  }

}
