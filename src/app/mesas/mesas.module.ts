import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MesasRoutingModule } from './mesas-routing.module';
import { ListadoMesaComponent } from './listado-mesa/listado-mesa.component';
import { MesaNuevoComponent } from './mesa-nuevo/mesa-nuevo.component';
import { MesaEditarComponent } from './mesa-editar/mesa-editar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListadoMateriaComponent } from './listado-materia/listado-materia.component';
import { MesaDetalleComponent } from './componente/mesa-detalle/mesa-detalle.component';
import { ListadoMesaMateriaComponent } from './listado-mesa-materia/listado-mesa-materia.component';
import { MesaMateriaEditarComponent } from './mesa-materia-editar/mesa-materia-editar.component';
import { MesaMateriaAlumnoVerComponent } from './mesa-materia-alumno-ver/mesa-materia-alumno-ver.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MesaVerComponent } from './mesa-ver/mesa-ver.component';
import { MesaMateriaEditarModalComponent } from './componente/mesa-materia-editar-modal/mesa-materia-editar-modal.component';
import { MesaMateriaDocenteEditarModalComponent } from './componente/mesa-materia-docente-editar-modal/mesa-materia-docente-editar-modal.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

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
    ModalModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    TooltipModule.forRoot(),
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
    MesaMateriaEditarModalComponent,
    MesaMateriaDocenteEditarModalComponent,
  ],
  entryComponents:[
    MesaMateriaEditarModalComponent,
    MesaMateriaDocenteEditarModalComponent,
  ]
})
export class MesasModule { }
