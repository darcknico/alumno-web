
import {throwError as observableThrowError,  Observable} from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class PassportInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private toastr: ToastrService,
        private authenticationService: AuthenticationService,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authenticationService.isAuthenticated()) {
            request = request.clone({
                setHeaders: { 
                    Authorization: 'Bearer '+this.authenticationService.getToken(),
                }
            });
        }
 
        return next.handle(request).pipe(catchError(x=> this.handleAuthError(x)));
    }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        if (err.status === 401 ) {
            this.router.navigateByUrl(`/login`);
            return observableThrowError(err.error);
        } else if( err.status === 403 ){
            this.toastr.clear();
            if(err.error.error.hasOwnProperty('n_password')){
                this.toastr.error("La nueva contraseña y confirmacion de la nueva contraseña no coinciden.");
            } else {
                this.toastr.error(err.error.error);
            }
            
        } else {
            this.toastr.clear();
            this.toastr.warning("Contacte al administrador del sistema","Ha ocurrido un error",{
                timeOut:0,
            });
        }
        return observableThrowError(err);
    }
}