import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { NovedadSistema, NovedadUsuario } from '../../_models/novedad';
import { FiltroNovedadSistema, NovedadSistemaService } from '../../_services/novedad_sistema.service';
import { Usuario } from '../../_models/usuario';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-listado-novedad-sistema-modal',
  templateUrl: './listado-novedad-sistema-modal.component.html',
  styleUrls: ['./listado-novedad-sistema-modal.component.scss']
})
export class ListadoNovedadSistemaModalComponent implements OnInit {
  public onClose: Subject<boolean>;
  dtOptions: DataTables.Settings = {};
  dataSource:NovedadSistema[];
  filtro:FiltroNovedadSistema=<FiltroNovedadSistema>{};
  usuario:Usuario;
  no_visto:NovedadUsuario[] = [];

  constructor(
    private service:NovedadSistemaService,
    private authenticationService:AuthenticationService,
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.onClose = new Subject();
    this.usuario = this.authenticationService.localUsuario();
    this.filtro.id_usuario = this.usuario.id;
    this.filtro.sort='created_at';
    this.filtro.order='desc';
    this.service.getAll(this.filtro).subscribe((response:any)=>{
      this.dataSource = response.items;
      this.no_visto = response.no_visto;
    });
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      columns:[
        {
          name:'created_at',
        },
        {
          name:'titulo',
        },
        {
          name:'descripcion',
        }
      ],
      searching:false,
      ordering:false,
      info:false,
      columnDefs: [ {
        targets: [2,3],
        orderable: false
        } ]
    };
  }

  onShow(){
    
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

  previa(item:NovedadSistema){
    var wnd = window.open("about:blank", "", "_blank,width = 600, height = 800");
    this.service.getById(item.id,this.usuario.id).subscribe(response=>{
      this.no_visto = this.no_visto.filter(novedad=>novedad.id_novedad_sistema != item.id);
      wnd.document.write(response.cuerpo);
    });
  }

  vistos(item:NovedadSistema){
    let color = '';
    if(this.no_visto){
      if(this.no_visto.find(usuario=>item.id==usuario.id_novedad_sistema)){
        color = 'bg-primary';
      }
    }
    
    return color;
  }

}
