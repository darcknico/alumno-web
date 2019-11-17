import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Alumno, AlumnoArchivo } from '../../../_models/alumno';
import { AlumnoService } from '../../../_services/alumno.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-alumno-ver-modal',
  templateUrl: './alumno-ver-modal.component.html',
  styleUrls: ['./alumno-ver-modal.component.scss']
})
export class AlumnoVerModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  alumno:Alumno;
  archivos:AlumnoArchivo[]=[];

  constructor(
    private service:AlumnoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private sanitizer : DomSanitizer,
    public bsModalRef: BsModalRef,
    private router: Router,
    ) { 
      
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  onShow(alumno:Alumno){
    this.alumno = alumno;
    
    this.service.getById(this.alumno.id).subscribe(response=>{
      this.alumno = response;
      this.archivos = response.archivos;
      this.archivos.forEach(archivo=>{
        if(archivo.nombre){
          this.service.archivo(archivo).subscribe(blob=>{
            let urlCreator = window.URL;
            archivo.url = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(blob));
          });
        }
        return archivo;
      });
    });
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

  ver(){
    this.onClose.next(true);
    this.bsModalRef.hide();
  }

  descargar(item:AlumnoArchivo){
    this.toastr.success('Preparando Descarga', '');
    this.service.archivo(item).subscribe(data => saveAs(data,item.nombre));
  }

}
