import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificacionesRoutingModule } from './notificaciones-routing.module';
import { PlantillaComponent } from './plantilla/plantilla.component';
import { PlantillaEditarComponent } from './plantilla-editar/plantilla-editar.component';
import { NotificacionComponent } from './notificacion/notificacion.component';
import { NotificacionEditarComponent } from './notificacion-editar/notificacion-editar.component';
import { NotificacionVerComponent } from './notificacion-ver/notificacion-ver.component';
import { PlantillaService } from '../_services/plantilla.service';
import { NotificacionService } from '../_services/notificacion.service';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, TimepickerModule, BsDatepickerModule } from 'ngx-bootstrap';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    NotificacionesRoutingModule,
    ReactiveFormsModule,
    BsDropdownModule,
    BsDatepickerModule,
    CKEditorModule,
    TimepickerModule,
    NgSelectModule
  ],
  declarations: [
    PlantillaComponent, 
    PlantillaEditarComponent, 
    NotificacionComponent, 
    NotificacionEditarComponent, 
    NotificacionVerComponent
  ],
  providers:[
    PlantillaService,
    NotificacionService,
  ]
})
export class NotificacionesModule { }
