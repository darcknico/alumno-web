import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsistenciasRoutingModule } from './asistencias-routing.module';
import { ListadoAsistenciaComponent } from './listado-asistencia/listado-asistencia.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NgSelectModule } from '@ng-select/ng-select';
import { AsistenciaVerComponent } from './asistencia-ver/asistencia-ver.component';
import { AsistenciaDetalleComponent } from './componente/asistencia-detalle/asistencia-detalle.component';

@NgModule({
  imports: [
    CommonModule,
    AsistenciasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    BsDropdownModule,
    NgSelectModule,
    CollapseModule,
  ],
  declarations: [ListadoAsistenciaComponent, AsistenciaVerComponent, AsistenciaDetalleComponent]
})
export class AsistenciasModule { }
