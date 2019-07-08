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

@NgModule({
  imports: [
    routing,
    DataTablesModule,
    CommonModule ,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    NgSelectModule,
  ],
  declarations: [
    UsuarioComponent,
    UsuarioEditarComponent,
    NovedadComponent,
    NovedadEditarComponent,
    NovedadNuevoModalComponent,
    DocumentoComponent,
    DocumentoNuevoModalComponent,
    DocumentoEditarComponent
  ],
  entryComponents: [
    NovedadNuevoModalComponent,
    DocumentoNuevoModalComponent,
  ]
})
export class AdminModule { }
