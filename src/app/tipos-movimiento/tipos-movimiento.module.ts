import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiposMovimientoRoutingModule } from './tipos-movimiento-routing.module';
import { ListadoTipoMovimientoComponent } from './listado-tipo-movimiento/listado-tipo-movimiento.component';
import { TipoMovimientoEditarComponent } from './tipo-movimiento-editar/tipo-movimiento-editar.component';
import { TipoMovimientoService } from '../_services/tipo_movimiento.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  imports: [
    CommonModule,
    TiposMovimientoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule,
    DataTablesModule,
  ],
  declarations: [ListadoTipoMovimientoComponent, TipoMovimientoEditarComponent],
  providers:[
    TipoMovimientoService,
  ]
})
export class TiposMovimientoModule { }
