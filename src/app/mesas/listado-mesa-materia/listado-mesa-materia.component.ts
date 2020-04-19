import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MesaExamenMateriaService, FiltroMesaExamenMateria } from '../../_services/mesa_examen_materia.service';
import { MesaExamenMateria, MesaExamen } from '../../_models/mesa.examen';
import { DataTableDirective } from 'angular-datatables';
import { Departamento } from '../../_models/departamento';
import { Carrera } from '../../_models/carrera';
import { DepartamentoService } from '../../_services/departamento.service';
import { CarreraService } from '../../_services/carrera.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { MateriaService } from '../../_services/materia.service';
import { Materia } from '../../_models/materia';
import { MesaMateriaEditarModalComponent } from '../componente/mesa-materia-editar-modal/mesa-materia-editar-modal.component';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { ReporteJobService } from '../../_services/reportejobs.service';
import { DialogInputComponent } from '../../_generic/dialog-input/dialog-input.component';
import { ReporteJob } from '../../_models/extra';
import { MesaExamenService } from '../../_services/mesa_examen.service';

@Component({
  selector: 'app-listado-mesa-materia',
  templateUrl: './listado-mesa-materia.component.html',
  styleUrls: ['./listado-mesa-materia.component.scss']
})
export class ListadoMesaMateriaComponent implements OnInit, AfterViewInit {
  @ViewChild(DataTableDirective,{static:false})dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: MesaExamenMateria[] = [];
  departamentos:Departamento[]=[];
  carreras:Carrera[]=[];
  materias:Materia[]=[];

  request = <FiltroMesaExamenMateria>{
    search:"",
    id_departamento:0,
    id_carrera:0,
    id_mesa_examen:0,
  };

  mesa_examen:MesaExamen = null;
  materia:Materia = null;

  constructor(
    private mesaExamenMateriaService:MesaExamenMateriaService,
    private mesaExamenService:MesaExamenService,
    private departamentoService:DepartamentoService,
    private carreraService:CarreraService,
    private materiaService:MateriaService,
    private reportesJobsService:ReporteJobService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
    this.route.queryParams.subscribe(params=>{
      let id_mesa_examen = params['id_mesa_examen'];
      let id_carrera = params['id_carrera'];
      if(id_mesa_examen){
        this.request.id_mesa_examen = id_mesa_examen;
      }
      if(id_carrera){
        this.request.id_carrera = +id_carrera;
      }
      if (this.router.getCurrentNavigation().extras.state) {
        this.mesa_examen = this.router.getCurrentNavigation().extras.state.mesa_examen;
        this.materia = this.router.getCurrentNavigation().extras.state.materia;
      }
    });
  }

  ngOnInit() {
    this.departamentoService.getAll().subscribe(response => {
      this.departamentos = response;
    });

    this.carreraService.getAll().subscribe(response => {
      this.carreras = response;
      let item = <Carrera>{};
      item.id = 0;
      item.nombre = "TODOS";
      this.carreras.push(item);
      this.carreras = this.carreras.reverse();
    });
    
    const that = this;

    this.dtOptions = {
      order: [[ 0, "desc" ]],
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
        this.mesaExamenMateriaService.ajax(that.request).subscribe(resp => {
            that.dataSource = resp.items;

            callback({
              recordsTotal: resp.total_count,
              recordsFiltered: resp.total_count,
              data: []
            });
          });
      },
      columns: [
        { 
          data: 'fecha',
          width: '5%', 
        }, 
        { data: 'id_materia' }, 
        { data: 'id_carrera' },
        { data: 'alumnos_cantidad' },
        { data: 'libro'},
        { data: 'folio'},
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
      responsive:true,
    };
  }

  ngAfterViewInit(): void {
    if(this.request.id_mesa_examen>0){
      this.refrescar();
      if(this.mesa_examen == null){
        this.mesaExamenService.getById(this.request.id_mesa_examen).subscribe(response=>{
          this.mesa_examen = response;
        });
      }
      if(this.materia){
        this.dtElement.dtInstance.then(instance=>{
          instance.search(this.materia.codigo).draw().ajax.reload();
        })
      }
    }
  }

  fecha_inicio(event){
    if(event == null){
      this.request.fecha_ini = "";
    } else {
      this.request.fecha_ini = moment(event).format('YYYY-MM-DD');
    }
    this.refrescar();
  }

  fecha_fin(event){
    if(event == null){
      this.request.fecha_fin = "";
    } else {
      this.request.fecha_fin = moment(event).format('YYYY-MM-DD');
    }
    this.refrescar();
  }

  ver(item:MesaExamenMateria){
    this.router.navigate(['/mesas/materias/'+item.id+'/editar']);
  }

  editar(item:MesaExamenMateria){
    const modal = this.modalService.show(MesaMateriaEditarModalComponent,{class: 'modal-info modal-lg'});
    (<MesaMateriaEditarModalComponent>modal.content).onShow(item.id_mesa_examen,item);
    (<MesaMateriaEditarModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  acta_reporte(item:MesaExamenMateria){
    let aviso = this.toastr.warning('Preparando descarga', '');
    this.mesaExamenMateriaService.reporte_acta(item.id).subscribe(data =>{
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Descarga lista');
      var mediaType = 'application/pdf';
      var blob = new Blob([data], {type: mediaType});
      var filename = "acta-nro_"+item.id+".pdf";
      //var fileURL = URL.createObjectURL(blob);
      //window.open(fileURL);
      saveAs(blob,filename)
    });
  }

  acta_imprimir(item:MesaExamenMateria){
    let aviso = this.toastr.warning('Preparando descarga', '');
    this.mesaExamenMateriaService.reporte_acta(item.id).subscribe(data =>{
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Archivo listo');
      var blob = new Blob([data], {type: 'application/pdf'});
      const blobUrl = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
    });
  }

  acta_masivo(){
    this.reportesJobsService.terminados().subscribe(response=>{
      let restantes = response.total_count;
      if(restantes>0){
        const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger' });
        (<DialogConfirmComponent>modal.content).onShow("ATENCION","Hay reportes en la cola que aun no terminan de generarse ¿Desea continuar de todas maneras?");
        (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
          if (result === true) {
            this.acta_masivo_confirmar('modal-danger');
          }
        });
      } else {
        this.acta_masivo_confirmar();
      }
    });
    
  }

  private acta_masivo_confirmar(className:string='modal-info'){
    let nombre = '';
    if(this.mesa_examen){
      let re = / /gi;
      nombre = this.mesa_examen.nombre.replace(re,'_');
    } else {
      nombre = moment().format('DD-MM-YYYY') + '_mesa_examen_materia_' + this.dataSource.length;
    }
    const modal = this.modalService.show(DialogInputComponent,{class:className });
    (<DialogInputComponent>modal.content).onShow(
      "Exportacion de actas",
      "Esta por generar un archivo comprimido con todas las actas filtradas en la tabla, esto puede llevar su tiempo. Puede fijarse en Consultas->Reportes el estado del mismo. A continuacion ingrese el nombre por el cual sera identificado.",
      'text',
      nombre);
    (<DialogInputComponent>modal.content).onClose.subscribe(result => {
      if (result.length>0) {
        let registro = <ReporteJob>{};
        registro.nombre = result;
        this.mesaExamenMateriaService.reporte_acta_masivo(this.request,registro).subscribe(response=>{
          this.toastr.success('La generacion de reportes esta por comenzar', '');
        });
      }
    });
  }

  quitar(){
    this.request.id_mesa_examen = 0;
    this.mesa_examen = null;
    this.refrescar();
  }
}
