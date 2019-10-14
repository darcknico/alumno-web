import { Component, OnInit } from '@angular/core';
import { MateriaService } from '../../_services/materia.service';
import { Materia } from '../../_models/materia';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap';
import { SedeService } from '../../_services/sede.service';
import * as moment from "moment";

@Component({
  selector: 'app-materia-ver',
  templateUrl: './materia-ver.component.html',
  styleUrls: ['./materia-ver.component.scss']
})
export class MateriaVerComponent implements OnInit {

  item:Materia;
  $historico;
  $anual;
  anio;
  constructor(
    private service:MateriaService,
    private sede:SedeService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService,
  ) { 
    let current = this.router.getCurrentNavigation();
    if(current){
      if(current.extras.state){
        this.item = current.extras.state.item;
      }
    }
  }

  ngOnInit() {
    let id_sede = this.sede.getIdSede();
    this.route.params.subscribe(params=>{
      let id = +params['id_materia'];
      this.service.getById(id).subscribe(response=>{
        this.item = response;
      });
      this.anio = moment().get('year');
      this.$historico = this.service.estadisticas_historico(id,id_sede);
      this.$anual = this.service.estadisticas_anual(id,id_sede,this.anio);
    });
  }

}
