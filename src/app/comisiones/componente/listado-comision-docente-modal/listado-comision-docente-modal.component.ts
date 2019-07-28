import { Component, OnInit } from '@angular/core';
import { Comision, ComisionDocente } from '../../../_models/comision';
import { ComisionService } from '../../../_services/comision.service';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listado-comision-docente-modal',
  templateUrl: './listado-comision-docente-modal.component.html',
  styleUrls: ['./listado-comision-docente-modal.component.scss']
})
export class ListadoComisionDocenteModalComponent implements OnInit {

  comision:Comision;
  dataSource:ComisionDocente[];
  dtOptions: DataTables.Settings = {};

  public onClose: Subject<boolean>;

  constructor(
    private service:ComisionService,
    public bsModalRef: BsModalRef,
    private router: Router,
    private toastr: ToastrService,
    ) { 
  }

  ngOnInit() {
    this.onClose = new Subject();

    this.dtOptions = {
      order: [[ 0, "desc" ]],
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      searching:false,
      pagingType: 'full_numbers',
      pageLength: 10,
      columns: [
        { 
          data: 'created_at',
          width: '5%', 
        },
        { 
          data: 'id_usuario',
        }, 
        { 
          data: 'id_comision',
        }, 
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
      responsive:true,
    };
  }


  onShow(item:Comision){
    this.comision = item;
    this.service.docentes(item.id).subscribe(response=>{
      this.dataSource = null;
      this.dataSource = response;
    });
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
