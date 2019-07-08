import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlantillaImagenService } from '../../_services/plantilla_imagen.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { BlockUIService } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

declare var grapesjs: any;

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit, OnDestroy {

  editor;
  contenido:string = "";
  return:string = "";
  id;

  constructor(
    private block:BlockUIService,
    private plantillaImagenService:PlantillaImagenService,
    private auth:AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    ) {
    
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.contenido = this.router.getCurrentNavigation().extras.state.contenido;
        this.id = this.router.getCurrentNavigation().extras.state.id;
        this.return = this.router.getCurrentNavigation().extras.state.return;
      }
    });
  }

  ngOnInit() {
    this.iniciar();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  iniciar(){
    this.editor = grapesjs.init({
      avoidInlineStyle: 1,
      //height: '100%',
      container : '#gjs',
      plugins: [
        'gjs-preset-newsletter',
      ],
      pluginsOpts: {
        'gjs-preset-newsletter': {
          modalTitleImport: "Importar Template",
          importPlaceholder: "Inserte aquí el HTML y CSS inline",
          inlineCss: true,
        },
      },
      storageManager: {
        autosave: false,
        type: null,
      },
      assetManager: {
        assets: [],
        //noAssets: 'Sin <b>imagenes</b>, arrastralo aqui',
        upload: this.plantillaImagenService.url,
        uploadName: 'archivo',
        headers: {
          'Authorization':this.auth.getToken(),
        },
        credentials: 'omit',
        multiUpload:false,
        handleAdd:false,
      },
    });

    const blockManager = this.editor.BlockManager;
    let sect100 = blockManager.get('sect100');
    let sect50 = blockManager.get('sect50');
    let sect30 = blockManager.get('sect30');
    let sect37 = blockManager.get('sect37');
    let button = blockManager.get('button');
    let text = blockManager.get('text');
    let textSect = blockManager.get('text-sect');
    let image = blockManager.get('image');
    let quote = blockManager.get('quote');
    let link = blockManager.get('link');
    let linkBlock = blockManager.get('link-block');
    let gridItems = blockManager.get('grid-items');
    let listItems = blockManager.get('list-items');
    sect100.set('label','Una Sección');
    sect50.set('label','Media Sección');
    sect30.set('label','1/3 Sección');
    sect37.set('label','3/7 Sección');
    button.set('label','Botón');
    text.set('label','Texto');
    textSect.set('label','Sección de Texto');
    image.set('label','Imagen');
    quote.set('label','Citar');
    link.set('label','Enlace');
    linkBlock.set('label','Enlace Bloque');
    gridItems.set('label','Grilla');
    listItems.set('label','Listado');
    let panelManager = this.editor.Panels;
    panelManager.removeButton('options', 'gjs-toggle-images');
    panelManager.addButton('options',{
      id: 'plantillas',
      className : 'plantillas',
      label: 'Plantillas',
      command : false,
      attributes: { title: 'Ir a las plantillas'},
      active: false,
    });
    
    this.editor.on('load', ()=>{
      this.plantillaImagenService.getAll().subscribe(response=>{
        this.editor.AssetManager.assets=[];
        response.forEach(item=>{
          this.editor.AssetManager.add({
            id:item.id,
            src:item.url,
            name:item.nombre,
          });
        });
        this.editor.AssetManager.render();
      });

      if(this.contenido){
        this.editor.DomComponents.clear();
        this.editor.addComponents(this.contenido);

        panelManager.addButton('options',{
          id: 'guardar',
          className : 'guardar',
          label: 'Guardar',
          command : false,
          attributes: { title: 'Guardar la plantilla'},
          active: false,
        });
        let guardar = document.getElementsByClassName('guardar')[0];
        guardar.addEventListener('click',()=>{
          this.guardar();
        });
      }
      let plantillas = document.getElementsByClassName('plantillas')[0];
      plantillas.addEventListener('click',()=>{
        this.plantillas();
      });
      var swVisibility = panelManager.getButton('options','sw-visibility');
      var fullscreen = panelManager.getButton('options','fullscreen');
      var exportTemplate = panelManager.getButton('options','export-template');
      swVisibility.set('attributes',{title:'Ver compnentes'});
      fullscreen.set('attributes',{title:'Pantalla Completa'});
      exportTemplate.set('attributes',{title:'Exportar Template'});
    });
    this.editor.on('asset:upload:response', (response) => {
      this.editor.AssetManager.add({
        id:response.id,
        src:response.url,
        name:response.nombre,
      });
      return true;
    });
    this.editor.on('asset:remove', (item) => {
      if(item.attributes.id){
        this.plantillaImagenService.delete(item.attributes.id).subscribe(response=>{
          this.toastr.show('Imagen '+item.attributes.name+' eliminada');
        });
      }
      return true;
    });
  }

  guardar(){
    this.block.start('');
    var html = this.editor.getHtml();
    var css = this.editor.getCss();
    let contenido = '<style type="text/css" >'+css+'</style>'+html;
    let navigationExtras: NavigationExtras = {
      state: {
        contenido:contenido, 
      }
    };
    this.router.navigate([this.return,this.id,'editar'],navigationExtras).then(()=>{
      this.block.stop('');
    });
  }

  plantillas(){
    this.block.start('');
    this.router.navigate(['notificaciones','plantillas']).then(()=>{
      this.block.stop('');
    });
  }

}
