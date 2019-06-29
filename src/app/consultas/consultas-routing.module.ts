import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoPagoComponent } from './listado-pago/listado-pago.component';
import { ListadoPlanPagoComponent } from './listado-plan-pago/listado-plan-pago.component';

const routes: Routes = [{
  path:'pagos',
  component:ListadoPagoComponent,
  data:{
    title:'Cobranzas',
  }
},{
  path:'planes_pago',
  component:ListadoPlanPagoComponent,
  data:{
    title:'Planes de Pago',
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultasRoutingModule { }
