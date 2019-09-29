import { Component, OnInit } from '@angular/core';
import { DepartamentoService } from '../../_services/departamento.service';
import { Sede } from '../../_models/sede';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { Departamento } from '../../_models/departamento';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.scss']
})
export class DepartamentoComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  departamentos:Departamento[];
  sede:Sede;
  constructor(
    private departamentoService:DepartamentoService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    ) {

  }
  ngOnInit() {
    this.departamentoService.getAll().subscribe(response=>{
      this.departamentos = response;
    });
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs: [ {
        targets: [2],
        orderable: false
        } ]
    };
  }

  nuevo(){
    this.router.navigate(['/establecimientos/departamentos/nuevo']);
  }

  editar(item:Departamento){
    this.router.navigate(['/establecimientos/departamentos/'+item.id+'/editar']);
  }

  eliminar(item:Departamento){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar Departamento","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.departamentoService.delete(item.id).subscribe(response=>{
          this.toastr.success('Departamento Eliminado', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(){
    this.departamentos = null;
    this.departamentoService.getAll().subscribe(response=>{
      this.departamentos = response;
    });
  }
}
