import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoMesaComponent } from './listado-mesa/listado-mesa.component';
import { MesaNuevoComponent } from './mesa-nuevo/mesa-nuevo.component';
import { MesaEditarComponent } from './mesa-editar/mesa-editar.component';
import { ListadoMateriaComponent } from './listado-materia/listado-materia.component';
import { ListadoMesaMateriaComponent } from './listado-mesa-materia/listado-mesa-materia.component';
import { MesaMateriaEditarComponent } from './mesa-materia-editar/mesa-materia-editar.component';
import { MesaMateriaAlumnoVerComponent } from './mesa-materia-alumno-ver/mesa-materia-alumno-ver.component';
import { MesaVerComponent } from './mesa-ver/mesa-ver.component';

const routes: Routes = [
  {
    path:'',
    data:{
      title:'Mesas de examen'
    },
    children:[
      {
        path:'',
        component:ListadoMesaComponent,
        data:{
          title:'Listado'
        }
      },{
        path:'nuevo',
        component:MesaNuevoComponent,
        data:{
          title:'Mesa - nuevo'
        }
      },{
        path:':id_mesa_examen/editar',
        component:MesaEditarComponent,
        data:{
          title:'Editar',
        },
      },{
        path:':id_mesa_examen/ver',
        component:MesaVerComponent,
        data:{
          title:'Ver',
        },
      },{
        path:':id_mesa_examen/materias/disponibles',
        component:ListadoMateriaComponent,
        data:{
          title:'Materias disponibles',
        }
      }
    ]
  },{
    path:'materias',
    data:{
      title:'Mesas de examen - Materias'
    },
    children:[
      {
        path:'',
        component:ListadoMesaMateriaComponent,
        data:{
          title:'Listado'
        }
      },{
        path:':id_mesa_examen_materia/editar',
        component:MesaMateriaEditarComponent,
        data:{
          title:'Editar'
        }
      },{
        path:':id_mesa_examen_materia/ver',
        component:MesaMateriaAlumnoVerComponent,
        data:{
          title:'Ver'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MesasRoutingModule { }
