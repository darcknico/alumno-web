import { Component, OnInit } from '@angular/core';
import { Notificacion } from '../../_models/notificacion';
import { AlumnoNotificacion } from '../../_models/alumno';
import { NotificacionService } from '../../_services/notificacion.service';
import { PlantillaService } from '../../_services/plantilla.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Plantilla } from '../../_models/plantilla';

@Component({
  selector: 'app-notificacion-ver',
  templateUrl: './notificacion-ver.component.html',
  styleUrls: ['./notificacion-ver.component.scss']
})
export class NotificacionVerComponent implements OnInit {

  id_sede:number;
  notificacion:Notificacion;
  plantilla:Plantilla;

  dataSource:AlumnoNotificacion[];
  dtOptions: DataTables.Settings = {};

  constructor(
    private notificacionService:NotificacionService,
    private plantillaService:PlantillaService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.dtOptions = {
      order: [[ 0, "desc" ]],
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs: [ {
        targets: [3],
        orderable: false
        } ]
    };
  }

  ngOnInit() {
    this.id_sede = +localStorage.getItem('id_sede');
    this.notificacionService.sede(this.id_sede);
    this.plantillaService.sede(this.id_sede);

    this.route.params.subscribe(params=>{
      let id_notificacion = +params['id_notificacion'];
      this.notificacionService.getById(id_notificacion).subscribe(response=>{
        this.notificacion = response;
        this.plantilla = response.plantilla;
      });
    });
  }

  
  /**
   * PREUBA DE CORREO
   */

  ver_plantilla(){
    this.router.navigate(['/notificaciones/plantillas/'+this.plantilla.id+'/editar']);
  }

  previa(){
    var wnd = window.open("about:blank", "", "_blank,width = 600, height = 800");
    this.plantillaService.getById(this.plantilla.id).subscribe(response=>{
      wnd.document.write(response.cuerpo);
    });
  }
}
