import { NgModule } from '@angular/core';
import { routing } from './academicos-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CarreraComponent } from './carrera/carrera.component';
import { CarreraEditarComponent } from './carrera-editar/carrera-editar.component';
import { CarreraVerComponent } from './carrera-ver/carrera-ver.component';
import { PlanComponent } from './plan/plan.component';
import { MateriaComponent } from './materia/materia.component';
import { AlumnoComponent } from './alumno/alumno.component';
import { AlumnoEditarComponent } from './alumno-editar/alumno-editar.component';
import { TypeaheadModule, BsDatepickerModule, CollapseModule, TooltipModule, ModalModule } from 'ngx-bootstrap';
import { InscripcionComponent } from './inscripcion/inscripcion.component';
import { InscripcionNuevoComponent } from './inscripcion-nuevo/inscripcion-nuevo.component';
import { AlumnoVerComponent } from './alumno-ver/alumno-ver.component';
import { AlumnoDetalleComponent } from './componentes/alumno-detalle/alumno-detalle.component';
import { InscripcionVerComponent } from './inscripcion-ver/inscripcion-ver.component';
import { CarreraDetalleComponent } from './componentes/carrera-detalle/carrera-detalle.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { InscripcionComisionComponent } from './inscripcion-comision/inscripcion-comision.component';
import { InscripcionMesaComponent } from './inscripcion-mesa/inscripcion-mesa.component';
import { InscripcionMesaNuevoComponent } from './inscripcion-mesa-nuevo/inscripcion-mesa-nuevo.component';
import { InscripcionPlanNuevoComponent } from './inscripcion-plan-nuevo/inscripcion-plan-nuevo.component';
import { InscripcionEditarComponent } from './inscripcion-editar/inscripcion-editar.component';
import { InscripcionNotaComponent } from './inscripcion-nota/inscripcion-nota.component';
import { AlumnoCuotaGuard } from '../_guards/alumno_cuota.guard';
import { InscripcionCuotaGuard } from '../_guards/inscripcion_cuota.guard';
import { NgxCurrencyModule } from 'ngx-currency';
import { TramiteNuevoModalComponent } from './componentes/tramite-nuevo-modal/tramite-nuevo-modal.component';
import { ListadoPagoInscripcionModalComponent } from './componentes/listado-pago-inscripcion-modal/listado-pago-inscripcion-modal.component';
import { ListadoComisionModalComponent } from './listado-comision-modal/listado-comision-modal.component';

@NgModule({
  imports: [
    routing,
    DataTablesModule,
    CommonModule ,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    TooltipModule.forRoot(),
    BsDatepickerModule,
    CollapseModule,
    NgSelectModule,
    NgxCurrencyModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    CarreraComponent,
    CarreraEditarComponent,
    CarreraVerComponent,
    PlanComponent,
    MateriaComponent,
    AlumnoComponent,
    AlumnoEditarComponent,
    InscripcionComponent,
    InscripcionNuevoComponent,
    AlumnoVerComponent,
    AlumnoDetalleComponent,
    InscripcionVerComponent,
    CarreraDetalleComponent,
    InscripcionComisionComponent,
    InscripcionMesaComponent,
    InscripcionMesaNuevoComponent,
    InscripcionPlanNuevoComponent,
    InscripcionEditarComponent,
    InscripcionNotaComponent,
    TramiteNuevoModalComponent,
    ListadoPagoInscripcionModalComponent,
    ListadoComisionModalComponent,
  ],
  entryComponents: [
    TramiteNuevoModalComponent,
    ListadoPagoInscripcionModalComponent,
    ListadoComisionModalComponent,
  ],
  providers:[
    AlumnoCuotaGuard,
    InscripcionCuotaGuard,
  ]
})
export class AcademicosModule { }
