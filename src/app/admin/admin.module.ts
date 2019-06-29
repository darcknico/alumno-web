import { NgModule } from '@angular/core';
import { UsuarioComponent } from './usuario/usuario.component';
import { routing } from './admin-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { UsuarioEditarComponent } from './usuario-editar/usuario-editar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';

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
  UsuarioEditarComponent],
})
export class AdminModule { }
