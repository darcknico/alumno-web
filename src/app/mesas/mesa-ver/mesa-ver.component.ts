import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { MesaExamen, MesaExamenMateria } from '../../_models/mesa.examen';
import { MesaExamenService } from '../../_services/mesa_examen.service';
import { BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Carrera } from '../../_models/carrera';
import { CarreraService } from '../../_services/carrera.service';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { MesaExamenMateriaService, FiltroMesaExamenMateria } from '../../_services/mesa_examen_materia.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { MesaMateriaEditarModalComponent } from '../componente/mesa-materia-editar-modal/mesa-materia-editar-modal.component';

@Component({
  selector: 'app-mesa-ver',
  templateUrl: './mesa-ver.component.html',
  styleUrls: ['./mesa-ver.component.scss']
})
export class MesaVerComponent implements OnInit {
  @ViewChildren(DataTableDirective)dtElements: QueryList<DataTableDirective>;

  fecha_inicio:Date;

  dtOptions: DataTables.Settings = {};
  dtOptionsCierre: DataTables.Settings = {};
  dataSource:MesaExamenMateria[]=[];
  dataSourceCierre:MesaExamenMateria[]=[];
  carreras:Carrera[];
  
  mesa_examen:MesaExamen;
  consultando = false;

  request = <FiltroMesaExamenMateria>{
    search:"",
    id_carrera:0,
  };

  constructor(
    private mesaExamenService:MesaExamenService,
    private mesaExamenMateriaService:MesaExamenMateriaService,
    private carreraService:CarreraService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.route.params.subscribe(params=>{
      let ids = params['id_mesa_examen'];
      this.mesaExamenService.getById(ids).subscribe(response=>{
        this.mesa_examen = response;
      });
      
      this.request.id_mesa_examen = ids;
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
          if(this.subscription){
            this.subscription.unsubscribe();
            this.subscription = null;
          }
          that.request.start = dataTablesParameters.start;
          that.request.length = dataTablesParameters.length;
          that.request.order = dataTablesParameters.order[0].dir;
          that.request.search = dataTablesParameters.search.value;
          that.request.sort = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
          that.request.cierre = false;
          this.subscription = this.mesaExamenMateriaService.ajax(that.request).subscribe(resp => {
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
            data: 'created_at',
            width: '5%', 
          },
          { data: 'id_carrera' },{ data: 'id_plan_estudio' },{ data: 'id_materia' },{ data: 'fecha' },{ data: 'inscriptos' },{ data: 'cierre' },
        ],
        columnDefs: [ {
          targets: 'no-sort',
          orderable: false,
          },
        ],
        responsive:true,
      };

      this.dtOptionsCierre = {
        order: [[ 0, "desc" ]],
        language: {
          url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        },
        pagingType: 'full_numbers',
        pageLength: 10,
        serverSide: true,
        processing: true,
        ajax: (dataTablesParameters: any, callback) => {
          if(this.subscriptionCierre){
            this.subscriptionCierre.unsubscribe();
            this.subscriptionCierre = null;
          }
          that.request.start = dataTablesParameters.start;
          that.request.length = dataTablesParameters.length;
          that.request.order = dataTablesParameters.order[0].dir;
          that.request.search = dataTablesParameters.search.value;
          that.request.sort = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
          that.request.cierre = true;
          this.subscriptionCierre = this.mesaExamenMateriaService.ajax(that.request).subscribe(resp => {
              that.dataSourceCierre = resp.items;

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
          },
          { data: 'id_carrera' },{ data: 'id_plan_estudio' },{ data: 'id_materia' },{ data: 'fecha' },{ data: 'inscriptos' },{ data: 'cierre' },
        ],
        columnDefs: [ {
          targets: 'no-sort',
          orderable: false,
          },
        ],
        searching:false,
        responsive:true,
      };
    });
  }
  subscription:Subscription;
  subscriptionCierre:Subscription;

  ngOnInit() {
    this.carreraService.getAll().subscribe(response=>{
      this.carreras = response;
      let item = <Carrera>{};
      item.id = 0;
      item.nombre = "TODOS";
      this.carreras.push(item);
      this.carreras = this.carreras.reverse();
    });

  }

  asociar_materia_masivo(){
    this.router.navigate(['/mesas/'+this.mesa_examen.id+'/materias/disponibles']);
  }
  asociar_materia_simple(){
    const modal = this.modalService.show(MesaMateriaEditarModalComponent,{class: 'modal-info modal-lg'});
    (<MesaMateriaEditarModalComponent>modal.content).onShow(this.mesa_examen.id);
    (<MesaMateriaEditarModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  editar_materia(item:MesaExamenMateria){
    const modal = this.modalService.show(MesaMateriaEditarModalComponent,{class: 'modal-info modal-lg'});
    (<MesaMateriaEditarModalComponent>modal.content).onShow(this.mesa_examen.id,item);
    (<MesaMateriaEditarModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  ver(mesa:MesaExamenMateria){
    this.router.navigate(['/mesas/materias/'+mesa.id+'/editar']);
  }

  desasociar_materia(mesa:MesaExamenMateria){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Dar de baja la mesa de examen","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        var item = <MesaExamenMateria>{};
        item.id_mesa_examen = this.mesa_examen.id;
        item.id_materia = mesa.id_materia;
        this.mesaExamenService.materia_desasociar(item).subscribe(response=>{
          this.toastr.success('Mesa de examen dado de baja', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(){
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.ajax.reload();
      });
    });
  }

  volver(){
    this.router.navigate(['/mesas']);
  }

}
