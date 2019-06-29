import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MesasRoutingModule } from './mesas-routing.module';
import { ListadoMesaComponent } from './listado-mesa/listado-mesa.component';
import { MesaNuevoComponent } from './mesa-nuevo/mesa-nuevo.component';
import { MesaEditarComponent } from './mesa-editar/mesa-editar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { BsDropdownModule, BsDatepickerModule, CollapseModule, TimepickerModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListadoMateriaComponent } from './listado-materia/listado-materia.component';
import { MesaDetalleComponent } from './componente/mesa-detalle/mesa-detalle.component';
import { ListadoMesaMateriaComponent } from './listado-mesa-materia/listado-mesa-materia.component';
import { MesaMateriaEditarComponent } from './mesa-materia-editar/mesa-materia-editar.component';
import { MesaMateriaAlumnoVerComponent } from './mesa-materia-alumno-ver/mesa-materia-alumno-ver.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MesaVerComponent } from './mesa-ver/mesa-ver.component';

@NgModule({
  imports: [
    CommonModule,
    MesasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    FormsModule,
    BsDropdownModule,
    NgSelectModule,
    BsDatepickerModule,
    TimepickerModule,
    CollapseModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  declarations: [
    ListadoMesaComponent, 
    MesaNuevoComponent, 
    MesaEditarComponent, 
    ListadoMateriaComponent, 
    MesaDetalleComponent, 
    ListadoMesaMateriaComponent, 
    MesaMateriaEditarComponent, 
    MesaMateriaAlumnoVerComponent,
    MesaVerComponent,
  ],
  entryComponents:[

  ]
})
export class MesasModule { }
