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
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { PlantillaNuevaModalComponent } from './plantilla-nueva-modal/plantilla-nueva-modal.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ModalModule } from 'ngx-bootstrap/modal';

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
    NgSelectModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    PlantillaComponent, 
    PlantillaEditarComponent, 
    NotificacionComponent, 
    NotificacionEditarComponent, 
    NotificacionVerComponent, 
    PlantillaNuevaModalComponent,
  ],
  providers:[
    PlantillaService,
    NotificacionService,
  ],
  entryComponents:[
    PlantillaNuevaModalComponent,
  ]
})
export class NotificacionesModule { }
