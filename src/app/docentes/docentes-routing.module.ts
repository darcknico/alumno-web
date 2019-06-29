import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoDocenteComponent } from './listado-docente/listado-docente.component';
import { DocenteEditarComponent } from './docente-editar/docente-editar.component';

const routes: Routes = [
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
        ]
      },
    ]
  },
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocentesRoutingModule { }
