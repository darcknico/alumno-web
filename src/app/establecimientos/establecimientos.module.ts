import { NgModule } from '@angular/core';
import { routing } from './establecimientos-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SedeComponent } from './sede/sede.component';
import { SedeEditarComponent } from './sede-editar/sede-editar.component';
import { DepartamentoComponent } from './departamento/departamento.component';
import { DepartamentoEditarComponent } from './departamento-editar/departamento-editar.component';
import { ModalidadComponent } from './modalidad/modalidad.component';
import { ModalidadEditarComponent } from './modalidad-editar/modalidad-editar.component';
import { BecaComponent } from './beca/beca.component';
import { BecaEditarComponent } from './beca-editar/beca-editar.component';

@NgModule({
  imports: [
    routing,
    DataTablesModule,
    CommonModule ,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
  ],
  declarations: [
    SedeComponent,
    SedeEditarComponent,
    DepartamentoComponent,
    DepartamentoEditarComponent,
    ModalidadComponent,
    ModalidadEditarComponent,
    BecaComponent,
    BecaEditarComponent,
  ],
})
export class EstablecimientosModule { }
