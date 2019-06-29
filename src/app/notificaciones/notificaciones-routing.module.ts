import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlantillaComponent } from './plantilla/plantilla.component';
import { PlantillaEditarComponent } from './plantilla-editar/plantilla-editar.component';
import { NotificacionComponent } from './notificacion/notificacion.component';
import { NotificacionEditarComponent } from './notificacion-editar/notificacion-editar.component';
import { NotificacionVerComponent } from './notificacion-ver/notificacion-ver.component';

const routes: Routes = [{
  path: 'plantillas',
  data: {
    title: 'Plantillas'
  },
  children: [
    {
      path: '',
      component: PlantillaComponent,
    },{
      path: 'nuevo',
      component: PlantillaEditarComponent,
      data: {
          title: 'Nueva Plantilla'
      }
    },{
      path: ':id_plantilla/editar',
      component: PlantillaEditarComponent,
      data: {
        title: 'Editar Plantilla'
      }
    },
  ],
},{
  path: 'notificaciones',
  data: {
    title: 'Notificaciones'
  },
  children: [
    {
      path: '',
      component: NotificacionComponent,
    },{
      path: 'nuevo',
      component: NotificacionEditarComponent,
      data: {
          title: 'Preparar Notificacion'
      }
    },{
      path: ':id_notificacion/editar',
      component: NotificacionEditarComponent,
      data: {
        title: 'Editar Notificacion'
      }
    },{
      path: ':id_notificacion/ver',
      component: NotificacionVerComponent,
      data: {
        title: 'Notificacion Desplegada'
      }
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificacionesRoutingModule { }
