import { Component, Input, OnInit } from '@angular/core';
import { navItems } from './../../_nav';
import { AuthenticationService } from '../../_services/authentication.service';
import { Usuario, UsuarioSede } from '../../_models/usuario';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioSedeModalComponent } from '../../modals/usuario-sede-modal/usuario-sede-modal.component';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SedeService } from '../../_services/sede.service';

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

  constructor(
    private sedeService:SedeService,
    private authenticationService:AuthenticationService,
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
  };
}
