import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { MesaExamen, MesaExamenMateria } from '../../_models/mesa.examen';
import { MesaExamenService } from '../../_services/mesa_examen.service';
import { BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Carrera } from '../../_models/carrera';
import { CarreraService } from '../../_services/carrera.service';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-mesa-ver',
  templateUrl: './mesa-ver.component.html',
  styleUrls: ['./mesa-ver.component.scss']
})
export class MesaVerComponent implements OnInit {
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;

  fecha_inicio:Date;

  dtOptions: any = {};
  dataSource:MesaExamenMateria[];
  carreras:Carrera[];
  
  mesa_examen:MesaExamen;
  consultando = false;

  constructor(
    private mesaExamenService:MesaExamenService,
    private carreraService:CarreraService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.mesaExamenService.sede(id_sede);

    this.carreraService.getAll().subscribe(response=>{
      this.carreras = response;
      let item = <Carrera>{};
      item.id = 0;
      item.nombre = "TODOS";
      this.carreras.push(item);
      this.carreras = this.carreras.reverse();
    });

    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs: [ {
        targets:'option',
        orderable: false,
        width:"7%",
        } ]
    };
    
    this.route.params.subscribe(params=>{
      let ids = params['id_mesa_examen'];
      this.mesaExamenService.getById(ids).subscribe(response=>{
        this.mesa_examen = response;
      });
      
      this.mesaExamenService.materias(ids).subscribe(response=>{
        this.dataSource = response;
      });
    });
  }

  asociar_materia(){
    this.router.navigate(['/mesas/'+this.mesa_examen.id+'/materias/disponibles']);
  }

  ver(mesa:MesaExamenMateria){
    this.router.navigate(['/mesas/materias/'+mesa.id+'/editar']);
  }

  desasociar_materia(mesa:MesaExamenMateria){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Dar de baja la mesa de examen","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        var item = <MesaExamenMateria>{};
        item.id_mesa_examen = this.mesa_examen.id;
        item.id_materia = mesa.id_materia;
        this.mesaExamenService.materia_desasociar(item).subscribe(response=>{
          this.toastr.success('Mesa de examen dado de baja', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(){
    this.dataSource = null;
    this.mesaExamenService.materias(this.mesa_examen.id).subscribe(response=>{
      this.dataSource = response;
    });
  }

  seleccionar_carrera(event){
    this.dataSource = null;
    this.mesaExamenService.materias(this.mesa_examen.id,event.id).subscribe(response=>{
      this.dataSource = response;
    });
  }

  volver(){
    this.router.navigate(['/mesas']);
  }

}
