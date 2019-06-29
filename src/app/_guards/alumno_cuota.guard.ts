import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AlumnoService } from '../_services/alumno.service';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
 
@Injectable()
export class AlumnoCuotaGuard implements CanActivate {
 
    constructor(
        private alumnoService:AlumnoService,
        private toastr: ToastrService,
        private router: Router,
        ) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean>|Promise<boolean>|boolean  {
        if(!AuxiliarFunction.isNullorUndefined(route.params.id_alumno)){
            let id_alumno = route.params.id_alumno;
            this.alumnoService.estado_deuda(id_alumno).subscribe((response:any)=>{
                if(response.deuda>0){
                    let deuda = AuxiliarFunction.formato_moneda(response.deuda);
                    let toast = this.toastr.warning('El alumno se encuentra con una deuda de $'+deuda+' para mas informacion click aqui','Estado Cuota',{
                        closeButton:true,
                    });
                    toast.onTap.pipe(take(1)).subscribe(()=>{
                        this.router.navigate(['/cuentacorriente/'+response.id_plan_pago+'/ver']);
                    });
                }
            });
        }
        return true;
    }
}