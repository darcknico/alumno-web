import { Component, OnInit } from '@angular/core';
import { InscripcionEstadoService, FiltroInscripcionEstado } from '../../../_services/inscripcion_estado.service';
import { Inscripcion, InscripcionEstado } from '../../../_models/inscripcion';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-listado-inscripcion-estado-modal',
  templateUrl: './listado-inscripcion-estado-modal.component.html',
  styleUrls: ['./listado-inscripcion-estado-modal.component.scss']
})
export class ListadoInscripcionEstadoModalComponent implements OnInit {
  public onClose: Subject<boolean>;
  dtOptions: DataTables.Settings = {};
  dataSource:InscripcionEstado[];
  inscripcion:Inscripcion;
  id_sede:number;

  constructor(
    private service:InscripcionEstadoService,
    public bsModalRef: BsModalRef,
    ) { 
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      paging:false,
      searching:false,
      info:false,
      ordering:false,
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
    };
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  onShow(inscripcion:Inscripcion){
    this.inscripcion = inscripcion;
    
    let filtro = <FiltroInscripcionEstado>{
      id_inscripcion: inscripcion.id,
    }
    this.service.getAll(filtro).subscribe(response=>{
      this.dataSource = response;
    });
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
