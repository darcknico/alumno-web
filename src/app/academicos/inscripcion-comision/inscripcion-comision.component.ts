import { Component, OnInit } from '@angular/core';
import { ComisionAlumno } from '../../_models/comision';
import { Inscripcion } from '../../_models/inscripcion';
import { InscripcionService } from '../../_services/inscripcion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { InscripcionAsistenciaModalComponent } from '../componentes/inscripcion-asistencia-modal/inscripcion-asistencia-modal.component';
import { InscripcionExamenModalComponent } from '../componentes/inscripcion-examen-modal/inscripcion-examen-modal.component';

@Component({
  selector: 'app-inscripcion-comision',
  templateUrl: './inscripcion-comision.component.html',
  styleUrls: ['./inscripcion-comision.component.scss']
})
export class InscripcionComisionComponent implements OnInit {
  id_sede:number;
  inscripcion:Inscripcion;

  dtOptions: DataTables.Settings = {};
  dataSource:ComisionAlumno[];

  constructor(
    private inscripcionService:InscripcionService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    ) {
  }

  ngOnInit() {
    this.id_sede = +localStorage.getItem('id_sede');
    this.inscripcionService.sede(this.id_sede);
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      paging:false,
      searching:false,
      lengthChange:false,
      info:false,
      ordering:false,
    };
    this.route.params.subscribe(query=>{
      let ids = query['id_inscripcion'];
      if(ids){
        this.inscripcionService.getById(ids).subscribe(response=>{
          this.inscripcion = response;
        });
        this.inscripcionService.comisiones(ids).subscribe(response=>{
          this.dataSource = response;
        })
      }
    });
  }

  nuevo(){
    this.router.navigate(['/comisiones/carreras/'+this.inscripcion.id_carrera],{
      queryParams:{
        id_inscripcion:this.inscripcion.id,
      }
    });
  }

  volver(){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/ver']);
  }

  asistencias(){
    const modal = this.modalService.show(InscripcionAsistenciaModalComponent,{class: 'modal-primary modal-lg'});
    (<InscripcionAsistenciaModalComponent>modal.content).onShow(this.inscripcion);
  }

  examenes(){
    const modal = this.modalService.show(InscripcionExamenModalComponent,{class: 'modal-primary modal-lg'});
    (<InscripcionExamenModalComponent>modal.content).onShow(this.inscripcion);
  }
}
