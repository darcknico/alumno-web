import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComisionesRoutingModule } from './comisiones-routing.module';
import { ListadoComisionComponent } from './listado-comision/listado-comision.component';
import { ComisionEditarComponent } from './comision-editar/comision-editar.component';
import { ComisionVerComponent } from './comision-ver/comision-ver.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { ComisionDetalleComponent } from './componente/comision-detalle/comision-detalle.component';
import { ListadoAsistenciaComponent } from './listado-asistencia/listado-asistencia.component';
import { ListadoAlumnoDisponibleComponent } from './listado-alumno-disponible/listado-alumno-disponible.component';
import { AsistenciaNuevoComponent } from './asistencia-nuevo/asistencia-nuevo.component';
import { ComisionCarreraComponent } from './comision-carrera/comision-carrera.component';
import { ComisionMateriaComponent } from './comision-materia/comision-materia.component';
import { ExamenNuevoComponent } from './examen-nuevo/examen-nuevo.component';
import { ListadoExamenComponent } from './listado-examen/listado-examen.component';
import { ListadoAlumnoComponent } from './listado-alumno/listado-alumno.component';
import { ComisionAlumnoEditarModalComponent } from './comision-alumno-editar-modal/comision-alumno-editar-modal.component';
import { ComisionAlumnoVerModalComponent } from './comision-alumno-ver-modal/comision-alumno-ver-modal.component';
import { ListadoComisionDocenteModalComponent } from './componente/listado-comision-docente-modal/listado-comision-docente-modal.component';
import { ListadoComisionHorarioComponent } from './componente/listado-comision-horario/listado-comision-horario.component';
import { ComisionHorarioEditarModalComponent } from './componente/comision-horario-editar-modal/comision-horario-editar-modal.component';
import { ListadoHorarioComponent } from './listado-horario/listado-horario.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ComisionExamenHelpComponent } from './componente/comision-examen-help/comision-examen-help.component';
import { ComisionExamenCalendarComponent } from './componente/comision-examen-calendar/comision-examen-calendar.component';
import { ComisionAsistenciaCalendarComponent } from './componente/comision-asistencia-calendar/comision-asistencia-calendar.component';
import { ComisionMultipleNuevoComponent } from './comision-multiple-nuevo/comision-multiple-nuevo.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    ComisionesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    BsDropdownModule,
    NgSelectModule,
    BsDatepickerModule,
    CollapseModule,
    TimepickerModule,
    ModalModule.forRoot(),
    CalendarModule,
  ],
  declarations: [
    ListadoComisionComponent, 
    ComisionEditarComponent, 
    ComisionVerComponent, 
    ComisionDetalleComponent, 
    ListadoAsistenciaComponent, 
    ListadoAlumnoDisponibleComponent, 
    AsistenciaNuevoComponent, 
    ComisionCarreraComponent, 
    ComisionMateriaComponent, 
    ExamenNuevoComponent, 
    ListadoExamenComponent, 
    ListadoAlumnoComponent, 
    ComisionAlumnoEditarModalComponent, 
    ComisionAlumnoVerModalComponent, 
    ListadoComisionDocenteModalComponent, 
    ListadoComisionHorarioComponent, 
    ComisionHorarioEditarModalComponent, ListadoHorarioComponent, ComisionExamenHelpComponent, ComisionExamenCalendarComponent, ComisionAsistenciaCalendarComponent, ComisionMultipleNuevoComponent,
  ],
  entryComponents:[
    ComisionAlumnoEditarModalComponent,
    ComisionAlumnoVerModalComponent,
    ListadoComisionDocenteModalComponent,
    ComisionHorarioEditarModalComponent,
  ]
})
export class ComisionesModule { }
