import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuentacorrienteRoutingModule } from './cuentacorriente-routing.module';
import { PlanPagoComponent } from './plan-pago/plan-pago.component';
import { PagoComponent } from './pago/pago.component';
import { PagoBonificarComponent } from './pago-bonificar/pago-bonificar.component';
import { ListadoPagoComponent } from './listado-pago/listado-pago.component';
import { PlanPagoTableroComponent } from './componente/plan-pago-tablero/plan-pago-tablero.component';
import { CuentaCorrienteComponent } from './componente/cuenta-corriente/cuenta-corriente.component';
import { ObligacionSiguienteComponent } from './componente/obligacion-siguiente/obligacion-siguiente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, BsDatepickerModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { PagoMatriculaComponent } from './pago-matricula/pago-matricula.component';
import { DataTablesModule } from 'angular-datatables';
import { ListadoCuotaComponent } from './listado-cuota/listado-cuota.component';
import { ListadoMatriculaComponent } from './listado-matricula/listado-matricula.component';
import { PagoReciboComponent } from './pago-recibo/pago-recibo.component';
import { PlanPagoDetalleComponent } from './componente/plan-pago-detalle/plan-pago-detalle.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { ObligacionVerModalComponent } from './componente/obligacion-ver-modal/obligacion-ver-modal.component';

@NgModule({
  imports: [
    CommonModule,
    CuentacorrienteRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule,
    NgxCurrencyModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  declarations: [
    PlanPagoComponent, 
    PagoComponent, 
    PagoBonificarComponent, 
    ListadoPagoComponent, 
    PlanPagoTableroComponent, 
    CuentaCorrienteComponent, 
    ObligacionSiguienteComponent, 
    PagoMatriculaComponent, 
    ListadoCuotaComponent, 
    ListadoMatriculaComponent, 
    PagoReciboComponent, 
    PlanPagoDetalleComponent, 
    ObligacionVerModalComponent,
  ],
  entryComponents:[
    ObligacionVerModalComponent,
  ],
  providers:[
  ]
})
export class CuentacorrienteModule { }
