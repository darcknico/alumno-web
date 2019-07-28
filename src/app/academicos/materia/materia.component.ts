import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PlanEstudio } from '../../_models/plan_estudio';
import { Materia } from '../../_models/materia';
import { MateriaService } from '../../_services/materia.service';
import { MateriaEditarComponent } from '../materia-editar/materia-editar.component';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { MateriaCorrelativaModalComponent } from '../../modals/materia-correlativa-modal/materia-correlativa-modal.component';
import { ListadoComisionModalComponent } from '../listado-comision-modal/listado-comision-modal.component';

@Component({
  selector: 'app-carrera-materia',
  templateUrl: './materia.component.html',
  styleUrls: ['./materia.component.scss']
})
export class MateriaComponent implements OnInit {
  @Output() planEstudioModificado = new EventEmitter();
  @Input() planEstudio:PlanEstudio;
  dtOptions: DataTables.Settings = {};
  dataSource:Materia[];

  constructor(
    private materiaService:MateriaService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    ) {

  }
  ngOnInit() {
    this.materiaService.planEstudio(this.planEstudio.id).subscribe(response=>{
      this.dataSource = response;
    });
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs: [ {
        targets: [6],
        orderable: false,
        width:"7%",
        } ]
    };
  }

  nuevo(){
    const modal = this.modalService.show(MateriaEditarComponent,{class:'modal-lg modal-success'});
    (<MateriaEditarComponent>modal.content).onShow(this.planEstudio);
    (<MateriaEditarComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
        this.planEstudioModificado.emit(true);
      }
    });
  }

  comisiones(item:Materia){
    const modal = this.modalService.show(ListadoComisionModalComponent,{class:'modal-lg modal-info'});
    (<ListadoComisionModalComponent>modal.content).onShow(item);
    (<ListadoComisionModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        
      }
    });
  }

  correlatividades(item:Materia){
    const modal = this.modalService.show(MateriaCorrelativaModalComponent);
    (<MateriaCorrelativaModalComponent>modal.content).onShow(this.planEstudio,item.id);
    (<MateriaCorrelativaModalComponent>modal.content).onClose.subscribe(result => {
        this.refrescar();
    });
  }

  editar(item:Materia){
    const modal = this.modalService.show(MateriaEditarComponent);
    (<MateriaEditarComponent>modal.content).onShow(this.planEstudio,item.id);
    (<MateriaEditarComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
        this.planEstudioModificado.emit(true);
      }
    });
  }

  eliminar(item:Materia){
    const modal = this.modalService.show(DialogConfirmComponent);
    (<DialogConfirmComponent>modal.content).onShow("Eliminar materia","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.materiaService.delete(item.id).subscribe(response=>{
          this.toastr.success('Materia Eliminada', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(){
    this.dataSource = null;
    this.materiaService.planEstudio(this.planEstudio.id).subscribe(response=>{
      this.dataSource = response;
    });
  }
}
