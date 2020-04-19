import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { InscripcionService } from '../_services/inscripcion.service';
import { ToastrService } from 'ngx-toastr';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { take } from 'rxjs/operators';
import { SedeService } from '../_services/sede.service';
import { SedeProvider } from '../_providers/sede.provider';
 
@Injectable()
export class InscripcionCuotaGuard implements CanActivate {
 
    id_sede:number;
    constructor(
        private inscripcionService: InscripcionService,
        private sedeService:SedeProvider,
        private toastr: ToastrService,
        private router: Router
        ) { 
            this.id_sede = this.sedeService.getIdSede();
            this.inscripcionService.sede(this.id_sede);
            this.sedeService.id_sede$.subscribe(response=>{
                if(response>0){
                  this.id_sede = +response;
                  this.inscripcionService.sede(this.id_sede);
                }
            });
        }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean>|Promise<boolean>|boolean  {
        
        if(!AuxiliarFunction.isNullorUndefined(route.params.id_inscripcion)){
            let id_inscripcion = route.params.id_inscripcion;
            this.inscripcionService.estado_deuda(id_inscripcion).subscribe((response:any)=>{
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