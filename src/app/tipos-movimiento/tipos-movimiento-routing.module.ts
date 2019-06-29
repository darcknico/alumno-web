import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoTipoMovimientoComponent } from './listado-tipo-movimiento/listado-tipo-movimiento.component';
import { TipoMovimientoEditarComponent } from './tipo-movimiento-editar/tipo-movimiento-editar.component';

const routes: Routes = [{
  path:'listado',
  component:ListadoTipoMovimientoComponent,
  data:{
    title:'Listado de tipos de movmiento'
  }
},{
  path:'nuevo',
  component:TipoMovimientoEditarComponent,
  data:{
    title:'Tipo de movmiento - Nuevo'
  }
},{
  path:':id_tipo_movimiento/editar',
  component:TipoMovimientoEditarComponent,
  data:{
    title:'Tipo de movmiento - Editar'
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiposMovimientoRoutingModule { }
