import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AuxiliarFunction } from '../_helpers/auxiliar.function';
import { AppAsistencia } from '../_models/app';
import { Ajax } from '../_models/tipo';
 
export interface FiltroAppAsistencia {
    search:string;
    sort:string;
    order:string;
    start:number;
    length:number;
    id_usuario:number;
    id_sede:number;
}
@Injectable()
export class AppAsistenciaService {
    api:string = environment.apiUrl+'asistencias';
    id_sede:number;
    constructor(
        private http: HttpClient,
        ) {
    }

    getAll(filtro?:FiltroAppAsistencia){
        return this.http.get<AppAsistencia[]>(this.api, {
            params: AuxiliarFunction.toParams(filtro),
        } );
    }

    ajax(filtro:FiltroAppAsistencia):  Observable<Ajax<AppAsistencia>>{
        return this.http.get<Ajax<AppAsistencia>>(this.api, {
            params: AuxiliarFunction.toParams(filtro),
        });
    }
}