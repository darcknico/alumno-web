import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './alumnos-routing.module';

import { ListadoAuditoriaComponent } from './listado-auditoria/listado-auditoria.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, TypeaheadModule, TooltipModule, BsDatepickerModule, CollapseModule, ModalModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxCurrencyModule } from 'ngx-currency';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [ListadoAuditoriaComponent],
  imports: [
    routing,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    TooltipModule.forRoot(),
    BsDatepickerModule,
    CollapseModule,
    NgSelectModule,
    NgxCurrencyModule,
    ModalModule.forRoot(),
    DataTablesModule,
  ]
})
export class AlumnosModule { }
