import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocentesRoutingModule } from './docentes-routing.module';
import { ListadoDocenteComponent } from './listado-docente/listado-docente.component';
import { DocenteEditarComponent } from './docente-editar/docente-editar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { BsDatepickerModule, TooltipModule, ModalModule } from 'ngx-bootstrap';
import { MateriaEditarModalComponent } from './materia-editar-modal/materia-editar-modal.component';
import { ListadoDocenteMateriaComponent } from './listado-docente-materia/listado-docente-materia.component';

@NgModule({
  declarations: [
    ListadoDocenteComponent, 
    DocenteEditarComponent, 
    MateriaEditarModalComponent,
    ListadoDocenteMateriaComponent
  ],
  imports: [
    CommonModule,
    DocentesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    DataTablesModule,
    BsDatepickerModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
  ],
  entryComponents: [
    MateriaEditarModalComponent,
  ]
})
export class DocentesModule { }
