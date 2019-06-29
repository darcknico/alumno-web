import { Component, OnInit } from '@angular/core';
import { ComisionService } from '../../_services/comision.service';
import { CarreraService } from '../../_services/carrera.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Comision, ComisionAlumno } from '../../_models/comision';
import { Carrera } from '../../_models/carrera';
import { BsModalService } from 'ngx-bootstrap';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { InscripcionService } from '../../_services/inscripcion.service';
import { Inscripcion } from '../../_models/inscripcion';

@Component({
  selector: 'app-comision-carrera',
  templateUrl: './comision-carrera.component.html',
  styleUrls: ['./comision-carrera.component.scss']
})
export class ComisionCarreraComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dataSource: Comision[];
  
  carrera:Carrera;
  inscripcion:Inscripcion;

  constructor(
    private comisionService:ComisionService,
    private inscripcionService:InscripcionService,
    private carreraService:CarreraService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.comisionService.sede(id_sede);
    this.inscripcionService.sede(id_sede);

    this.dtOptions = {
      order:[[0,'desc']],
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs: [ {
        targets: [4],
        orderable: false,
        } ]
    };

    this.route.params.subscribe(params=>{
      let ids = params['id_carrera'];
      this.carreraService.getById(ids).subscribe(response=>{
        this.carrera = response;
      });
      this.comisionService.carreras(ids).subscribe(response=>{
        this.dataSource = response;
      });
    });

    this.route.queryParams.subscribe(query=>{
      let ids = query['id_inscripcion'];
      if(ids){
        this.inscripcionService.getById(ids).subscribe(response=>{
          this.inscripcion = response;
        });
      }
    });
  }

  asociar_alumno(comision:Comision){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-info'});
    (<DialogConfirmComponent>modal.content).onShow(
      "Inscribir alumno",
      "A la comision numero "+comision.numero+" año "+comision.anio+".¿Desea continuar?");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        let item = <ComisionAlumno>{};
        item.id_comision = comision.id;
        item.id_alumno = this.inscripcion.id_alumno;
        item.id_inscripcion = this.inscripcion.id;
        this.comisionService.alumno_asociar(item).subscribe(response=>{
          this.toastr.success('Inscripcion realizada', '');
          this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/comisiones']);
        });
      }
    });
  }

  ver(item:Comision){
    this.router.navigate(['comisiones',item.id,'ver']);
  }

  nuevo(){
    this.router.navigate(['/comisiones/nuevo'],{
      queryParams:{
        id_carrera:this.carrera.id,
      }
    });
  }

}
