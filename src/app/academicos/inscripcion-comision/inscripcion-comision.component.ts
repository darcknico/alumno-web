import { Component, OnInit } from '@angular/core';
import { ComisionAlumno } from '../../_models/comision';
import { Inscripcion } from '../../_models/inscripcion';
import { InscripcionService } from '../../_services/inscripcion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { InscripcionAsistenciaModalComponent } from '../componentes/inscripcion-asistencia-modal/inscripcion-asistencia-modal.component';
import { InscripcionExamenModalComponent } from '../componentes/inscripcion-examen-modal/inscripcion-examen-modal.component';
import dtLanguage from '../../_constants/dtLanguage';
import { ComisionAlumnoService, FiltroComisionAlumno } from '../../_services/comision_alumno.service';

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
  request:FiltroComisionAlumno=<FiltroComisionAlumno>{
    id_inscripcion:0,
  }

  constructor(
    private service:ComisionAlumnoService,
    private inscripcionService:InscripcionService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    ) {
    this.route.params.subscribe(query=>{
      let ids = query['id_inscripcion'];
      let {extras} = this.router.getCurrentNavigation();
      if(extras.state){
        this.inscripcion = extras.state.inscripcion;
        if(this.inscripcion.id != ids){
          this.inscripcion = null;
        }
      }
      if(ids){
        if(!this.inscripcion){
          this.inscripcionService.getById(ids).subscribe(response=>{
            this.inscripcion = response;
          });
        }
        this.request.id_inscripcion = ids;
        this.service.getAll(this.request).subscribe(response=>{
          this.dataSource = response;
        })
      }
    });
  }

  ngOnInit() {
    this.dtOptions = {
      language: dtLanguage,
      searching:false,
      ordering:false,
    };
  }

  nuevo(){
    this.router.navigate(['/comisiones/carreras/'+this.inscripcion.id_carrera],{
      queryParams:{
        id_inscripcion:this.inscripcion.id,
      }
    });
  }
  masivo(){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/comisiones/masivo'],{
      state:{
        inscripcion:this.inscripcion,
      }
    });
  }

  comision(item:ComisionAlumno){
    this.router.navigate(['/comisiones/'+item.id_comision+'/ver']);
  }

  volver(){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/ver'],{
      state:{
        inscripcion:this.inscripcion,
      }
    });
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
