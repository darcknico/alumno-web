import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoAsistenciaComponent } from './listado-asistencia/listado-asistencia.component';
import { AsistenciaVerComponent } from './asistencia-ver/asistencia-ver.component';

const routes: Routes = [{
  path:'',
  component:ListadoAsistenciaComponent,
},{
  path:':id_asistencia',
  children:[
    {
      path:'ver',
      component:AsistenciaVerComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsistenciasRoutingModule { }
