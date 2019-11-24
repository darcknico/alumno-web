import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { UsuarioComponent } from './usuario/usuario.component';
import { UsuarioEditarComponent } from './usuario-editar/usuario-editar.component';
import { NovedadComponent } from './novedad/novedad.component';
import { DocumentoComponent } from './documento/documento.component';
import { DocumentoEditarComponent } from './documento-editar/documento-editar.component';
import { NovedadEditarComponent } from './novedad-editar/novedad-editar.component';
import { ListadoDispositivoComponent } from './listado-dispositivo/listado-dispositivo.component';
import { ListadoAsistenciaComponent } from './listado-asistencia/listado-asistencia.component';


const routes: Routes = [
  {
    path: 'usuarios',
    data: {
      title: 'Usuarios'
    },
    children: [
      {
        path: '',
        component: UsuarioComponent,
        data: {
          title: 'Listado'
        }
      },
      {
        path: 'nuevo',
        component: UsuarioEditarComponent,
        data: {
          title: 'Nuevo Usuario'
        }
      },{
        path: ':id_usuario/editar',
        component: UsuarioEditarComponent,
        data: {
          title: 'Editar Usuario'
        }
      },
    ]
  },{
    path: 'novedades',
    data: {
      title: 'Novedades'
    },
    children: [
      {
        path: '',
        component: NovedadComponent,
        data: {
          title: 'Listado'
        }
      },
      {
        path: ':id_novedad_sistema/editar',
        component: NovedadEditarComponent,
        data: {
          title: 'Editar Novedad'
        }
      },
    ]
  },{
    path: 'documentos',
    data: {
      title: 'Documento'
    },
    children: [
      {
        path: '',
        component: DocumentoComponent,
        data: {
          title: 'Listado'
        }
      },
      {
        path: ':id_documento/editar',
        component: DocumentoEditarComponent,
        data: {
          title: 'Editar Documento'
        }
      },
    ]
  },{
    path: 'dispositivos',
    data: {
      title: 'Dispositivos'
    },
    children: [
      {
        path: '',
        component: ListadoDispositivoComponent,
        data: {
          title: 'Listado'
        }
      },
    ]
  },{
    path: 'asistencias',
    data: {
      title: 'Asistencias'
    },
    children: [
      {
        path: '',
        component: ListadoAsistenciaComponent,
        data: {
          title: 'Listado'
        }
      },
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
