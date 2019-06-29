import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoExamenComponent } from './listado-examen/listado-examen.component';
import { ExamenVerComponent } from './examen-ver/examen-ver.component';

const routes: Routes = [{
  path:'',
  component:ListadoExamenComponent,
},{
  path:':id_comision_examen',
  children:[
    {
      path:'ver',
      component:ExamenVerComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamenesRoutingModule { }
