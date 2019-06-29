import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultasRoutingModule } from './consultas-routing.module';
import { ListadoPagoComponent } from './listado-pago/listado-pago.component';
import { ListadoPlanPagoComponent } from './listado-plan-pago/listado-plan-pago.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, BsDatepickerModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    ConsultasRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    NgSelectModule,
    BsDatepickerModule,
  ],
  declarations: [ListadoPagoComponent, ListadoPlanPagoComponent]
})
export class ConsultasModule { }
