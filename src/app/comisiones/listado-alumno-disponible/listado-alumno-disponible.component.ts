
import {forkJoin as observableForkJoin,  Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Comision, ComisionAlumno } from '../../_models/comision';
import { Alumno } from '../../_models/alumno';
import { ComisionService } from '../../_services/comision.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService } from 'ngx-bootstrap';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';


@Component({
  selector: 'app-listado-alumno-disponible',
  templateUrl: './listado-alumno-disponible.component.html',
  styleUrls: ['./listado-alumno-disponible.component.scss']
})
export class ListadoAlumnoDisponibleComponent implements OnInit {
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;

  comision:Comision;
  consultando:boolean=false;
  dtOptions: any = {};
  dataSource:Alumno[];

  constructor(
    private comisionService:ComisionService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.comisionService.sede(id_sede);

    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs: [
        {
          orderable: false,
          data:null,
          className: 'select-checkbox',
          defaultContent: '',
          targets:   0
       },
       {
        targets: [ 1 ],
        visible: false,
        searchable: false,
      },
      ],
      select: {
        info:false,
        style: 'multi',
        selector: 'td:first-child'
      },
    };

    this.route.params.subscribe(params=>{
      let ids = params['id_comision'];
      this.comisionService.getById(ids).subscribe(response=>{
        this.comision = response;
      });
      this.comisionService.alumnos_disponibles(ids).subscribe(response=>{
        this.dataSource = response;
      });
    });
  }

  asociar_alumnos(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      let items = dtInstance.rows({selected:true}).data();
      if(items.length == 0){
        this.toastr.warning('No hay alumnos seleccionados');
        return;
      }
      const modal = this.modalService.show(DialogConfirmComponent);
      (<DialogConfirmComponent>modal.content).onShow(
        "Asociar alumnos",
        "Esta por asociar la cantidad "+items.length+" de alumnos a la comision nro "+this.comision.numero+".¿Desea Continuar?");
      (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
        if (result === true) {
          let tasks = [];
          for (let index = 0; index < items.length; index++) {
            const element = items[index];
            var item = <ComisionAlumno>{};
            item.id_alumno = Number(element[1]);
            item.id_comision = this.comision.id;
            tasks.push(
              this.comisionService.alumno_asociar(item)
            );
          }
          this.consultando = true;
          observableForkJoin(tasks).subscribe(response => {
            this.toastr.success('Se han asociados alumnos exitosamente')
            this.consultando = false;
            this.volver();
          });
        }
      });
    });
  }

  volver(){
    this.router.navigate(['/comisiones/'+this.comision.id+'/ver']);
  }
}
