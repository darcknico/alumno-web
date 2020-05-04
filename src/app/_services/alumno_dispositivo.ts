import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { Ajax } from '../_models/tipo';
import { AlumnoDispositivo } from '../_models/alumno';

export interface FiltroAlumnoDispositivo {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;

}

@Injectable()
export class AlumnoDispositivoService {

    api:string = environment.apiUrl+'alumnos/dispositivos';

    id_sede:number;

    constructor(
        private http: HttpClient,
        ) {
    }

    sede(id_sede:number){
        this.id_sede = id_sede;
    }

    ajax(filtro:FiltroAlumnoDispositivo):  Observable<Ajax<AlumnoDispositivo>>{
        return this.http.get<Ajax<AlumnoDispositivo>>(this.api, {
            params: AuxiliarFunction.toParams(filtro)
        });
    }

    /**
     * 
     * @param item 
     * - id_alumno_dispositivo
     * - titulo
     * - cuerpo
     */
    register(item){
        return this.http.post(this.api,item);
    }
}