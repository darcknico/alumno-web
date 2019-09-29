import { Component, OnInit, Input } from '@angular/core';
import { Comision, ComisionHorario } from '../../../_models/comision';
import { ComisionHorarioService, FiltroComisionHorario } from '../../../_services/comision_horario.service';
import { ComisionHorarioEditarModalComponent } from '../comision-horario-editar-modal/comision-horario-editar-modal.component';
import { DialogConfirmComponent } from '../../../_generic/dialog-confirm/dialog-confirm.component';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listado-comision-horario-component',
  templateUrl: './listado-comision-horario.component.html',
  styleUrls: ['./listado-comision-horario.component.scss']
})
export class ListadoComisionHorarioComponent implements OnInit {
  @Input('comision') comision:Comision=null;
  dtOptions: DataTables.Settings = {};
  dataSource:ComisionHorario[];
  constructor(
    private service:ComisionHorarioService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    ) {

  }
  ngOnInit() {
    
    this.refrescar();
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      ordering:false,
      searching: false,
      paging:false,
      info:false,
    };
  }

  nuevo(){
    const modal = this.modalService.show(ComisionHorarioEditarModalComponent,{class: 'modal-success'});
    (<ComisionHorarioEditarModalComponent>modal.content).onShow(this.comision.id);
    (<ComisionHorarioEditarModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  editar(item:ComisionHorario){
    const modal = this.modalService.show(ComisionHorarioEditarModalComponent,{class: 'modal-info'});
    (<ComisionHorarioEditarModalComponent>modal.content).onShow(this.comision.id,item);
    (<ComisionHorarioEditarModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  eliminar(item:ComisionHorario){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar Horario","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.service.delete(item.id).subscribe(response=>{
          this.toastr.success('Horario Eliminado', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(){
    let filtro=<FiltroComisionHorario>{};
    filtro.id_comision = this.comision.id;
    this.dataSource = null;
    this.service.getAll(filtro).subscribe(response=>{
      this.dataSource = response;
      this.dataSource.forEach(item=>{
        let hora_inicial = item.hora_inicial.split(':');
        item.hora_inicial = hora_inicial[0]+":"+hora_inicial[1];
        let hora_final = item.hora_final.split(':');
        item.hora_final = hora_final[0]+":"+hora_final[1];
        return item;
      });
    });
  }
}
