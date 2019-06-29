import { Component, OnInit } from '@angular/core';
import { Sede } from '../../_models/sede';
import { SedeService } from '../../_services/sede.service';
import { Router } from '@angular/router';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../_models/usuario';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-sede',
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.scss']
})
export class SedeComponent implements OnInit {

  usuario:Usuario;
  dtOptions: DataTables.Settings = {};
  sedes:Sede[];

  constructor(
    private sedeService:SedeService,
    private authenticationService:AuthenticationService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    ) {

  }
  ngOnInit() {
    this.usuario = this.authenticationService.localUsuario();
    this.sedeService.getAll().subscribe(response=>{
      this.sedes = response;
    });

    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ]
    };
  }

  nuevo(){
    this.router.navigate(['/establecimientos/sedes/nuevo']);
  }

  editar(item:Sede){
    this.router.navigate(['/establecimientos/sedes/'+item.id+'/editar']);
  }

  eliminar(item:Sede){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar Sede","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.sedeService.delete(item.id).subscribe(response=>{
          this.toastr.success('Sede Eliminada', '');
          this.refrescar();
        });
      }
  });
  }

  refrescar(){
    this.sedes = null;
    this.sedeService.getAll().subscribe(response=>{
      this.sedes = response;
    });
  }
}
