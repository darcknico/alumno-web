import { Component, OnInit, ViewChild } from '@angular/core';
import { ComisionAlumno } from '../../_models/comision';
import { Subject } from 'rxjs';
import { ComisionAlumnoService } from '../../_services/comision_alumno.service';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ExamenAlumno } from '../../_models/examen';
import { AsistenciaAlumno } from '../../_models/asistencia';
import { AsistenciaAlumnoService, FiltroAsistenciaAlumno } from '../../_services/asistencia_alumno.service';
import { FiltroExamenAlumno, ExamenAlumnoService } from '../../_services/examen_alumno.service';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comision-alumno-ver-modal',
  templateUrl: './comision-alumno-ver-modal.component.html',
  styleUrls: ['./comision-alumno-ver-modal.component.scss']
})
export class ComisionAlumnoVerModalComponent implements OnInit {

  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  asistenciaDataSource:AsistenciaAlumno[]=[];
  examenDataSource:ExamenAlumno[]=[];
  alumno: ComisionAlumno;
  asistenciadtOptions: DataTables.Settings = {};
  examendtOptions: DataTables.Settings = {};

  requestAsistencia = <FiltroAsistenciaAlumno>{
    search:"",
  };
  requestExamen = <FiltroExamenAlumno>{
    search:"",
  };

  public onClose: Subject<boolean>;

  constructor(
    private comisionAlumnoService:ComisionAlumnoService,
    private asistenciaAlumnoService:AsistenciaAlumnoService,
    private examenAlumnoService:ExamenAlumnoService,
    public bsModalRef: BsModalRef,
    private router: Router,
    private toastr: ToastrService,
    ) { 
  }

  ngOnInit() {
    this.onClose = new Subject();

    const that = this;
    this.asistenciadtOptions = {
      order: [[ 0, "desc" ]],
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.requestAsistencia.start = dataTablesParameters.start;
        that.requestAsistencia.length = dataTablesParameters.length;
        that.requestAsistencia.order = dataTablesParameters.order[0].dir;
        that.requestAsistencia.search = dataTablesParameters.search.value;
        that.requestAsistencia.sort = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        this.asistenciaAlumnoService.ajax(that.requestAsistencia).subscribe(resp => {
            that.asistenciaDataSource = resp.items;
            callback({
              recordsTotal: resp.total_count,
              recordsFiltered: resp.total_count,
              data: []
            });
          });
      },
      columns: [
        { 
          data: 'created_at',
          width: '5%', 
        }, 
      ],
      responsive:true,
    };
    this.examendtOptions = {
      order: [[ 0, "desc" ]],
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.requestExamen.start = dataTablesParameters.start;
        that.requestExamen.length = dataTablesParameters.length;
        that.requestExamen.order = dataTablesParameters.order[0].dir;
        that.requestExamen.search = dataTablesParameters.search.value;
        that.requestExamen.sort = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        this.examenAlumnoService.ajax(that.requestExamen).subscribe(resp => {
            that.examenDataSource = resp.items;
            callback({
              recordsTotal: resp.total_count,
              recordsFiltered: resp.total_count,
              data: []
            });
          });
      },
      columns: [
        { 
          data: 'created_at',
          width: '5%', 
        },
        { 
          data: 'id_examen',
          orderable:false,
        },
        { 
          data: 'id_examen',
          orderable:false,
        },
        { 
          data: 'id_examen',
          orderable:false,
        },
        { 
          data: 'id_examen',
          orderable:false,
        },
        { 
          data: 'id_examen',
          orderable:false,
        },
        { 
          data: 'id_examen',
          orderable:false,
        },
      ],
      responsive:true,
    };
  }


  onShow(alumno:ComisionAlumno){
    this.alumno = alumno;
    this.requestAsistencia.id_comision = alumno.id_comision;
    this.requestAsistencia.id_alumno = alumno.id_alumno;
    this.requestExamen.id_comision = alumno.id_comision;
    this.requestExamen.id_alumno = alumno.id_alumno;
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

  asistencia_ver(item:AsistenciaAlumno){
    this.router.navigate(['/asistencias/'+item.id_asistencia+'/ver']).then(response=>{
      this.cancelar();
    });
  }

  examen_ver(item:ExamenAlumno){
    this.router.navigate(['/examenes/'+item.id_comision_examen+'/ver']).then(response=>{
      this.cancelar();
    });
  }
}
