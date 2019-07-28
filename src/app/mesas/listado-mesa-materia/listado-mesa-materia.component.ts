import { Component, OnInit, ViewChild } from '@angular/core';
import { MesaExamenMateriaService, FiltroMesaExamenMateria } from '../../_services/mesa_examen_materia.service';
import { MesaExamenMateria } from '../../_models/mesa.examen';
import { DataTableDirective } from 'angular-datatables';
import { Departamento } from '../../_models/departamento';
import { Carrera } from '../../_models/carrera';
import { DepartamentoService } from '../../_services/departamento.service';
import { CarreraService } from '../../_services/carrera.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MateriaService } from '../../_services/materia.service';
import { Materia } from '../../_models/materia';
import { MesaMateriaEditarModalComponent } from '../componente/mesa-materia-editar-modal/mesa-materia-editar-modal.component';
import * as moment from 'moment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-listado-mesa-materia',
  templateUrl: './listado-mesa-materia.component.html',
  styleUrls: ['./listado-mesa-materia.component.scss']
})
export class ListadoMesaMateriaComponent implements OnInit {
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: MesaExamenMateria[] = [];
  departamentos:Departamento[]=[];
  carreras:Carrera[]=[];
  materias:Materia[]=[];

  request = <FiltroMesaExamenMateria>{
    search:"",
    id_departamento:0,
    id_carrera:0,
  };

  constructor(
    private mesaExamenMateriaService:MesaExamenMateriaService,
    private departamentoService:DepartamentoService,
    private carreraService:CarreraService,
    private materiaService:MateriaService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
    
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

}
