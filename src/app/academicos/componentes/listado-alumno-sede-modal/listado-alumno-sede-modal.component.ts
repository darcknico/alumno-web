import { Component, OnInit } from '@angular/core';
import { AlumnoService } from '../../../_services/alumno.service';
import { AlumnoSede, Alumno } from '../../../_models/alumno';
import { Subject } from 'rxjs/internal/Subject';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-alumno-sede-modal',
  templateUrl: './listado-alumno-sede-modal.component.html',
  styleUrls: ['./listado-alumno-sede-modal.component.scss']
})
export class ListadoAlumnoSedeModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  dtOptions: DataTables.Settings = {};
  dataSource:AlumnoSede[];
  alumno:Alumno;

  constructor(
    private service:AlumnoService,
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

  onShow(alumno:Alumno){
    this.alumno = alumno;
    
    this.service.sedes(this.alumno.id).subscribe(response=>{
      this.dataSource = response;
    });
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

  estado(item:AlumnoSede):string{
    let color="";
    if(!item.estado){
      color = "#F7BECA";
    }
    return color;
  }

}
