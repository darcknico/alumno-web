import { Component, OnInit } from '@angular/core';
import { Examen } from '../../_models/examen';
import { ExamenService } from '../../_services/examen.service';
import { Comision } from '../../_models/comision';
import { ComisionService } from '../../_services/comision.service';
import { BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { ComisionExamenColors } from '../../_helpers/colors';
import * as moment from 'moment';
import { CalendarEvent } from 'calendar-utils';

@Component({
  selector: 'app-listado-examen',
  templateUrl: './listado-examen.component.html',
  styleUrls: ['./listado-examen.component.scss']
})
export class ListadoExamenComponent implements OnInit {

  events: CalendarEvent[] = [];
  
  comision:Comision;

  dtOptions: DataTables.Settings = {};
  dataSource:Examen[];
  constructor(
    private comisionService:ComisionService,
    private examenService:ExamenService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.dtOptions = {
      order:[[0,'desc']],
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      searching:false,
      columnDefs: [ {
        targets: [4],
        orderable: false,
        width:"7%",
        },{
        targets: [3],
        orderable: false,
      }, ]
    };

    this.route.params.subscribe(params=>{
      let ids = params['id_comision'];
      this.comisionService.getById(ids).subscribe(response=>{
        this.comision = response;
      });
      this.comisionService.examenes(ids).subscribe(response=>{
        this.dataSource = response;
        this.events = [];
        this.dataSource.forEach(examen=>{
          let color = ComisionExamenColors.parcial;
          if(examen.id_tipo_examen == 2){
            color = ComisionExamenColors.recuperatorio;
          } else if (examen.id_tipo_examen == 3){
            color = ComisionExamenColors.practico;
          }
          this.events.push({
            title:examen.nombre,
            start:moment(examen.fecha).toDate(),
            allDay:true,
            color:color,
          });
        });
      });
    });
  }

  refrescar(){
    this.comisionService.getById(this.comision.id).subscribe(response=>{
      this.comision = response;
    });
    this.comisionService.examenes(this.comision.id).subscribe(response=>{
      this.dataSource = response;
    });
  }

  eliminar(item:Examen){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar examen","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.examenService.delete(item.id).subscribe(response=>{
          this.toastr.success('Examen eliminado', '');
          this.refrescar();
        });
      }
    });
  }

  nuevo(){
    this.router.navigate(['/comisiones/'+this.comision.id+'/examenes/nuevo']);
  }

  volver(){
    this.router.navigate(['/comisiones/'+this.comision.id+'/ver']);
  }

  ver(item:Examen){
    this.router.navigate(['/examenes/'+item.id+'/ver']);
  }

  editar(item:Examen){
    this.router.navigate(['/comisiones/'+this.comision.id+'/examenes/'+item.id+'/editar']);
  }
}
