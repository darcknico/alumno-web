import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AlumnoSede } from '../_models/alumno';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { Ajax } from '../_models/tipo';
 
export interface FiltroAlumnoSede {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_sede:number;
    id_alumno:number;
    documento:number;
}
@Injectable()
export class AlumnoSedeService {
    api:string = environment.apiUrl.slice(0, -1);
    resource:string = 'alumnos/sedes';

    get ruta(){
        return [this.api,this.resource].join('/');
    }

    constructor(
        private http: HttpClient,
        ) {
    }

    getAll(filtro:FiltroAlumnoSede = null){
        return this.http.get<AlumnoSede[]>(this.ruta, {
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    ajax(filtro:FiltroAlumnoSede):  Observable<Ajax<AlumnoSede>>{
        return this.http.get<Ajax<AlumnoSede>>(this.ruta, {
            params: AuxiliarFunction.toParams(filtro),
        });
    }

    register(item:AlumnoSede){
        return this.http.post<AlumnoSede>(this.ruta,item);
    }

    getById(id:number) {
        return this.http.get<AlumnoSede>([this.ruta,id].join('/'));
    }

    delete(id:number) {
        return this.http.delete([this.ruta,id].join('/'));
    }

}