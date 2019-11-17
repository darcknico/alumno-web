import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovimientosRoutingModule } from './movimientos-routing.module';
import { ListadoMovimientoComponent } from './listado-movimiento/listado-movimiento.component';
import { IngresoComponent } from './componentes/ingreso/ingreso.component';
import { EgresoComponent } from './componentes/egreso/egreso.component';
import { DiariaDetalleComponent } from './componentes/diaria-detalle/diaria-detalle.component';
import { ListadoDiariaComponent } from './listado-diaria/listado-diaria.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, BsDatepickerModule, ModalModule } from 'ngx-bootstrap';
import { MovimientoService } from '../_services/movimiento.service';
import { DiariaComponent } from './diaria/diaria.component';
import { DiariaService } from '../_services/diaria.service';
import { MovimientoComponent } from './movimiento/movimiento.component';
import { TipoMovimientoService } from '../_services/tipo_movimiento.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxCurrencyModule } from 'ngx-currency';
import { MovimientoEditarModalComponent } from './movimiento-editar-modal/movimiento-editar-modal.component';
import { DiariaNuevoComponent } from './diaria-nuevo/diaria-nuevo.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    MovimientosRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    NgSelectModule,
    BsDatepickerModule,
    NgxCurrencyModule,
    ModalModule.forRoot(),
    NgxPrintModule,
  ],
  declarations: [
    ListadoMovimientoComponent, 
    IngresoComponent, 
    EgresoComponent, 
    DiariaDetalleComponent, 
    ListadoDiariaComponent, 
    DiariaComponent, 
    MovimientoComponent, 
    MovimientoEditarModalComponent, DiariaNuevoComponent, EstadisticasComponent
  ],
  providers:[
    MovimientoService,
    TipoMovimientoService,
    DiariaService,
  ],
  entryComponents: [
    MovimientoEditarModalComponent,
  ]
})
export class MovimientosModule { }
