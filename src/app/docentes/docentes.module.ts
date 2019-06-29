import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocentesRoutingModule } from './docentes-routing.module';
import { ListadoDocenteComponent } from './listado-docente/listado-docente.component';
import { DocenteEditarComponent } from './docente-editar/docente-editar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { BsDatepickerModule, TooltipModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [ListadoDocenteComponent, DocenteEditarComponent],
  imports: [
    CommonModule,
    DocentesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    DataTablesModule,
    BsDatepickerModule,
    TooltipModule.forRoot(),
  ]
})
export class DocentesModule { }
