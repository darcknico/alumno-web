import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService,FiltroUsuario } from '../../_services/usuario.service';
import { Usuario, TipoUsuario } from '../../_models/usuario';
import { Router } from '@angular/router';
import { SedeService } from '../../_services/sede.service';
import { Sede } from '../../_models/sede';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Carrera } from '../../_models/carrera';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { DialogInputComponent } from '../../_generic/dialog-input/dialog-input.component';
import { PasswordModalComponent } from '../componentes/password-modal/password-modal.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {
  
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  usuarios: Usuario[] = [];
  sedes:Sede[]=[];
  tipo_usuarios:TipoUsuario[]=[];

  request = <FiltroUsuario>{
    search:"",
    id_sede:0,
    id_tipo_usuario:0,
  };
  constructor(
    private usuarioService:UsuarioService,
    private sedeService:SedeService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.sedeService.getAll().subscribe(response => {
      this.sedes = response;
    });
    this.usuarioService.tipos().subscribe(response=>{
      this.tipo_usuarios = response;
    });
    const that = this;

    this.dtOptions = {
      order:[[0,'desc']],
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.request.start = dataTablesParameters.start;
        that.request.length = dataTablesParameters.length;
        that.request.order = dataTablesParameters.order[0].dir;
        that.request.search = dataTablesParameters.search.value;
        that.request.sort = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        this.usuarioService.ajax(that.request).subscribe(resp => {
            that.usuarios = resp.items;

            callback({
              recordsTotal: resp.total_count,
              recordsFiltered: resp.total_count,
              data: []
            });
          });
      },
      columns: [
        { 
          data: 'created_at',
          width: '5%', 
        }, { data: 'nombre' }, { data: 'email' },{ data: 'telefono'}, { data: 'id_tipo_usuario'}
      ],
      responsive:true,
    };
  }

  nuevo(){
    this.router.navigate(['/admin/usuarios/nuevo']);
  }

  editar(item:Usuario){
    this.router.navigate(['/admin/usuarios/'+item.id+'/editar']);
  }

  contrasenia(item:Usuario){
    const modal = this.modalService.show(PasswordModalComponent);
    (<PasswordModalComponent>modal.content).onShow(item);
    (<PasswordModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  bloquear(item:Carrera){
    const modal = this.modalService.show(DialogConfirmComponent);
    (<DialogConfirmComponent>modal.content).onShow("Bloquear Usuario","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.usuarioService.delete(item.id).subscribe(response=>{
          this.toastr.warning('Usuario Bloqueado', '');
          this.refrescar();
        });
      }
    });
  }

  desbloquear(item:Carrera){
    const modal = this.modalService.show(DialogConfirmComponent);
    (<DialogConfirmComponent>modal.content).onShow("Desbloquear Usuario","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.usuarioService.desbloquear(item.id).subscribe(response=>{
          this.toastr.warning('Usuario Desbloqueado', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }
}
