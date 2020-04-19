import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './alumnos-routing.module';

import { ListadoAuditoriaComponent } from './listado-auditoria/listado-auditoria.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxCurrencyModule } from 'ngx-currency';
import { DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';

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
