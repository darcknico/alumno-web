import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss']
})
export class DialogConfirmComponent implements OnInit {

  titulo: string;
  descripcion: string;
  public onClose: Subject<boolean>;

  constructor(
    public bsModalRef: BsModalRef,
  ) { }

  ngOnInit() {
    this.onClose = new Subject();
  }

  onShow(titulo:string,descripcion:string=""){
    this.titulo = titulo;
    this.descripcion = descripcion;
  }

  confirmar(){
    this.onClose.next(true);
    this.bsModalRef.hide();

  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}
