import { Component, OnInit } from '@angular/core';
import { DiariaService } from '../../_services/diaria.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Diaria } from '../../_models/diaria';

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
  ) { }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.diariaService.sede(id_sede);

    this.route.params.subscribe(params=>{
      let id = params['id_diaria'];
      this.diariaService.getById(+id).subscribe(response=>{
        this.diaria = response;
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
}
