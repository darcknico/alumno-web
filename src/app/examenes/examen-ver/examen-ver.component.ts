import { Component, OnInit } from '@angular/core';
import { Examen, ExamenAlumno } from '../../_models/examen';
import { ExamenService } from '../../_services/examen.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamenAlumnoEditarModalComponent } from '../componentes/examen-alumno-editar-modal/examen-alumno-editar-modal.component';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-examen-ver',
  templateUrl: './examen-ver.component.html',
  styleUrls: ['./examen-ver.component.scss']
})
export class ExamenVerComponent implements OnInit {
  examen:Examen;

  dtOptions: DataTables.Settings = {};
  dataSource:ExamenAlumno[];

  constructor(
    private examenService:ExamenService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.examenService.sede(id_sede);


    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      searching:false,
      columnDefs: [ {
        targets: [5,6],
        orderable: false,
        } ]
    };

    this.route.params.subscribe(params=>{
      let ids = params['id_comision_examen'];
      this.examenService.getById(ids).subscribe(response=>{
        this.examen = response;
      });
      this.examenService.alumnos(ids).subscribe(response=>{
        this.dataSource = response;
      });
    });
  }

  editar(item:ExamenAlumno){
    let alumno = item;
    const modal = this.modalService.show(ExamenAlumnoEditarModalComponent,{class: 'modal-primary'});
    (<ExamenAlumnoEditarModalComponent>modal.content).onShow(alumno);
    (<ExamenAlumnoEditarModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.examenService.alumno(alumno).subscribe(response=>{
          this.toastr.success('Examen editado', '');
          this.refrescar();
        });
      }
    });
  }

  volver(){
    this.router.navigate(['/examenes']);
  }

  comision(){
    this.router.navigate(['/comisiones/'+this.examen.id_comision+'/ver']);
  }

  refrescar(){
    this.examenService.alumnos(this.examen.id).subscribe(response=>{
      this.dataSource = response;
    });
  }
}
