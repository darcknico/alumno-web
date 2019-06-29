import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamenesRoutingModule } from './examenes-routing.module';
import { ExamenVerComponent } from './examen-ver/examen-ver.component';
import { ExamenDetalleComponent } from './componentes/examen-detalle/examen-detalle.component';
import { ListadoExamenComponent } from './listado-examen/listado-examen.component';
import { ExamenAlumnoEditarModalComponent } from './componentes/examen-alumno-editar-modal/examen-alumno-editar-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { BsDropdownModule, CollapseModule, TooltipModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [ExamenVerComponent, ExamenDetalleComponent, ListadoExamenComponent],
  imports: [
    CommonModule,
    ExamenesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    BsDropdownModule,
    NgSelectModule,
    CollapseModule,
    TooltipModule.forRoot(),
  ],
})
export class ExamenesModule { }
