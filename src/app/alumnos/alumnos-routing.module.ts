import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoAuditoriaComponent } from './listado-auditoria/listado-auditoria.component';

const routes: Routes = [
  {
    path:'auditorias',
    component:ListadoAuditoriaComponent,
    data: {
      title: 'Auditoria de Alumnos'
    }
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);