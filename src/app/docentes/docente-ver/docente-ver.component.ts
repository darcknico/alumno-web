import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DocenteService } from '../../_services/docente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Docente } from '../../_models/usuario';

@Component({
  selector: 'app-docente-ver',
  templateUrl: './docente-ver.component.html',
  styleUrls: ['./docente-ver.component.scss']
})
export class DocenteVerComponent implements OnInit,AfterViewInit {

  id;
  docente:Docente;

  constructor(
    private service:DocenteService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService,
  ) {
    this.route.params.subscribe(params=>{
      this.id = +params['id'];
      
    });
  }

  ngOnInit() {
    
  }

  ngAfterViewInit(){
    this.service.getById(this.id).subscribe(response=>{
      this.docente = response;
    });
  }

}
