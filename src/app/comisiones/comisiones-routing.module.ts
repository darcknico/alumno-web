import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoComisionComponent } from './listado-comision/listado-comision.component';
import { ComisionEditarComponent } from './comision-editar/comision-editar.component';
import { ComisionVerComponent } from './comision-ver/comision-ver.component';
import { ListadoAsistenciaComponent } from './listado-asistencia/listado-asistencia.component';
import { ListadoAlumnoDisponibleComponent } from './listado-alumno-disponible/listado-alumno-disponible.component';
import { AsistenciaNuevoComponent } from './asistencia-nuevo/asistencia-nuevo.component';
import { ComisionCarreraComponent } from './comision-carrera/comision-carrera.component';
import { ComisionMateriaComponent } from './comision-materia/comision-materia.component';
import { ExamenNuevoComponent } from './examen-nuevo/examen-nuevo.component';
import { ListadoExamenComponent } from './listado-examen/listado-examen.component';
import { ListadoAlumnoComponent } from './listado-alumno/listado-alumno.component';
import { ListadoHorarioComponent } from './listado-horario/listado-horario.component';
import { ComisionMultipleNuevoComponent } from './comision-multiple-nuevo/comision-multiple-nuevo.component';

const routes: Routes = [
{
  path:'alumnos',
  component:ListadoAlumnoComponent,
  data:{
    title:'Comision por Alumno',
  },
},
{
  path:'horarios',
  component:ListadoHorarioComponent,
  data:{
    title:'Comision por Horario',
  },
},
{
  path:'',
  data:{
    title:'Comisiones',
  },
  children:[
    {
      path:'',
      component:ListadoComisionComponent,
      data:{
        title:'Listado'
      }
    },{
      path:'carreras/:id_carrera',
      component:ComisionCarreraComponent,
      data:{
        title:'Comisiones por carrera'
      }
    },{
      path:'materias/:id_materia',
      component:ComisionMateriaComponent,
      data:{
        title:'Materia',
      },
    },{
      path:'nuevo',
      component:ComisionEditarComponent,
      data:{
        title:'Nuevo',
      },
    },{
      path:'nuevo/masivo',
      component:ComisionMultipleNuevoComponent,
      data:{
        title:'Nuevo',
      },
    },{
      path:':id_comision',
      children:[
        {
          path:'ver',
          component:ComisionVerComponent,
          data:{
            title:'Mas informacion',
          },
        },
        {
          path:'editar',
          component:ComisionEditarComponent,
          data:{
            title:'Editar',
          },
        },
        {
          path:'asistencias',
          component:ListadoAsistenciaComponent,
          data:{
            title:'Asistencias',
          },
        },
        {
          path:'examenes',
          component:ListadoExamenComponent,
          data:{
            title:'Examenes',
          },
        },
        {
          path:'alumnos/disponibles',
          component:ListadoAlumnoDisponibleComponent,
          data:{
            title:'Alumnos - disponibles',
          },
        },
        {
          path:'asistencias/nuevo',
          component:AsistenciaNuevoComponent,
          data:{
            title:'Asistencias - nuevo',
          },
        },
        {
          path:'examenes/nuevo',
          component:ExamenNuevoComponent,
          data:{
            title:'Examen - nuevo',
          },
        },
        {
          path:'examenes/:id_comision_examen/editar',
          component:ExamenNuevoComponent,
          data:{
            title:'Examen - Editar',
          },
        },
      ]
    }
  ]
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComisionesRoutingModule { }
