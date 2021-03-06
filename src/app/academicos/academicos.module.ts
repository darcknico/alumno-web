import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routing } from './academicos-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarreraComponent } from './carrera/carrera.component';
import { CarreraEditarComponent } from './carrera-editar/carrera-editar.component';
import { CarreraVerComponent } from './carrera-ver/carrera-ver.component';
import { PlanComponent } from './plan/plan.component';
import { MateriaComponent } from './materia/materia.component';
import { AlumnoComponent } from './alumno/alumno.component';
import { AlumnoEditarComponent } from './alumno-editar/alumno-editar.component';
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
import { ListadoAlumnoSedeModalComponent } from './componentes/listado-alumno-sede-modal/listado-alumno-sede-modal.component';
import { AlumnoVerModalComponent } from './componentes/alumno-ver-modal/alumno-ver-modal.component';
import { ListadoMateriaComponent } from './listado-materia/listado-materia.component';
import { MateriaVerComponent } from './materia-ver/materia-ver.component';
import { MateriaDetalleComponent } from './componentes/materia-detalle/materia-detalle.component';
import { ListadoMateriaComisionComponent } from './componentes/listado-materia-comision/listado-materia-comision.component';
import { ListadoMateriaMesaExamenComponent } from './componentes/listado-materia-mesa-examen/listado-materia-mesa-examen.component';
import { AlumnoArchivoEditarModalComponent } from './componentes/alumno-archivo-editar-modal/alumno-archivo-editar-modal.component';
import { InscripcionMesaMultipleNuevoComponent } from './inscripcion-mesa-multiple-nuevo/inscripcion-mesa-multiple-nuevo.component';
import { InscripcionComisionMultipleNuevoComponent } from './inscripcion-comision-multiple-nuevo/inscripcion-comision-multiple-nuevo.component';
import { InscripcionEgresadoModalComponent } from './componentes/inscripcion-egresado-modal/inscripcion-egresado-modal.component';
import { InscripcionAbandonadoModalComponent } from './componentes/inscripcion-abandonado-modal/inscripcion-abandonado-modal.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ListadoInscripcionEstadoModalComponent } from './componentes/listado-inscripcion-estado-modal/listado-inscripcion-estado-modal.component';
import { InscripcionEstadoModalComponent } from './componentes/inscripcion-estado-modal/inscripcion-estado-modal.component';

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
    AccordionModule.forRoot(),
    PopoverModule.forRoot()
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
    ListadoAlumnoSedeModalComponent,
    AlumnoVerModalComponent,
    ListadoMateriaComponent,
    MateriaVerComponent,
    MateriaDetalleComponent,
    ListadoMateriaComisionComponent,
    ListadoMateriaMesaExamenComponent,
    AlumnoArchivoEditarModalComponent,
    InscripcionMesaMultipleNuevoComponent,
    InscripcionComisionMultipleNuevoComponent,
    InscripcionEgresadoModalComponent,
    InscripcionAbandonadoModalComponent,
    ListadoInscripcionEstadoModalComponent,
    InscripcionEstadoModalComponent,
  ],
  entryComponents: [
    TramiteNuevoModalComponent,
    ListadoPagoInscripcionModalComponent,
    ListadoComisionModalComponent,
    ListadoAlumnoSedeModalComponent,
    AlumnoVerModalComponent,
    AlumnoArchivoEditarModalComponent,
    InscripcionEgresadoModalComponent,
    InscripcionAbandonadoModalComponent,
    ListadoInscripcionEstadoModalComponent,
    InscripcionEstadoModalComponent,
  ],
  providers:[
    AlumnoCuotaGuard,
    InscripcionCuotaGuard,
  ]
})
export class AcademicosModule { }
