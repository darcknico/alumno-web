import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { SedeComponent } from './sede/sede.component';
import { SedeEditarComponent } from './sede-editar/sede-editar.component';
import { DepartamentoComponent } from './departamento/departamento.component';
import { DepartamentoEditarComponent } from './departamento-editar/departamento-editar.component';
import { ModalidadComponent } from './modalidad/modalidad.component';
import { ModalidadEditarComponent } from './modalidad-editar/modalidad-editar.component';
import { BecaComponent } from './beca/beca.component';
import { BecaEditarComponent } from './beca-editar/beca-editar.component';
import { AulaComponent } from './aula/aula.component';


const routes: Routes = [
  {
    path: 'aulas',
    component: AulaComponent,
    data: {
      title: 'Aulas'
    },
  },{
    path: 'sedes',
    component: SedeComponent,
    data: {
      title: 'Sedes'
    },
  },{
    path: 'sedes/nuevo',
    component: SedeEditarComponent,
    data: {
      title: 'Nuevo Sede'
    }
  },{
    path: 'sedes/:id_sede/editar',
    component: SedeEditarComponent,
    data: {
      title: 'Editar Sede'
    }
  },{
    path: 'departamentos',
    component: DepartamentoComponent,
    data: {
      title: 'Sedes'
    },
  },{
    path: 'departamentos/nuevo',
    component: DepartamentoEditarComponent,
    data: {
      title: 'Nuevo Sede'
    }
  },{
    path: 'departamentos/:id_departamento/editar',
    component: DepartamentoEditarComponent,
    data: {
      title: 'Editar Sede'
    }
  },{
    path: 'modalidades',
    children:[
      {
        path: '',
        component: ModalidadComponent,
        data: {
          title: 'Modalidades'
        }
      },{
        path: 'nuevo',
        component: ModalidadEditarComponent,
        data: {
          title: 'Nueva Modalidad'
        }
      },{
        path: ':id_modalidad/editar',
        component: ModalidadEditarComponent,
        data: {
          title: 'Editar Modalidad'
        }
      }
    ]
  },{
    path: 'becas',
    children:[
      {
        path: '',
        component: BecaComponent,
        data: {
          title: 'Becas'
        }
      },{
        path: 'nuevo',
        component: BecaEditarComponent,
        data: {
          title: 'Nueva Beca'
        }
      },{
        path: ':id_beca/editar',
        component: BecaEditarComponent,
        data: {
          title: 'Editar Beca'
        }
      }
    ]
  }];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
