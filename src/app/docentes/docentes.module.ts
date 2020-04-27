import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocentesRoutingModule } from './docentes-routing.module';
import { ListadoDocenteComponent } from './listado-docente/listado-docente.component';
import { DocenteEditarComponent } from './docente-editar/docente-editar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { MateriaEditarModalComponent } from './materia-editar-modal/materia-editar-modal.component';
import { ListadoDocenteMateriaComponent } from './listado-docente-materia/listado-docente-materia.component';
import { DocenteVerComponent } from './docente-ver/docente-ver.component';
import { ListadoComisionesComponent } from './componentes/listado-comisiones/listado-comisiones.component';
import { ListadoMesaExamenComponent } from './componentes/listado-mesa-examen/listado-mesa-examen.component';
import { DocenteDetalleComponent } from './componentes/docente-detalle/docente-detalle.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { EstadoEditarModalComponent } from './estado-editar-modal/estado-editar-modal.component';
import { ListadoDocenteEstadoComponent } from './listado-docente-estado/listado-docente-estado.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ListadoEstadoComponent } from './componentes/listado-estado/listado-estado.component';
import { ngfModule } from "angular-file";

@NgModule({
  declarations: [
    ListadoDocenteComponent, 
    DocenteEditarComponent, 
    MateriaEditarModalComponent,
    ListadoDocenteMateriaComponent,
    DocenteVerComponent,
    ListadoComisionesComponent,
    ListadoMesaExamenComponent,
    DocenteDetalleComponent,
    EstadoEditarModalComponent,
    ListadoDocenteEstadoComponent,
    ListadoEstadoComponent,
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
    CollapseModule,
    BsDropdownModule,
    ngfModule,
  ],
  entryComponents: [
    MateriaEditarModalComponent,
    EstadoEditarModalComponent,
  ]
})
export class DocentesModule { }
