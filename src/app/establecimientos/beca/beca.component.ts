import { Component, OnInit } from '@angular/core';
import { Beca } from '../../_models/beca';
import { BecaService } from '../../_services/beca.service';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-beca',
  templateUrl: './beca.component.html',
  styleUrls: ['./beca.component.scss']
})
export class BecaComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dataSource:Beca[];

  id_sede:number;

  constructor(
    private becaService:BecaService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    ) {

  }
  ngOnInit() {
    this.id_sede = +localStorage.getItem('id_sede');
    this.becaService.getAll().subscribe(response=>{
      this.dataSource = response;
    });
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs: [ {
        targets: [2,3],
        orderable: false
        } ]
    };
  }

  nuevo(){
    this.router.navigate(['/establecimientos/becas/nuevo']);
  }

  editar(item:Beca){
    this.router.navigate(['/establecimientos/becas/'+item.id+'/editar']);
  }

  eliminar(item:Beca){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar beca","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.becaService.delete(item.id).subscribe(response=>{
          this.toastr.success('Modalidad beca', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(){
    this.dataSource = null;
    this.becaService.getAll().subscribe(response=>{
      this.dataSource = response;
    });
  }
}
