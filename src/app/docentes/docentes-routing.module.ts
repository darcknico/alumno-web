import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoDocenteComponent } from './listado-docente/listado-docente.component';
import { DocenteEditarComponent } from './docente-editar/docente-editar.component';
import { ListadoDocenteMateriaComponent } from './listado-docente-materia/listado-docente-materia.component';
import { DocenteVerComponent } from './docente-ver/docente-ver.component';
import { ListadoDocenteEstadoComponent } from './listado-docente-estado/listado-docente-estado.component';

const routes: Routes = [
  {
    path:'asignaciones',
    data:{
      title:'Asignaciones',
    },
    component:ListadoDocenteMateriaComponent,
  },
  {
    path:'estados',
    data:{
      title:'Estados',
    },
    component:ListadoDocenteEstadoComponent,
  },
  {
    path:'',
    data:{
      title:'Docentes',
    },
    children:[
      {
        path:'',
        component:ListadoDocenteComponent,
        data:{
          title:'Listado',
        }
      },
      {
        path:'listado',
        component:ListadoDocenteComponent,
        data:{
          title:'Listado',
        }
      },
      {
        path:'nuevo',
        component:DocenteEditarComponent,
        data:{
          title:'Nuevo',
        }
      },
      {
        path:':id',
        children:[
          {
            path:'editar',
            component:DocenteEditarComponent,
            data:{
              title:'Editar',
            }
          },
          {
            path:'ver',
            component:DocenteVerComponent,
            data:{
              title:'Ver',
            }
          },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocentesRoutingModule { }
