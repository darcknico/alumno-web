import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { first } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string;
  loading = false;
  submitted = false;

  bsModalRef: BsModalRef;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });
 
    this.authenticationService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.loginForm.controls; }

  login(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
        return;
    }
    this.loading = true;
    this.authenticationService.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        errores => {
          console.log(errores);
            this.loading = false;
            var error:string = errores.error;
            this.bsModalRef = this.modalService.show(AutorizacionErrorModalComponent, {
              initialState:{
                error: error,
              }
            });
            this.bsModalRef.content.closeBtnName = 'Close';
        });
  }

  register(): void {
    this.router.navigate(['/register']);
  }

  forgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}

@Component({
  selector: 'modal-content',
  template: `
      <div class="modal-header">
        <h4 class="modal-title">Autenticacion</h4>
        <button type="button" class="close" (click)="bsModalRef.hide()" aria-label="Cerrar">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>{{error}}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="bsModalRef.hide()">Cerrar</button>
      </div>
  `
})
 
export class AutorizacionErrorModalComponent implements OnInit {
  error: string;
  closeBtnName: string;
  list: any[] = [];

  public dangerModal;
 
  constructor(public bsModalRef: BsModalRef) {}
 
  ngOnInit() {
    this.list.push('PROFIT!!!');
  }
}