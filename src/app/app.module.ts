import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, registerLocaleData } from '@angular/common';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent, AutorizacionErrorModalComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule, TabsModule, AccordionModule } from 'ngx-bootstrap'
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HTTP_INTERCEPTORS, HttpClientModule,HttpRequest } from '@angular/common/http';
import { PassportInterceptor } from './_helpers/passport.interceptor';
import { AuthGuard } from './_guards/auth.guard';
import { DataTablesModule } from 'angular-datatables';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { TypeaheadModule, BsDatepickerModule, BsLocaleService, CollapseModule, TimepickerModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
defineLocale('es', esLocale);
import localeEsAR from '@angular/common/locales/es-AR';
registerLocaleData(localeEsAR, 'es-AR');

import { UsuarioSedeModalComponent } from './modals/usuario-sede-modal/usuario-sede-modal.component';
import { DialogConfirmComponent } from './_generic/dialog-confirm/dialog-confirm.component';
import { DialogAlertComponent } from './_generic/dialog-alert/dialog-alert.component';
import { PlanEditarComponent } from './academicos/plan-editar/plan-editar.component';
import { MateriaEditarComponent } from './academicos/materia-editar/materia-editar.component';
import { MateriaCorrelativaModalComponent } from './modals/materia-correlativa-modal/materia-correlativa-modal.component';
import { DialogInputComponent } from './_generic/dialog-input/dialog-input.component';
import { ObligacionPagarModalComponent } from './modals/obligacion-pagar-modal/obligacion-pagar-modal.component';
import { PagoModalComponent } from './modals/pago-modal/pago-modal.component';
import { DialogTextareaComponent } from './_generic/dialog-textarea/dialog-textarea.component';

import { BlockUIModule } from 'ng-block-ui';
import { BlockUIHttpModule } from 'ng-block-ui/http';
const requestFilters = [
  { method: 'GET', url: new RegExp('api\/alumnos\/coincidencia\?') },
  { method: 'GET', url: new RegExp('api\/email\?') },
  { method: 'GET', url: new RegExp('api\/extras\/localidades\?') },
  { method: 'GET', url: new RegExp('api\/sedes\/[0-9]+\/inscripciones\?') },
  { method: 'GET', url: new RegExp('api\/sedes\/[0-9]+\/alumnos\?') },
  { method: 'GET', url: new RegExp('api\/sedes\/[0-9]+\/comisiones\?') },
  { method: 'GET', url: new RegExp('api\/sedes\/[0-9]+\/comisiones\/alumnos\?') },
  { method: 'GET', url: new RegExp('api\/sedes\/[0-9]+\/mesas\?') },
  { method: 'GET', url: new RegExp('api\/carreras\?') },
  { method: 'GET', url: new RegExp('api\/sedes\/[0-9]+\/usuarios\?') },
  { method: 'GET', url: new RegExp('api\/sedes\/[0-9]+\/movimientos\?') },
  { method: 'GET', url: new RegExp('api\/sedes\/[0-9]+\/pagos\?') },
  { method: 'GET', url: new RegExp('api\/sedes\/[0-9]+\/planes_pago\?') },
  { method: 'GET', url: new RegExp('api\/sedes\/[0-9]+\/reportes\?') },
  { method: 'GET', url: new RegExp('api\/usuarios\?') },
  { method: 'GET', url: new RegExp('api\/docentes\?') },
  { method: 'GET', url: new RegExp('api\/materias\?') },
  { method: 'GET', url: new RegExp('api\/auditorias\/alumnos\?') },
  { method: 'GET', url: new RegExp('api\/alumnos\/sedes\?') },
];

export function filter(req: HttpRequest<any>): boolean {
  return requestFilters.some(({ method, url }: { method: string, url: RegExp}) => {
    return req.method === method && url.test(req.url);
  });
}

import { AuthenticationService } from './_services/authentication.service';
import { UsuarioService } from './_services/usuario.service';
import { ExtraService } from './_services/extra.service';
import { SedeService } from './_services/sede.service';
import { DepartamentoService } from './_services/departamento.service';
import { CarreraService } from './_services/carrera.service';
import { ModalidadService } from './_services/modalidad.service';
import { PlanService } from './_services/plan.service';
import { AlumnoService } from './_services/alumno.service';
import { MateriaService } from './_services/materia.service';
import { InscripcionService } from './_services/inscripcion.service';
import { MovimientoService } from './_services/movimiento.service';
import { DiariaService } from './_services/diaria.service';
import { BecaService } from './_services/beca.service';
import { ComisionService } from './_services/comision.service';
import { AsistenciaService } from './_services/asistencia.service';
import { MesaExamenService } from './_services/mesa_examen.service';
import { MesaExamenMateriaService } from './_services/mesa_examen_materia.service';
import { PlanPagoService } from './_services/plan_pago.service';
import { PagoService } from './_services/pago.service';
import { MesaExamenMateriaAlumnoService } from './_services/mesa_examen_materia_alumno.service';
import { MesaMateriaAlumnoModalComponent } from './mesas/componente/mesa-materia-alumno-modal/mesa-materia-alumno-modal.component';
import { AlumnoMateriaNotaModalComponent } from './academicos/componentes/alumno-materia-nota-modal/alumno-materia-nota-modal.component';
import { ExamenService } from './_services/examen.service';
import { ExamenAlumnoEditarModalComponent } from './examenes/componentes/examen-alumno-editar-modal/examen-alumno-editar-modal.component';
import { InscripcionAsistenciaModalComponent } from './academicos/componentes/inscripcion-asistencia-modal/inscripcion-asistencia-modal.component';
import { InscripcionExamenModalComponent } from './academicos/componentes/inscripcion-examen-modal/inscripcion-examen-modal.component';
import { NgxCurrencyModule } from "ngx-currency";
import { TramiteService } from './_services/tramite.service';
import { TipoService } from './_services/tipo.service';
import { DocenteService } from './_services/docente.service';
import { ComisionAlumnoService } from './_services/comision_alumno.service';
import { ExamenAlumnoService } from './_services/examen_alumno.service';
import { AsistenciaAlumnoService } from './_services/asistencia_alumno.service';
import { NovedadSistemaService } from './_services/novedad_sistema.service';
import { PlantillaImagenService } from './_services/plantilla_imagen.service';
import { NovedadModalComponent } from './modals/novedad-modal/novedad-modal.component';
import { TemplateComponent } from './notificaciones/template/template.component';
import { AlumnoSedeService } from './_services/alumno_sede.service';
import { AuditoriaService } from './_services/auditoria.service';
import { MesaExamenMateriaDocenteService } from './_services/mesa_examen_materia_docente.service';
import { ComisionDocenteService } from './_services/comision_docente.service';
import { ReporteJobService } from './_services/reportejobs.service';
import { DialogDateComponent } from './_generic/dialog-date/dialog-date.component';
import { HomeService } from './_services/home.service';
import { DocenteMateriaService } from './_services/docente_materia.service';
import { AulaService } from './_services/aula.service';
import { ComisionHorarioService } from './_services/comision_horario.service';
import { ObligacionService } from './_services/obligacion.service';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ListadoNovedadSistemaModalComponent } from './modals/listado-novedad-sistema-modal/listado-novedad-sistema-modal.component';
import { AppDispositivoService } from './_services/app_dispositivo.service';
import { AppAsistenciaService } from './_services/app_asistencia.service';
import { TipoInscripcionAbandonoService } from './_services/tipo_inscripcion_abandono.service.';
import { InscripcionAbandonoService } from './_services/inscripcion_abandono.service';

