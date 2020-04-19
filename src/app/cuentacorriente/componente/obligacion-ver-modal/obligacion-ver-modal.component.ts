import { Component, OnInit } from '@angular/core';
import { ObligacionService } from '../../../_services/obligacion.service';
import { ObligacionPago, Obligacion } from '../../../_models/obligacion';
import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-obligacion-ver-modal',
  templateUrl: './obligacion-ver-modal.component.html',
  styleUrls: ['./obligacion-ver-modal.component.scss']
})
export class ObligacionVerModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  dtOptions: DataTables.Settings = {};
  dataSource:ObligacionPago[];
  item:Obligacion;

  constructor(
    private service:ObligacionService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    public bsModalRef: BsModalRef,
    private router: Router,
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

  onShow(item:Obligacion){
    this.item = item;
    this.service.getById(item.id).subscribe(response=>{
      this.item = response;
      this.dataSource = response.pagos;
    });
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

  estado(item:ObligacionPago):string{
    let color="";
    if(!item.estado){
      color = "#F7BECA";
    }
    return color;
  }

}
