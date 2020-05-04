import { NgModule } from '@angular/core';
import { UsuarioComponent } from './usuario/usuario.component';
import { routing } from './admin-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { UsuarioEditarComponent } from './usuario-editar/usuario-editar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { NovedadComponent } from './novedad/novedad.component';
import { NovedadEditarComponent } from './novedad-editar/novedad-editar.component';
import { NovedadNuevoModalComponent } from './novedad-nuevo-modal/novedad-nuevo-modal.component';
import { DocumentoComponent } from './documento/documento.component';
import { DocumentoNuevoModalComponent } from './documento-nuevo-modal/documento-nuevo-modal.component';
import { DocumentoEditarComponent } from './documento-editar/documento-editar.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ListadoDispositivoComponent } from './listado-dispositivo/listado-dispositivo.component';
import { ListadoAsistenciaComponent } from './listado-asistencia/listado-asistencia.component';
import { PasswordModalComponent } from './componentes/password-modal/password-modal.component';
import { ListadoUsuarioDispositivoAjaxComponent } from './componentes/listado-usuario-dispositivo-ajax/listado-usuario-dispositivo-ajax.component';
import { ListadoAlumnoDispositivoAjaxComponent } from './componentes/listado-alumno-dispositivo-ajax/listado-alumno-dispositivo-ajax.component';

@NgModule({
  imports: [
    routing,
    DataTablesModule,
    CommonModule ,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    NgSelectModule,
    ModalModule.forRoot(),
    CKEditorModule,
  ],
  declarations: [
    UsuarioComponent,
    UsuarioEditarComponent,
    NovedadComponent,
    NovedadEditarComponent,
    NovedadNuevoModalComponent,
    DocumentoComponent,
    DocumentoNuevoModalComponent,
    DocumentoEditarComponent,
    ListadoDispositivoComponent,
    ListadoAsistenciaComponent,
    PasswordModalComponent,
    ListadoUsuarioDispositivoAjaxComponent,
    ListadoAlumnoDispositivoAjaxComponent,
  ],
  entryComponents: [
    NovedadNuevoModalComponent,
    DocumentoNuevoModalComponent,
    PasswordModalComponent,
  ]
})
export class AdminModule { }
