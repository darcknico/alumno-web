import { Component, OnInit } from '@angular/core';
import { CarreraService } from '../../_services/carrera.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Carrera } from '../../_models/carrera';
import { PlanEstudio } from '../../_models/plan_estudio';
import { PlanService } from '../../_services/plan.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-carrera-ver',
  templateUrl: './carrera-ver.component.html',
  styleUrls: ['./carrera-ver.component.scss']
})
export class CarreraVerComponent implements OnInit {

  id:number = 0;
  id_sede:number = 0;
  carrera:Carrera;
  planEstudio:PlanEstudio=null;

  constructor(
    private carreraService:CarreraService,
    private planService:PlanService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    let ids_sede = +localStorage.getItem('id_sede');
    if(ids_sede == null){
      this.router.navigate(['/establecimientos/departamentos']);
    } else {
      this.id_sede = +ids_sede;
    }
    this.route.params.subscribe(params=>{
      this.id = +params['id_carrera'];

      this.planService.carrera(this.id);

      this.carreraService.getById(this.id).subscribe(response=>{
        this.carrera = response;
        this.planEstudio = response.plan_estudio;
      });

    });
  }

  planSeleccionado(planEstudio:PlanEstudio){
    this.planEstudio = planEstudio;
    this.carrera.id_plan_estudio = planEstudio.id;
    this.carreraService.seleccionar_plan(this.carrera).subscribe(response=>{
      this.toastr.success('Plan de Estudio Seleccionado por Defecto');
    });
  }

  planCambiar(){
    this.planEstudio = null;
  }

  planEstudioModificado(event){
    this.planService.getById(this.planEstudio.id).subscribe(response=>{
      this.planEstudio = response;
    });
  }

  reporte(){
    let aviso = this.toastr.warning('Preparando descarga', '',{
      timeOut:15000,
    });
    this.planService.reporte(this.planEstudio.id).subscribe(data =>{
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Archivo listo');
      var mediaType = 'application/pdf';
      var blob = new Blob([data], {type: mediaType});
      var filename = "plan_estudio-"+this.planEstudio.codigo+".pdf";
      saveAs(blob,filename)
    });
  }

  imprimir(){
    let aviso = this.toastr.warning('Preparando descarga', '',{
      timeOut:15000,
    });
    this.planService.reporte(this.planEstudio.id).subscribe(data =>{
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
