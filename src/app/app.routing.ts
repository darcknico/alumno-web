import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { AuthGuard } from './_guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Inicio'
    },
    canActivate: [AuthGuard],
    children: [
      { path: 'admin', loadChildren:'./admin/admin.module#AdminModule' },
      { path: 'establecimientos', loadChildren:'./establecimientos/establecimientos.module#EstablecimientosModule' },
      { path: 'academicos', loadChildren:'./academicos/academicos.module#AcademicosModule' },
      { path: 'notificaciones', loadChildren:'./notificaciones/notificaciones.module#NotificacionesModule' },
      { path: 'cuentacorriente', loadChildren:'./cuentacorriente/cuentacorriente.module#CuentacorrienteModule' },
      { path: 'movimientos', loadChildren:'./movimientos/movimientos.module#MovimientosModule' },
      { path: 'tipos_movimiento', loadChildren:'./tipos-movimiento/tipos-movimiento.module#TiposMovimientoModule' },
      { path: 'consultas', loadChildren:'./consultas/consultas.module#ConsultasModule' },
      { path: 'comisiones', loadChildren:'./comisiones/comisiones.module#ComisionesModule' },
      { path: 'asistencias', loadChildren:'./asistencias/asistencias.module#AsistenciasModule' },
      { path: 'examenes', loadChildren:'./examenes/examenes.module#ExamenesModule' },
      { path: 'mesas', loadChildren:'./mesas/mesas.module#MesasModule' },
      { path: 'estadisticas', loadChildren:'./estadisticas/estadisticas.module#EstadisticasModule' },
      { path: 'pages', loadChildren:'./pages/pages.module#PagesModule' },
      { path: 'docentes', loadChildren:'./docentes/docentes.module#DocentesModule' },
      { path: 'base', loadChildren:'./views/base/base.module#BaseModule' },
      
      /*
      { path: 'establecimientos', loadChildren: () => import('./establecimientos/establecimientos.module').then(m => m.EstablecimientosModule) },
      { path: 'academicos', loadChildren: () => import('./academicos/academicos.module').then(m => m.AcademicosModule) },
      { path: 'notificaciones', loadChildren: () => import('./notificaciones/notificaciones.module').then(m => m.NotificacionesModule) },
      { path: 'cuentacorriente', loadChildren: () => import('./cuentacorriente/cuentacorriente.module').then(m => m.CuentacorrienteModule) },
      { path: 'movimientos', loadChildren: () => import('./movimientos/movimientos.module').then(m => m.MovimientosModule) },
      { path: 'tipos_movimiento', loadChildren: () => import('./tipos-movimiento/tipos-movimiento.module').then(m => m.TiposMovimientoModule) },
      { path: 'consultas', loadChildren: () => import('./consultas/consultas.module').then(m => m.ConsultasModule) },
      { path: 'comisiones', loadChildren: () => import('./comisiones/comisiones.module').then(m => m.ComisionesModule) },
      { path: 'asistencias', loadChildren: () => import('./asistencias/asistencias.module').then(m => m.AsistenciasModule) },
      { path: 'examenes', loadChildren: () => import('./examenes/examenes.module').then(m => m.ExamenesModule) },
      { path: 'mesas', loadChildren: () => import('./mesas/mesas.module').then(m => m.MesasModule) },
      { path: 'estadisticas', loadChildren: () => import('./estadisticas/estadisticas.module').then(m => m.EstadisticasModule) },
      { path: 'pages', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
      { path: 'docentes', loadChildren: () => import('./docentes/docentes.module').then(m => m.DocentesModule) },

      { path: 'base', loadChildren: () => import('./views/base/base.module').then(m => m.BaseModule) },
      */
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
      /*
      {
        path: 'buttons',
        loadChildren: './views/buttons/buttons.module#ButtonsModule'
      },
      {
        path: 'charts',
        loadChildren: './views/chartjs/chartjs.module#ChartJSModule'
      },
      
      {
        path: 'icons',
        loadChildren: './views/icons/icons.module#IconsModule'
      },
      {
        path: 'notifications',
        loadChildren: './views/notifications/notifications.module#NotificationsModule'
      },
      {
        path: 'theme',
        loadChildren: './views/theme/theme.module#ThemeModule'
      },
      {
        path: 'widgets',
        loadChildren: './views/widgets/widgets.module#WidgetsModule'
      }
      */
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
