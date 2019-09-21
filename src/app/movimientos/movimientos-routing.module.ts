import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoMovimientoComponent } from './listado-movimiento/listado-movimiento.component';
import { ListadoDiariaComponent } from './listado-diaria/listado-diaria.component';
import { DiariaComponent } from './diaria/diaria.component';
import { MovimientoComponent } from './movimiento/movimiento.component';
import { DiariaNuevoComponent } from './diaria-nuevo/diaria-nuevo.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';

const routes: Routes = [
{
  path:'estadisticas',
  component:EstadisticasComponent,
  data:{
    title:'Estadisticas'
  }
},
{
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
      path:'',
      component:ListadoDiariaComponent,
      data:{
        title:'Listado de diarias'
      },
    },{
      path:'listado',
      component:ListadoDiariaComponent,
      data:{
        title:'Listado de diarias'
      },
    },{
      path:'nuevo',
      component:DiariaNuevoComponent,
      data:{
        title:'Cerrar diaria',
      },
    },{
      path:':id_diaria/ver',
      component:DiariaComponent,
      data:{
        title:'Diaria'
      },
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientosRoutingModule { }
