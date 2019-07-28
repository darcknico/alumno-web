import { Component, OnInit } from '@angular/core';
import { MesaExamenMateriaAlumno } from '../../_models/mesa.examen';
import { Inscripcion } from '../../_models/inscripcion';
import { InscripcionService } from '../../_services/inscripcion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { MesaExamenMateriaService } from '../../_services/mesa_examen_materia.service';
import { MesaExamenMateriaAlumnoService } from '../../_services/mesa_examen_materia_alumno.service';
import { AuxiliarFunction } from '../../_helpers/auxiliar.function';

@Component({
  selector: 'app-inscripcion-mesa',
  templateUrl: './inscripcion-mesa.component.html',
  styleUrls: ['./inscripcion-mesa.component.scss']
})
export class InscripcionMesaComponent implements OnInit {
  inscripcion:Inscripcion;

  dtOptions: DataTables.Settings = {};
  dataSource:MesaExamenMateriaAlumno[];

  constructor(
    private inscripcionService:InscripcionService,
    private mesaExamenMateriaService:MesaExamenMateriaService,
    private mesaExamenMateriaAlumnoService:MesaExamenMateriaAlumnoService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      paging:false,
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
        this.inscripcionService.mesas_examenes(ids).subscribe(response=>{
          this.dataSource = response;
        });
      }
    });
  }

  nuevo(){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/mesas/nuevo']);
  }

  alumno_desasociar(item:MesaExamenMateriaAlumno){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Dar de baja la inscripcion en la mesa de examen de la materia \" "+item.mesa_examen_materia.materia.nombre+" \" ","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.mesaExamenMateriaService.alumno_desasociar(item).subscribe(response=>{
          this.toastr.success('Alumno eliminado', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(){
    this.dataSource = null;
    this.inscripcionService.mesas_examenes(this.inscripcion.id).subscribe(response=>{
      this.dataSource = response;
    });
  }

  mesa_examen_materia(item:MesaExamenMateriaAlumno){
    this.router.navigate(['/mesas/materias/'+item.id_mesa_examen_materia+'/editar']);
  }

  descargar(item:MesaExamenMateriaAlumno){
    AuxiliarFunction.descargar(this.toastr,this.mesaExamenMateriaAlumnoService.reporte_constancia(item.id));
  }

  imprimir(item:MesaExamenMateriaAlumno){
    AuxiliarFunction.imprimir(this.toastr,this.mesaExamenMateriaAlumnoService.reporte_constancia(item.id));
  }
}
