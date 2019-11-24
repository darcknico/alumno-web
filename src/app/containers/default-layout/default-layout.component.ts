import { Component, Input, OnInit } from '@angular/core';
import { navItems } from './../../_nav';
import { AuthenticationService } from '../../_services/authentication.service';
import { Usuario, UsuarioSede } from '../../_models/usuario';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioSedeModalComponent } from '../../modals/usuario-sede-modal/usuario-sede-modal.component';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SedeService } from '../../_services/sede.service';
import { NovedadSistemaService, FiltroNovedadSistema } from '../../_services/novedad_sistema.service';
import { NovedadSistema, NovedadUsuario } from '../../_models/novedad';
import { ListadoNovedadSistemaModalComponent } from '../../modals/listado-novedad-sistema-modal/listado-novedad-sistema-modal.component';

export interface Children{
  name:string;
  url:string;
  icon:string;
  permisos:number[];
}

export interface NavItem{
  name:string;
  url:string;
  icon:string;
  permisos:number[];
  children:Children[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  public navItems:NavItem[] = [];
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;

  usuario:Usuario;
  sede:UsuarioSede;
  filtroNovedadSistema:FiltroNovedadSistema = <FiltroNovedadSistema>{};
  cantidad_no_visto:number;
  novedades:NovedadSistema[] = [];
  no_visto:NovedadUsuario[] = [];
  constructor(
    private sedeService:SedeService,
    private authenticationService:AuthenticationService,
    private novedadSistemaService:NovedadSistemaService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private toastr: ToastrService,
    ) {
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });
    this.changes.observe(<Element>this.element, {
      attributes: true
    });

  }

  ngOnInit(){
    this.route.params.subscribe(params => {
      let ids_sede = this.sedeService.getIdSede();
      if(ids_sede==null ){
        const modal = this.modalService.show(UsuarioSedeModalComponent);
        (<UsuarioSedeModalComponent>modal.content).onClose.subscribe(result => {
          if (result === true) {
            this.router.navigate(['/establecimientos/sedes']);
          } else {
            this.router.navigate(['/establecimientos/sedes']);
          }
        });
      } else {
        
      }
      
    });
    this.usuario = this.authenticationService.localUsuario();
    this.sede = this.sedeService.getSede();
    if(this.usuario){
      this.navegador(this.usuario);
    }
    
    this.authenticationService.usuario$.subscribe(usuario=>{
      this.usuario = usuario;
      this.navegador(usuario);
    });
    this.sedeService.sede$.subscribe(sede=>{
      this.sede = sede;
    });
  }

  perfil(){
    this.router.navigate(['/pages/profile']);
  }

  salir(){
    this.authenticationService.logout().subscribe(response=>{
      this.toastr.success('A salido correctamente');
      this.router.navigate(['/login']);
    });
  }

  cambiar_sede(){
    const modal = this.modalService.show(UsuarioSedeModalComponent);
    (<UsuarioSedeModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.router.navigate(['/establecimientos/sedes']);
      }
    });
  }
  ver_novedades(){
    const modal = this.modalService.show(ListadoNovedadSistemaModalComponent);
    (<ListadoNovedadSistemaModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {

      }
    });
  }

  private navegador(usuario){
    this.navItems = [];
    navItems.forEach((item:any)=>{
      this.navItems.push(item);
    });
    this.navItems = this.navItems.filter(item=>{
      if(item.permisos){
        return item.permisos.indexOf(usuario.id_tipo_usuario)>=0;
      }
      return true;
    });
    this.navItems.forEach(item=>{
      if(item.children){
        item.children = item.children.filter(child=>{
          if(child.permisos){
            return child.permisos.indexOf(usuario.id_tipo_usuario)>=0;
          }
          return true;
        });
      }
      return item;
    });

    this.filtroNovedadSistema.id_usuario = usuario.id;
    this.filtroNovedadSistema.length = 7;
    this.novedadSistemaService.getAll(this.filtroNovedadSistema).subscribe((response:any)=>{
      this.no_visto = response.no_visto;
      this.cantidad_no_visto = response.no_visto.length;
      this.novedades = response.items;
    });
  }

  previa(item:NovedadSistema){
    var wnd = window.open("about:blank", "", "_blank,width = 600, height = 800");
    this.novedadSistemaService.getById(item.id,this.usuario.id).subscribe(response=>{
      this.no_visto = this.no_visto.filter(novedad=>novedad.id_novedad_sistema != item.id);
      this.cantidad_no_visto = this.no_visto.length;
      wnd.document.write(response.cuerpo);
    });
  }

  vistos(item:NovedadSistema){
    let val = false;
    if(this.no_visto){
      if(this.no_visto.find(usuario=>item.id==usuario.id_novedad_sistema)){
        val = true;
      }
    }
    
    return val;
  }
}
