import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { UsuarioComponent } from './usuario/usuario.component';
import { UsuarioEditarComponent } from './usuario-editar/usuario-editar.component';


const routes: Routes = [{
  path: 'usuarios',
  component: UsuarioComponent,
  data: {
    title: 'Usuarios'
  },
  children: [
    {
      path: 'nuevos',
      component: UsuarioEditarComponent,
      data: {
        title: 'Nuevo Usuario'
      }
    },{
      path: ':id_usuario/editars',
      component: UsuarioEditarComponent,
      data: {
        title: 'Editar Usuario'
      }
    },
  ]
},{
  path: 'usuarios/nuevo',
  component: UsuarioEditarComponent,
  data: {
    title: 'Nuevo Usuario'
  }
},{
  path: 'usuarios/:id_usuario/editar',
  component: UsuarioEditarComponent,
  data: {
    title: 'Editar Usuario'
  }
}];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
