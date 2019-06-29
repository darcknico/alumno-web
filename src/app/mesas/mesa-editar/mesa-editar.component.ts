import { Component, OnInit } from '@angular/core';
import { MesaExamen, MesaExamenMateria } from '../../_models/mesa.examen';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MesaExamenService } from '../../_services/mesa_examen.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { CarreraService } from '../../_services/carrera.service';
import { Carrera } from '../../_models/carrera';
import { BsModalService } from 'ngx-bootstrap';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-mesa-editar',
  templateUrl: './mesa-editar.component.html',
  styleUrls: ['./mesa-editar.component.scss']
})
export class MesaEditarComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dataSource:MesaExamenMateria[];
  carreras:Carrera[];

  formulario: FormGroup;
  mesa_examen:MesaExamen;
  fecha_inicio:Date;
  consultando = false;
  constructor(
    private mesaExamenService:MesaExamenService,
    private carreraService:CarreraService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    let hoy = moment();
    this.formulario = this.fb.group({
      fecha_inicio: new FormControl({value: '', disabled: true}),
      fecha_fin: [hoy.toDate(), Validators.required],
      nombre:'',
      numero:'',
    });
    this.f.numero.disable();
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
        this.fecha_inicio = moment(this.mesa_examen.fecha_inicio).toDate();
        this.f.fecha_inicio.setValue(this.fecha_inicio);
        this.f.fecha_fin.setValue(moment(this.mesa_examen.fecha_fin).toDate());
        this.f.nombre.setValue(this.mesa_examen.nombre);
        this.f.numero.setValue(this.mesa_examen.numero);
      });

      this.mesaExamenService.materias(ids).subscribe(response=>{
        this.dataSource = response;
      });
    });
  }

  get f(){
    return this.formulario.controls;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    var item = <MesaExamen>{};
    item.id = this.mesa_examen.id;
    item.fecha_fin = moment(this.f.fecha_fin.value).format('YYYY-MM-DD');
    item.nombre = this.f.nombre.value;

    this.consultando = true;
    this.mesaExamenService.update(item).subscribe(resposne=>{
      this.toastr.success('Mesa de examen editada', '');
      this.volver();
    },err=>{
      this.consultando = false;
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
