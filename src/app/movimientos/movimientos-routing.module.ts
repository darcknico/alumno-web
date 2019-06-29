import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoMovimientoComponent } from './listado-movimiento/listado-movimiento.component';
import { ListadoDiariaComponent } from './listado-diaria/listado-diaria.component';
import { DiariaComponent } from './diaria/diaria.component';
import { MovimientoComponent } from './movimiento/movimiento.component';

const routes: Routes = [{
  path:'listado',
  component:ListadoMovimientoComponent,
  data:{
    title:'Listado de movimientos'
  }
},{
  path:'nuevo',
  component:MovimientoComponent,
  data:{
    title:'Agregar movimientos'
  }
},{
  path:'diarias',
  children:[
    {
      path:'listado',
      component:ListadoDiariaComponent,
      data:{
        title:'Listado de diarias'
      },
    },{
      path:':id_diaria/ver',
      component:DiariaComponent,
      data:{
        title:'Diaria'
      },
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientosRoutingModule { }
