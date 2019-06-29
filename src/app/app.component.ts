import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { setTheme } from 'ngx-bootstrap/utils';
import { AuthenticationService } from './_services/authentication.service';
import { SedeService } from './_services/sede.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private auth:AuthenticationService,
    private sedeService:SedeService,
    ) {
    setTheme('bs4');
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    this.auth.token$.subscribe(_=>{
      this.auth.actualizar();
      this.sedeService.actualizar();
    });

    if (this.auth.isAuthenticated()){
      this.auth.iniciar();
    }
  }
}
