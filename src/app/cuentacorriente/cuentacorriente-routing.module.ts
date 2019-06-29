import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanPagoComponent } from './plan-pago/plan-pago.component';
import { ListadoPagoComponent } from './listado-pago/listado-pago.component';
import { PagoComponent } from './pago/pago.component';
import { PagoBonificarComponent } from './pago-bonificar/pago-bonificar.component';
import { PagoMatriculaComponent } from './pago-matricula/pago-matricula.component';
import { ListadoCuotaComponent } from './listado-cuota/listado-cuota.component';
import { ListadoMatriculaComponent } from './listado-matricula/listado-matricula.component';
import { PagoReciboComponent } from './pago-recibo/pago-recibo.component';

const routes: Routes = [{
  path:':id_plan_pago',
  children:[
    {
      path:'ver',
      component:PlanPagoComponent,
      data:{
        title:'Cuenta Corriente',
      }
    },{
      path:'pagos',
      children:[
        {
          path:'',
          component:ListadoPagoComponent,
          data:{
            title:'Listado de pagos'
          }
        },{
          path:'cuotas',
          component:PagoComponent,
          data:{
            title:'Nuevo pago'
          }
        },{
          path:'bonificar',
          component:PagoBonificarComponent,
          data:{
            title:'Nueva bonificacion'
          }
        },{
          path:'matricula',
          component:PagoMatriculaComponent,
          data:{
            title:'Pagar matricula'
          }
        },{
          path:':id_pago/recibo',
          component:PagoReciboComponent,
          data:{
            title:'Recibo de pago'
          }
        },
      ]
    },{
      path:'cuotas',
      component:ListadoCuotaComponent,
      data:{
        title:'Listado de cuotas'
      }
    },{
      path:'matricula',
      component:ListadoMatriculaComponent,
      data:{
        title:'Matricula pagos'
      }
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentacorrienteRoutingModule { }
