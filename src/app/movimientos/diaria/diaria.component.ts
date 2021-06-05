import { Component, OnInit } from '@angular/core';
import { DiariaService } from '../../_services/diaria.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Diaria } from '../../_models/diaria';
import { DialogDateComponent } from '../../_generic/dialog-date/dialog-date.component';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BlockUIService, BLOCKUI_DEFAULT } from 'ng-block-ui';

@Component({
  selector: 'app-diaria',
  templateUrl: './diaria.component.html',
  styleUrls: ['./diaria.component.scss']
})
export class DiariaComponent implements OnInit {

  diaria:Diaria;
  siguiente:any;
  anterior:any;

  constructor(
    private diariaService:DiariaService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private block: BlockUIService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      let id = params['id_diaria'];
      this.block.start(BLOCKUI_DEFAULT);
      this.diariaService.getById(+id).subscribe(response=>{
        this.diaria = response;
        this.block.stop(BLOCKUI_DEFAULT);
      },()=>{
        this.block.stop(BLOCKUI_DEFAULT);
      });

      this.diariaService.anterior(+id).subscribe(response=>{
        this.anterior = response;
      });
      this.diariaService.siguiente(+id).subscribe(response=>{
        this.siguiente = response;
      });
    });
  }

  cambiar(item:Diaria){
    this.router.navigate(['/movimientos/diarias/'+item.id+'/ver']);
  }

  cerrar(){
    let hoy = moment();
    const modal = this.modalService.show(DialogDateComponent,{class: 'modal-danger'});
    (<DialogDateComponent>modal.content).onShow("Descartar diaria","Los movimientos que lo comprenden no seran eliminados.",hoy.toDate());
    (<DialogDateComponent>modal.content).onClose.subscribe(result => {
      if (result != null) {
        let fecha = moment(result);
        if(!fecha.isValid()){
          return;
        }
        let data = <Diaria>{
          id: this.diaria.id,
          fecha_inicio: this.diaria.fecha_inicio,
          fecha_fin: fecha.format('YYYY-MM-DD'),
        };
        this.diariaService.update(data).subscribe(response=>{
          this.toastr.success('Diaria cerrada', '');
          this.router.navigate(['/movimientos/diarias']);
        });
      }
    });
  }
}