export const customCurrencyMaskConfig = {
    align: "left",
    allowNegative: true,
    allowZero: true,
    decimal: ",",
    precision: 2,
    prefix: "",
    suffix: "",
    thousands: ".",
    nullable: true
};
@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    DataTablesModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
    }),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    BlockUIModule.forRoot({
      message: 'Espere por favor...',
      
    }), 
    BlockUIHttpModule.forRoot({
      requestFilters:[filter],
    }), 
    NgSelectModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    AutorizacionErrorModalComponent,
    UsuarioSedeModalComponent,
    DialogConfirmComponent,
    DialogAlertComponent,
    PlanEditarComponent,
    MateriaEditarComponent,
    MateriaCorrelativaModalComponent,
    DialogInputComponent,
    ObligacionPagarModalComponent,
    PagoModalComponent,
    DialogTextareaComponent,
    MesaMateriaAlumnoModalComponent,
    AlumnoMateriaNotaModalComponent,
    ExamenAlumnoEditarModalComponent,
    InscripcionAsistenciaModalComponent,
    InscripcionExamenModalComponent,
    NovedadModalComponent,
    TemplateComponent,
    DialogDateComponent,
    ListadoNovedadSistemaModalComponent,
  ],
  providers: [
    AuthGuard,

    AuthenticationService,
    ExtraService,
    UsuarioService,
    SedeService,
    DepartamentoService,
    ModalidadService,
    CarreraService,
    PlanService,
    MateriaService,
    AlumnoService,
    InscripcionService,
    PlanPagoService,
    PagoService,
    MovimientoService,
    DiariaService,
    BecaService,
    ComisionService,
    ComisionAlumnoService,
    ComisionDocenteService,
    ComisionHorarioService,
    AsistenciaService,
    ExamenService,
    MesaExamenService,
    MesaExamenMateriaService,
    MesaExamenMateriaAlumnoService,
    MesaExamenMateriaDocenteService,
    TramiteService,
    TipoService,
    DocenteService,
    DocenteMateriaService,
    ExamenAlumnoService,
    AsistenciaAlumnoService,
    NovedadSistemaService,
    PlantillaImagenService,
    AlumnoSedeService,
    AuditoriaService,
    ReporteJobService,
    HomeService,
    AulaService,
    ObligacionService,
    TipoInscripcionAbandonoService,
    InscripcionAbandonoService,

    // APP
    AppDispositivoService,
    AppAsistenciaService,

    { provide: HTTP_INTERCEPTORS, useClass: PassportInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: LOCALE_ID, useValue: 'es-AR'},
  ],
  bootstrap: [ AppComponent ],
  entryComponents: [
    AutorizacionErrorModalComponent,
    DialogConfirmComponent,
    DialogAlertComponent,
    DialogInputComponent,
    DialogTextareaComponent,
    DialogDateComponent,
    UsuarioSedeModalComponent,
    PlanEditarComponent,
    MateriaEditarComponent,
    MateriaCorrelativaModalComponent,
    ObligacionPagarModalComponent,
    PagoModalComponent,
    MesaMateriaAlumnoModalComponent,
    AlumnoMateriaNotaModalComponent,
    ExamenAlumnoEditarModalComponent,
    InscripcionAsistenciaModalComponent,
    InscripcionExamenModalComponent,
    ListadoNovedadSistemaModalComponent,
  ],
})
export class AppModule { 
  constructor(
    private localeService: BsLocaleService
  ){
    this.localeService.use('es');
  }
}
