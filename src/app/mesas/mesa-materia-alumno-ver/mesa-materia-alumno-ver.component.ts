import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MesaExamen, MesaExamenMateriaAlumno, MesaExamenMateria } from '../../_models/mesa.examen';
import { MesaExamenMateriaService } from '../../_services/mesa_examen_materia.service';
import { MesaExamenService } from '../../_services/mesa_examen.service';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-mesa-materia-alumno-ver',
  templateUrl: './mesa-materia-alumno-ver.component.html',
  styleUrls: ['./mesa-materia-alumno-ver.component.scss']
})
export class MesaMateriaAlumnoVerComponent implements OnInit {

  mesa_examen:MesaExamen;
  mesa_examen_materia:MesaExamenMateria;

  dtOptions: DataTables.Settings = {};
  dataSource:MesaExamenMateriaAlumno[];

  @ViewChild('fileInput') fileInput: ElementRef;
  file:any=null;
  importacionDataSource:any;
  erroresDataSource:any;
  constructor(
    private mesaExamenMateriaService:MesaExamenMateriaService,
    private mesaExamenService:MesaExamenService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.mesaExamenMateriaService.sede(id_sede);
    this.mesaExamenService.sede(id_sede);

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
      ],
    };

    

    this.route.params.subscribe(params=>{
      let ids = params['id_mesa_examen_materia'];
      this.mesaExamenMateriaService.getById(ids).subscribe(response=>{
        this.mesa_examen_materia = response;

        this.mesaExamenService.getById(this.mesa_examen_materia.id_mesa_examen).subscribe(response=>{
          this.mesa_examen = response;
        });
      });
      
      this.mesaExamenMateriaService.alumnos(ids).subscribe(response=>{
        this.dataSource = response;
      });
    });
  }


  exportar(){
    let aviso = this.toastr.warning('Preparando archivo de descarga');
    this.mesaExamenMateriaService.check_in(this.mesa_examen_materia.id).subscribe(data => {
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Descarga lista');
      saveAs(data,"mesa_examen-"+this.mesa_examen_materia.materia.codigo+"-"+moment(this.mesa_examen_materia.fecha).format('DD.MM.YYYY')+".xlsx");
    });
  }

  volver(){
    this.router.navigate(['/mesas/materias']);
  }

  ver_mesa_examen(){
    this.router.navigate(['/mesas/'+this.mesa_examen.id+'/editar']);
  }

   /**
   * ARCHIVOS
   */

  onFileChange(event) {
    if(event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.fileInput.nativeElement.value = "";
      let aviso = this.toastr.warning('Importando archivo');
      this.mesaExamenMateriaService.check_out_previa(this.mesa_examen_materia.id,this.file).subscribe((response:any) => {
        this.importacionDataSource = [];
        this.erroresDataSource = [];
        this.toastr.remove(aviso.toastId);
        this.toastr.success('Importacion terminada', '');

        response.forEach(element => {
          if(element.asistencia != null && element.id_mesa_examen_materia_alumno>0){
            this.importacionDataSource.push(element);
          } 
          if( element.asistencia == null){
            element.asistencia = "El tipo de asistencia no corresponde";
            this.erroresDataSource.push(element);
          }
          if(element.id_mesa_examen_materia_alumno == 0){
            element.asistencia = "El alumno no pertenece al listado de asistencia";
            this.erroresDataSource.push(element);
          }
        });
        if(this.erroresDataSource.length == 0){
          this.erroresDataSource = null;
        }
        if(this.importacionDataSource.length == 0){
          this.importacionDataSource = null;
        }
      });
    }
  }

  cancelar(){
    this.file = null;
  }

  continuar(){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-info'});
    (<DialogConfirmComponent>modal.content).onShow("Confirmar importacion desde excel","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        let aviso = this.toastr.warning('Importando archivo');
        this.mesaExamenMateriaService.check_out(this.mesa_examen_materia.id,this.file).subscribe(response=>{
          this.toastr.remove(aviso.toastId);
          this.toastr.success('Importacion terminada', '');
          this.volver();
        });
      }
    });
  }
}
