import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagoComponent } from './pago/pago.component';

const routes: Routes = [{
  path:'pagos',
  component:PagoComponent,
  data:{
    title:'Proyeccion de Cobranzas',
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadisticasRoutingModule { }
