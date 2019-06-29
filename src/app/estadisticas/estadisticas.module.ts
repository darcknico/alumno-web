import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstadisticasRoutingModule } from './estadisticas-routing.module';
import { PagoComponent } from './pago/pago.component';

@NgModule({
  imports: [
    CommonModule,
    EstadisticasRoutingModule
  ],
  declarations: [PagoComponent]
})
export class EstadisticasModule { }
