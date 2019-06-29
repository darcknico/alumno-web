import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { CarreraComponent } from './carrera/carrera.component';
import { CarreraEditarComponent } from './carrera-editar/carrera-editar.component';
import { CarreraVerComponent } from './carrera-ver/carrera-ver.component';
import { AlumnoComponent } from './alumno/alumno.component';
import { AlumnoEditarComponent } from './alumno-editar/alumno-editar.component';
import { InscripcionComponent } from './inscripcion/inscripcion.component';
import { InscripcionNuevoComponent } from './inscripcion-nuevo/inscripcion-nuevo.component';
import { AlumnoVerComponent } from './alumno-ver/alumno-ver.component';
import { InscripcionVerComponent } from './inscripcion-ver/inscripcion-ver.component';
import { InscripcionComisionComponent } from './inscripcion-comision/inscripcion-comision.component';
import { InscripcionMesaComponent } from './inscripcion-mesa/inscripcion-mesa.component';
import { InscripcionMesaNuevoComponent } from './inscripcion-mesa-nuevo/inscripcion-mesa-nuevo.component';
import { InscripcionPlanNuevoComponent } from './inscripcion-plan-nuevo/inscripcion-plan-nuevo.component';
import { InscripcionEditarComponent } from './inscripcion-editar/inscripcion-editar.component';
import { InscripcionNotaComponent } from './inscripcion-nota/inscripcion-nota.component';
import { AlumnoCuotaGuard } from '../_guards/alumno_cuota.guard';
import { InscripcionCuotaGuard } from '../_guards/inscripcion_cuota.guard';


const routes: Routes = [{
    path: 'carreras',
    data: {
      title: 'Carreras'
    },
    children: [
      {
        path: '',
        component: CarreraComponent,
      },{
        path: 'nuevo',
        component: CarreraEditarComponent,
        data: {
            title: 'Nueva Carrera'
        }
      },{
        path: ':id_carrera/editar',
        component: CarreraEditarComponent,
        data: {
          title: 'Editar Carrera'
        }
      },{
        path: ':id_carrera/ver',
        component: CarreraVerComponent,
        data: {
          title: 'Ver Carrera'
        }
      },
    ],
  },{
    path: 'alumnos',
    data: {
      title: 'Alumnos'
    },
    children: [
      {
        path: '',
        component: AlumnoComponent,
      },{
        path: 'nuevo',
        component: AlumnoEditarComponent,
        data: {
            title: 'Nuevo Alumno'
        }
      },{
        path: ':id_alumno/ver',
      canActivate:[AlumnoCuotaGuard],
      component: AlumnoVerComponent,
        data: {
          title: 'Alumno'
        }
      },{
        path: ':id_alumno/editar',
      canActivate:[AlumnoCuotaGuard],
      component: AlumnoEditarComponent,
        data: {
          title: 'Editar Alumno'
        }
      },
    ],
  },{
    path: 'inscripciones',
    data: {
      title: 'Inscripciones'
    },
    children: [
      {
        path: '',
        component: InscripcionComponent,
      },{
        path: 'nuevo',
        component: InscripcionNuevoComponent,
        data: {
            title: 'Nueva Inscripcion'
        }
      },{
        path: ':id_inscripcion',
        canActivate:[InscripcionCuotaGuard],
        data: {
            title: 'Mas informacion'
        },
        children:[
          {
            path:'',
            component:InscripcionVerComponent,
            data:{
              title:'Mas informacion'
            }
          },{
            path:'ver',
            component:InscripcionVerComponent,
            data:{
              title:'Mas informacion'
            }
          },{
            path:'editar',
            component:InscripcionEditarComponent,
            data:{
              title:'Editar'
            }
          },{
            path:'comisiones',
            component:InscripcionComisionComponent,
            data:{
              title:'Comisiones asociadas a la Inscripcion'
            }
          },{
            path:'mesas',
            component:InscripcionMesaComponent,
            data:{
              title:'Mesas de examenes asociadas a la Inscripcion'
            }
          },{
            path:'mesas/nuevo',
            component:InscripcionMesaNuevoComponent,
            data:{
              title:'Mesas de examenes asociadas a la Inscripcion - Nuevo'
            }
          },{
            path:'planes/nuevo',
            component:InscripcionPlanNuevoComponent,
            data:{
              title:'Planes de pago - Nuevo'
            }
          },{
            path:'notas',
            component:InscripcionNotaComponent,
            data:{
              title:'Notas de examen'
            }
          }
        ]
      }
    ],
  },];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
