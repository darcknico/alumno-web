import { Component, OnInit } from '@angular/core';
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
export class DocenteVerComponent implements OnInit {

  docente:Docente;

  constructor(
    private service:DocenteService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      let id = +params['id'];
      this.service.getById(id).subscribe(response=>{
        this.docente = response;
      });
    });
  }

}
