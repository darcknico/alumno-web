import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComisionesRoutingModule } from './comisiones-routing.module';
import { ListadoComisionComponent } from './listado-comision/listado-comision.component';
import { ComisionEditarComponent } from './comision-editar/comision-editar.component';
import { ComisionVerComponent } from './comision-ver/comision-ver.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule, BsDropdownModule, CollapseModule, ModalModule } from 'ngx-bootstrap';
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
    ModalModule.forRoot(),
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
    ComisionAlumnoEditarModalComponent, ComisionAlumnoVerModalComponent
  ],
  entryComponents:[
    ComisionAlumnoEditarModalComponent,
    ComisionAlumnoVerModalComponent,
  ]
})
export class ComisionesModule { }
