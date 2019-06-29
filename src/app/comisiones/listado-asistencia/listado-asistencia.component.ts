import { Component, OnInit } from '@angular/core';
import { Asistencia } from '../../_models/asistencia';
import { Comision } from '../../_models/comision';
import { ComisionService } from '../../_services/comision.service';
import { BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AsistenciaService } from '../../_services/asistencia.service';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-listado-asistencia',
  templateUrl: './listado-asistencia.component.html',
  styleUrls: ['./listado-asistencia.component.scss']
})
export class ListadoAsistenciaComponent implements OnInit {

  comision:Comision;

  dtOptions: DataTables.Settings = {};
  dataSource:Asistencia[];
  constructor(
    private comisionService:ComisionService,
    private asistenciaService:AsistenciaService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.comisionService.sede(id_sede);
    this.asistenciaService.sede(id_sede);

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
        width:"7%",
        } ]
    };

    this.route.params.subscribe(params=>{
      let ids = params['id_comision'];
      this.comisionService.getById(ids).subscribe(response=>{
        this.comision = response;
      });
      this.comisionService.asistencias(ids).subscribe(response=>{
        this.dataSource = response;
      });
    });
  }

  refrescar(){
    this.comisionService.getById(this.comision.id).subscribe(response=>{
      this.comision = response;
    });
    this.comisionService.asistencias(this.comision.id).subscribe(response=>{
      this.dataSource = response;
    });
  }

  eliminar(item:Asistencia){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar asistencia","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.asistenciaService.delete(item.id).subscribe(response=>{
          this.toastr.success('Asistencia eliminada', '');
          this.refrescar();
        });
      }
    });
  }

  asistencia_nuevo(){
    this.router.navigate(['/comisiones/'+this.comision.id+'/asistencias/nuevo']);
  }

  volver(){
    this.router.navigate(['/comisiones/'+this.comision.id+'/ver']);
  }

  asistencia(item:Asistencia){
    this.router.navigate(['/asistencias/'+item.id+'/ver']);
  }

}
